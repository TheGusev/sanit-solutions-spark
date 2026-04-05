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
RUN npm run build 2>&1 | tee /tmp/build-output.log && \
    SSG_COUNT=$(find /app/dist -name "index.html" | wc -l) && \
    echo "SSG pages: $SSG_COUNT" && \
    if [ "$SSG_COUNT" -lt 500 ]; then \
      echo "=== FAIL: only $SSG_COUNT pages (threshold: 500) ===" && \
      echo "--- dist/ top-level ---" && ls -la /app/dist/ | head -30 && \
      echo "--- dist/uslugi/ ---" && ls /app/dist/uslugi/ 2>/dev/null | head -20 || echo "NO uslugi dir" && \
      echo "--- build log tail ---" && tail -100 /tmp/build-output.log && \
      exit 1; \
    fi

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
