

# План: убрать конфликт порта 3001 на push-server (правильно — без проброса на хост)

## Корень проблемы (точная диагностика по коду)

Карта взаимодействий push-server в текущем репозитории:

```
[ Браузер ] → https://goruslugimsk.ru/api/push/...
                ↓
[ host nginx (Dokploy) ] → 127.0.0.1:5173
                ↓
[ контейнер goruslugimsk (nginx) ] → location /api/push/
                ↓                     proxy_pass http://push-server:3001
                ↓                     ← это ИМЯ контейнера в docker-сети, НЕ хост
[ контейнер push-server (node) ] → app.listen(3001)
```

**Где конфликт:** в `docker-compose.yml` строка `"3001:3001"` принудительно пробрасывает 3001 контейнера на **3001 хоста**. На хосте этот порт занят PM2 (`owndev-backend`). Docker не может забиндить порт → весь push-server не стартует.

**Почему проброс не нужен:** nginx-контейнер ходит к push-server **по имени** (`http://push-server:3001`) через внутреннюю docker-сеть `default`. Это резолвится Docker DNS (resolver `127.0.0.11` уже в конфиге, строка 288 nginx.conf) и работает без всякого хостового порта. Внешнего доступа к 3001 ни откуда не требуется — браузер ходит только на `https://goruslugimsk.ru/api/push/`, а это уже идёт через nginx.

## Решение: убрать проброс совсем (вариант чище, чем смена на 3002)

**Не нужно** менять `3001:3001` на `3002:3001` и потом править nginx-конфиг. Вместо этого правильнее **полностью удалить секцию `ports`** у `push-server` — сервис останется доступен только внутри docker-сети (что и нужно), а на хосте порт вообще не будет занят. Это:

- убирает конфликт с PM2 раз и навсегда;
- не требует изменений nginx (внутри контейнера всё работает по имени `push-server:3001`);
- уменьшает атак-поверхность (3001 не торчит наружу хоста);
- идиоматично для compose: «внутренние сервисы — без `ports`, только `expose` или вообще ничего».

## Файлы которые правлю (1 файл, 2 строки)

### `docker-compose.yml`

Удаляю строки 27-28 (`ports: - "3001:3001"`). Готовый блок:

```yaml
  push-server:
    image: node:20-alpine
    container_name: push-server
    working_dir: /app
    command: sh -c "npm i && node push-server.js"
    volumes:
      - ./push-server.js:/app/push-server.js
      - ./push-server-package.json:/app/package.json
      - push-data:/data
    restart: unless-stopped
    environment:
      - VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}
      - VAPID_PRIVATE_KEY=${VAPID_PRIVATE_KEY}
```

Всё. Внутренний порт 3001 контейнера остаётся (это `app.listen(3001)` в `push-server.js` — не трогаем), но наружу хоста не пробрасывается.

## Что НЕ трогаю и почему

- **`push-server.js` (`app.listen(3001)`)** — это внутренний порт контейнера, конфликтов нет.
- **`nginx.conf` (`http://push-server:3001`)** — это резолв по имени контейнера в docker-сети, работает независимо от хостовых портов.
- **`docker-entrypoint.sh`** — там тот же `http://push-server:3001` для legacy-фолбэка, тоже не трогаем.
- **PM2 owndev-backend** — вообще другой проект, он остаётся на 3001 хоста как и был.

## Серверная процедура после моих правок

После моего коммита нужно на сервере:

```bash
cd /etc/dokploy/applications/service-goruslugimsk-6jrp9b/code
# Сбросить локальные правки compose если они есть (как в прошлый раз)
git checkout -- docker-compose.yml 2>/dev/null || true
git pull origin main
# Снести старые контейнеры и поднять заново
docker rm -f push-server goruslugimsk 2>/dev/null
docker compose up -d --remove-orphans
```

## Проверка после деплоя

```bash
# 1. Оба контейнера Up, у push-server в колонке PORTS должно быть пусто или только internal
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep -E 'goruslugimsk|push-server'

# 2. Хостовый 3001 остаётся за PM2 (owndev), 5173 — за нашим nginx
ss -tlnp | grep -E ':3001|:5173'

# 3. Push API работает через домен (через внутренний proxy)
curl -s https://goruslugimsk.ru/api/push/vapid-public-key
# ожидаемо: {"key":"..."}

# 4. Internal-резолв работает (опционально, для отладки)
docker exec goruslugimsk wget -qO- http://push-server:3001/api/push/vapid-public-key
```

## Параллельно — вопрос security-headers

В прошлый раз была подозрение что external reverse-proxy (host nginx Dokploy) режет наши `add_header`. После того как push-server поднимется, выполняем сравнение:

```bash
echo "--- ИЗ КОНТЕЙНЕРА (источник) ---"
curl -sI http://127.0.0.1:5173/ | grep -iE 'strict-transport|x-frame|x-content|referrer|permissions|cross-origin'

echo "--- ЧЕРЕЗ ДОМЕН (после host nginx) ---"
curl -sI https://goruslugimsk.ru/ | grep -iE 'strict-transport|x-frame|x-content|referrer|permissions|cross-origin'
```

Если первый блок показывает все 7 заголовков, а второй — нет/меньше → host nginx (Dokploy) их фильтрует. Тогда отдельным шагом нужно либо:
- добавить `proxy_pass_header` в host-конфиг Dokploy для нашего сайта;
- либо включить пропуск заголовков от upstream в Dokploy UI;
- либо продублировать заголовки на host-уровне.

Это уже отдельная задача после фикса push-server, не смешиваю.

## Прогноз

- Конфликт порта 3001 устраняется навсегда (а не до следующего ребута PM2).
- Push-сервер остаётся полностью функциональным через домен.
- Никаких ручных правок nginx, никаких изменений в коде кроме 2 удалённых строк в compose.
- Следующие деплои `/root/deploy.sh` отрабатывают чисто.

