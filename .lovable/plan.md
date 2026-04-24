

# Добавление автодеплоя через GitHub Actions

## Что делаю

Создаю **один новый файл** `.github/workflows/deploy.yml` с предоставленным содержимым. Существующие workflow в `.github/workflows/` (docker-build.yml, daily-indexnow.yml, lighthouse.yml, monitoring.yml) **не трогаю**.

## Содержимое файла

```yaml
name: Deploy to Server

on:
  workflow_run:
    workflows: ["Build and Push Docker Image"]
    types: [completed]
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.event.workflow_run.conclusion == 'success'

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: /root/deploy.sh
```

## Как это будет работать

1. Push в `main` → триггерится `docker-build.yml` (имя workflow: **"Build and Push Docker Image"**) — собирает образ и пушит в Docker Hub.
2. После успешного завершения сборки → триггерится `deploy.yml` (через `workflow_run`).
3. `appleboy/ssh-action` подключается к серверу по SSH (используя секреты `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, которые уже есть в репо) и запускает `/root/deploy.sh`.
4. `deploy.sh` делает `git pull`, перезапускает docker compose, проверяет HTTP-коды.

## Что нужно проверить заранее (до approve)

Я хочу убедиться что имя workflow в `docker-build.yml` действительно `"Build and Push Docker Image"` — иначе `workflow_run` не сработает. Это единственный риск. Проверю файл перед записью и при необходимости синхронизирую имена.

## Что НЕ трогаю

- `docker-build.yml` — без изменений (только сверю `name:`).
- `daily-indexnow.yml`, `lighthouse.yml`, `monitoring.yml` — без изменений.
- `deploy.sh` на сервере — без изменений.
- Никакой логики приложения, никакого кода — только новый CI-файл.

## Прогноз

После merge в `main` следующий push автоматически:
1. Соберёт Docker-образ (~3-5 мин).
2. Через 5-10 секунд после успешной сборки — задеплоится на сервер (~30-60 сек).
3. В логах GitHub Actions → Deploy to Server → можно будет видеть вывод `deploy.sh` (включая HTTP-проверки 200/404/410).

Больше не нужно вручную ходить на сервер и делать `/root/deploy.sh` после каждого фикса.

