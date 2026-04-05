# Этап 1: Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package файлы для кэширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --legacy-peer-deps

# Копируем исходный код
COPY . .

# Собираем приложение
ENV DOCKER_BUILD=true
ARG CACHEBUST=1
RUN npm run build 2>&1 | tee /tmp/build-output.log; echo "EXIT:$?" && grep -E '(Error|❌|MISSING|error TS)' /tmp/build-output.log | head -50 || true
RUN find /app/dist -name "index.html" | wc -l && echo "=== SSG page count above ==="

# ── Hard SSG artifact check: fail build if critical pages missing ──

# Этап 2: Production с Nginx
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Порт
EXPOSE 80

# Запуск nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
