# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/51cb7089-b556-4c73-ad6d-780752106744

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/51cb7089-b556-4c73-ad6d-780752106744) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## CI/CD: Автоматическая сборка Docker-образа

При каждом push в `main` GitHub Actions автоматически собирает Docker-образ и пушит на Docker Hub.

**Docker-образ:** `thegusev/sanit-solutions:latest`

### Настройка GitHub Secrets

1. Перейди в репозиторий → **Settings** → **Secrets and variables** → **Actions**
2. Добавь два секрета:
   - `DOCKER_USERNAME` — твой логин на Docker Hub (например: `thegusev`)
   - `DOCKER_PASSWORD` — Access Token от Docker Hub (**не пароль!**)

### Как получить Docker Hub Access Token

1. Зайди на https://hub.docker.com/settings/security
2. Нажми **"New Access Token"**
3. Дай имя (например, "GitHub Actions"), выбери права **Read & Write**
4. Скопируй токен в GitHub Secret `DOCKER_PASSWORD`

### Важно: Сделай репозиторий публичным

1. Создай репозиторий на Docker Hub: https://hub.docker.com/repository/create
2. Имя: `sanit-solutions`
3. Visibility: **Public** (чтобы сервер мог пуллить без авторизации)

### Обновление на сервере

После push в main, GitHub Actions автоматически соберёт и запушит образ (~2-3 минуты).

```bash
# Вариант 1: Docker Compose (рекомендуется)
docker compose pull && docker compose up -d

# Вариант 2: Docker Swarm (Dokploy)
docker service update --image thegusev/sanit-solutions:latest service-goruslugimsk-6jrp9b

# Вариант 3: Ручной pull
docker pull thegusev/sanit-solutions:latest
docker stop goruslugimsk && docker rm goruslugimsk
docker run -d --name goruslugimsk -p 5173:80 --restart unless-stopped thegusev/sanit-solutions:latest
```

### Проверка статуса сборки

Статус билда виден во вкладке **Actions** в GitHub репозитории.

---

## Деплой на production сервер (legacy)

### Требования
- Docker и Docker Compose установлены на сервере
- Traefik (или другой reverse proxy) настроен на порт 5173

### Быстрый деплой (из готового образа)

```bash
# Скачать и запустить
docker compose pull && docker compose up -d

# Проверить статус
docker compose ps
```

### Локальная сборка (если нужно)

```bash
# Раскомментировать build в docker-compose.yml, затем:
docker compose up -d --build
```

### Проверка работоспособности

```bash
# Должен вернуть HTTP 200
curl -I http://localhost:5173/

# Должен вернуть HTTP 404 (не 200!)
curl -I http://localhost:5173/abrakadabra

# Должен вернуть HTTP 410 (legacy WordPress URLs)
curl -I http://localhost:5173/wp-admin/
```

### Архитектура

```
Traefik (443/80) → Docker container (5173) → Nginx (80) → Static files
```

---

## Lovable Cloud Deployment

Simply open [Lovable](https://lovable.dev/projects/51cb7089-b556-4c73-ad6d-780752106744) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
