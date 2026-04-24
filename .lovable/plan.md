

# Фикс деплоя — конфликт имени `push-server`

## Что произошло

Деплой **не завершился полностью**. Скрипт напечатал «✅ Деплой завершен», но это ложь — он печатает финальную строку безусловно (нет `set -e` после `docker compose up`). Реально упало с ошибкой:

```text
Error response from daemon: Conflict.
The container name "/push-server" is already in use by container 8c5bcd39f342...
```

И следом:
```text
Error response from daemon: No such container: goruslugimsk
```

Что это значит:
1. **Старый контейнер `push-server`** остался от предыдущего ручного запуска (или от другого compose-проекта на этом же сервере). Docker Compose не может пересоздать контейнер с таким же именем.
2. **Контейнер `goruslugimsk` снесён** при попытке `Recreate`, но новый не поднялся, потому что весь `compose up` отвалился на push-server.
3. **Сайт сейчас лежит** (старый контейнер удалён, новый не создан) — на проде nginx-прокси отдаёт 502/down.

Дополнительный фон:
- `nginx.service` на хосте — это **внешний reverse-proxy** (Dokploy), не наш контейнер. Он работает, но проксирует в пустоту.
- Warning `version is obsolete` в `docker-compose.yml` — косметика, не блокирует.

## Причина конфликта (root cause)

В `docker-compose.yml` явно задано `container_name: push-server`. На сервере этот контейнер был запущен **ранее** другим способом (раньше отдельно через `docker run` или из старого compose-проекта `service-goruslugimsk-6jrp9b`). После переименования compose-проекта в Dokploy старый контейнер «осиротел» — Compose его не видит как «свой» и не удаляет, но имя `/push-server` занято.

`docker compose down` тоже не помогает, потому что Compose работает только со «своими» контейнерами текущего проекта.

## План фикса (3 шага, ~30 секунд на сервере)

### Шаг 1 — Поднять прод немедленно (ручной разовый фикс)

Надо выполнить на сервере одну команду, которая снесёт «осиротевший» push-server и запустит compose заново:

```bash
docker rm -f push-server goruslugimsk 2>/dev/null; \
cd /etc/dokploy/applications/service-goruslugimsk-6jrp9b/code && \
docker compose up -d
```

Что делает:
1. Принудительно удаляет оба контейнера если они есть (флаг `-f` — даже работающие; `2>/dev/null` — не ругаться если их нет).
2. Переходит в директорию compose-проекта Dokploy.
3. Поднимает заново — теперь имена свободны, оба контейнера стартуют чисто.

После этого сайт поднимется, OwnDev увидит свежий HTML с нашими изменениями (короткий title, FAQPage schema, security headers).

### Шаг 2 — Защитить `deploy.sh` от рецидива

Проблема будет повторяться при каждом deploy если кто-то снова запустит push-server вручную. Правлю `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🔄 Pulling latest changes..."
git pull origin main

echo "🧹 Cleaning up orphaned containers..."
docker compose down --remove-orphans 2>/dev/null || true
docker rm -f push-server goruslugimsk 2>/dev/null || true

echo "🐳 Building and starting container..."
docker compose up -d --build --remove-orphans

echo "✅ Deployment complete!"
docker compose ps

# ... остальные curl-проверки без изменений
```

Изменения:
- Добавлен `docker compose down --remove-orphans` перед `up` — снимает все контейнеры проекта чисто.
- Добавлен явный `docker rm -f` для двух именованных контейнеров — страховка от orphaned/manual-запусков.
- Флаг `--remove-orphans` в `up` — убирает контейнеры, которые больше не описаны в compose-файле.
- `|| true` на cleanup — не падать если контейнеров нет.
- `set -e` теперь корректно прервёт скрипт при реальной ошибке (а не покажет ложное «✅»).

### Шаг 3 — Убрать obsolete warning в `docker-compose.yml`

Строка `version: '3.8'` — устаревшая. Современный Docker Compose v2 её игнорирует и ругается. Просто удаляю первую строку. Косметика, но чище логи.

## Файлы которые правлю

```text
deploy.sh           — добавляю cleanup-блок + --remove-orphans + честный set -e
docker-compose.yml  — удаляю строку `version: '3.8'`
```

## Что НЕ трогаю

- `Dockerfile`, `nginx.conf`, `docker-entrypoint.sh` — работают корректно.
- Весь предыдущий пакет правок 100/100 (security headers, schema, title) — он уже в репозитории и подхватится при build.
- Push-server код (`push-server.js`) — без изменений.
- Системный `nginx.service` (Dokploy) — не наш слой.

## После моих правок — последовательность для вас

1. Я внесу правки в репозиторий (`deploy.sh` + `docker-compose.yml`).
2. На сервере **один раз** выполнить ручной фикс из Шага 1 (он снесёт orphan и поднимет всё чисто с уже задеплоенным образом):
   ```bash
   docker rm -f push-server goruslugimsk 2>/dev/null; \
   cd /etc/dokploy/applications/service-goruslugimsk-6jrp9b/code && \
   git pull origin main && \
   docker compose up -d --build --remove-orphans
   ```
3. Проверить:
   ```bash
   docker ps | grep -E 'goruslugimsk|push-server'   # оба должны быть Up
   curl -I https://goruslugimsk.ru/ | grep -E 'HSTS|X-Frame|X-Content'  # видим security headers
   curl -s https://goruslugimsk.ru/ | grep -c FAQPage     # ≥1
   curl -s https://goruslugimsk.ru/ | grep -c BreadcrumbList  # ≥1
   ```
4. Со следующего раза `/root/deploy.sh` будет работать чисто без ручных команд.

## Прогноз

- Сайт поднимется в течение 10-20 секунд после ручного фикса.
- OwnDev увидит свежий HTML — повторный аудит покажет 99-100/100.
- Проблема конфликта имён больше не повторится при будущих деплоях.

