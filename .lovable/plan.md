# Дожимаем прод: PM2 мешает `push-server`, плюс проверяем security headers до 100/100

## Что уже подтверждено

- Основной сайт **жив**: контейнер `goruslugimsk` поднялся.
- На проде уже видны наши SEO/schema-правки:
  - `FAQPage` найден
  - `BreadcrumbList` найден
- Текущий блокер — **не сайт**, а отдельный `push-server`.

## Корневая причина текущей ошибки

Порт **3001** занят **не Docker-контейнером**, а **PM2**:

```text
LISTEN 0.0.0.0:3001 users:(("PM2 v6.0.14: Go", ...))
```

Из-за этого `docker compose` не может запустить контейнер `push-server`:

```text
failed to bind host port 0.0.0.0:3001/tcp: address already in use
```

То есть сейчас конфликт уже не в `container_name`, а в том, что **старый push-сервер всё ещё автоподнимается через PM2**.

## Важное дополнительное наблюдение

По вашему `curl`:
- `FAQPage` = 1
- `BreadcrumbList` = 1
- но grep по security headers **ничего не вывел**

Это значит: SEO/schema-часть уже на проде, а вот **HTTP-заголовки защиты на внешнем домене пока не видны**. Их нужно добить отдельно, скорее всего на уровне внешнего reverse-proxy.

## Ещё один хвост в коде, который нужно убрать

Я нашёл остаток запрещённой формулировки **«санитарная обработка»** в:

```text
src/pages/IndexSSR.tsx
```

Сейчас там в meta keywords всё ещё есть:

```text
..., санитарная обработка
```

Это надо удалить в следующем коммите, потому что вы это прямо запретили.

## План фикса

### 1. Убрать PM2 как источник порта 3001

На сервере нужно не просто убить процесс, а **отключить его автоперезапуск**.

Что проверить и выключить:

```bash
pm2 list
pm2 show all
pm2 delete all
pm2 save --force
pm2 kill
systemctl list-unit-files | grep -i pm2
```

Если увидите сервис вроде `pm2-root.service`, его нужно остановить и отключить:

```bash
systemctl stop pm2-root
systemctl disable pm2-root
systemctl mask pm2-root
```

После этого проверить:

```bash
ss -tlnp 'sport = :3001'
```

Ожидаемо: порт 3001 **не слушается никем**.

### 2. Поднять `push-server` уже через compose

Когда 3001 освобождён:

```bash
docker ps -a --filter "name=goruslugimsk" --filter "name=push-server" -q | xargs -r docker rm -f
cd /etc/dokploy/applications/service-goruslugimsk-6jrp9b/code
docker compose up -d --remove-orphans
```

Потом проверить:

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep -E 'goruslugimsk|push-server'
docker logs --tail=100 push-server
```

Ожидаемо:
- `goruslugimsk` — Up
- `push-server` — Up
- в логах `Push server :3001 OK`

### 3. Проверить, что push-маршрут реально работает

После старта контейнера:

```bash
curl -s http://127.0.0.1:3001/api/push/vapid-public-key
curl -sI http://127.0.0.1:5173/api/push/vapid-public-key
curl -sI https://goruslugimsk.ru/api/push/vapid-public-key
```

Это покажет три слоя:
- сам push-сервер
- nginx внутри контейнера
- внешний домен

## 4. Добить security headers до внешнего домена

Сейчас нужно сравнить:

```bash
curl -sI http://127.0.0.1:5173/ | grep -iE 'strict-transport|x-frame|x-content|referrer|permissions|cross-origin'
curl -sI https://goruslugimsk.ru/ | grep -iE 'strict-transport|x-frame|x-content|referrer|permissions|cross-origin'
```

### Интерпретация

**Сценарий A: локально есть, на домене нет**
- значит заголовки режет/не пробрасывает **внешний nginx/Dokploy**
- тогда те же заголовки нужно добавить в **внешний vhost** домена

**Сценарий B: нигде нет**
- значит текущий контейнер/образ запущен не с тем `nginx.conf`
- тогда нужен повторный rebuild/redeploy уже после зачистки push/PM2

## 5. Следующий коммит в репозиторий

После серверного восстановления я внесу ещё один маленький чистовой фикс:

```text
src/pages/IndexSSR.tsx
```

- удалить ключевик `санитарная обработка` из `meta keywords`

Это обязательная правка, потому что фраза противоречит вашему прямому запрету.

## Что НЕ трогаю

- маршрутизацию
- sitemap
- SSG pipeline
- схему FAQ/Breadcrumb — она уже доехала на прод
- push-архитектуру целиком — только восстанавливаю нормальный запуск через Docker вместо PM2

## Ожидаемый результат

После выполнения:
- сайт остаётся доступным
- `push-server` стартует без конфликта
- `/api/push/*` снова работает
- security headers либо появятся сразу, либо станет понятно, что их надо добавить во внешний nginx
- из кода будет окончательно убрана запрещённая фраза `санитарная обработка`
- после этого можно делать повторный прогон OwnDev уже на полностью чистой конфигурации