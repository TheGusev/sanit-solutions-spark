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
RUN npm run build

# ── Hard SSG artifact check: fail build if critical pages missing ──
RUN echo "=== SSG Build Verification ===" && \
    test -f dist/uslugi/dezinsekciya/klopy/index.html || (echo "❌ FATAL: dist/uslugi/dezinsekciya/klopy/index.html missing — SSG failed" && exit 1) && \
    test -f dist/uslugi/dezinsekciya/blohi/index.html || (echo "❌ FATAL: dist/uslugi/dezinsekciya/blohi/index.html missing — SSG failed" && exit 1) && \
    test -f dist/rajony/arbat/index.html || (echo "❌ FATAL: dist/rajony/arbat/index.html missing — SSG failed" && exit 1) && \
    TOTAL=$(find dist -name "index.html" | wc -l) && \
    echo "✅ SSG pages generated: $TOTAL" && \
    if [ "$TOTAL" -lt 500 ]; then echo "❌ FATAL: Only $TOTAL pages, expected 500+" && exit 1; fi && \
    echo "✅ SSG build verification passed"

# Этап 2: Production с Nginx
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Порт
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
