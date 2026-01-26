# 📊 Мониторинг сайта goruslugimsk.ru

> **Документ для отслеживания состояния сайта и работы с AI-ассистентом**

## 🔗 Основные ссылки

### Продакшн
- **Сайт**: https://goruslugimsk.ru
- **Сервер**: VPS с Dokploy
- **Деплой команда**: `deploy` (на сервере)

### GitHub
- **Репозиторий**: https://github.com/TheGusev/sanit-solutions-spark
- **Actions**: https://github.com/TheGusev/sanit-solutions-spark/actions
- **Ветка**: main

### SEO & Аналитика
- **Яндекс Вебмастер**: https://webmaster.yandex.ru/site/https:goruslugimsk.ru:443/dashboard/
- **Google Search Console**: https://search.google.com/search-console?resource_id=https%3A%2F%2Fgoruslugimsk.ru%2F
- **Яндекс Метрика**: [добавить ссылку]
- **Google Analytics**: [добавить ссылку]

### Инструменты проверки
- **PageSpeed Insights**: https://pagespeed.web.dev/analysis?url=https://goruslugimsk.ru
- **Lighthouse**: встроен в CI/CD (.github/workflows/lighthouse.yml)

---

## 🏗️ Техническая информация

### Стек технологий
- **Frontend**: React 18 + TypeScript
- **Сборщик**: Vite
- **Роутинг**: React Router v6
- **UI**: Tailwind CSS + Radix UI
- **Backend**: Supabase
- **Деплой**: Docker + GitHub Actions + Dokploy

### Структура проекта
```
/src
  /components   - Переиспользуемые компоненты
  /pages        - Страницы сайта
  /lib          - Утилиты и хелперы
  /data         - Данные (услуги, города и т.д.)
/public         - Статические файлы
/scripts        - Скрипты автоматизации
nginx.conf      - Конфигурация Nginx
Dockerfile      - Docker образ
vite.config.ts  - Конфигурация Vite
```

### Деплой процесс
1. Push в ветку `main`
2. GitHub Actions запускает workflow "Build and Push Docker Image"
3. Собирается Docker image и пушится в Docker Hub (thegusev/sanit-solutions:latest)
4. На сервере выполняется: `deploy`
5. Dokploy подтягивает новый image и перезапускает контейнер

---

## 📝 История изменений

### 26.01.2026
- ✅ **Исправлены ссылки на услуги** (коммит 556c0fa)
  - Было: `/moscow-oblast/{city}/{service}` → 404
  - Стало: `/uslugi/{service}` → работает
  - Файл: `src/pages/MoscowRegionCityPage.tsx` строка 183

- ✅ **Исправлен синтаксис vite.config.ts** (коммит 471a5bd)
  - Проблема: `filter(Boolean)],` внутри массива plugins
  - Решение: `].filter(Boolean),`
  - Docker build теперь работает без ошибок

---

## 🔍 Чек-лист ежедневной проверки

### Обязательно проверять:
- [ ] Сайт доступен и загружается быстро
- [ ] Нет ошибок в консоли браузера
- [ ] Все ссылки работают (особенно на услуги)

### Проверять раз в неделю:
- [ ] Яндекс Вебмастер: количество проиндексированных страниц
- [ ] Google Search Console: Coverage и индексация
- [ ] GitHub Actions: все workflows успешны
- [ ] PageSpeed Insights: скорость загрузки (цель: >90)

### Проверять раз в месяц:
- [ ] Обновить зависимости (npm outdated)
- [ ] Проверить битые ссылки
- [ ] Анализ конкурентов в выдаче
- [ ] Проверка robots.txt и sitemap.xml

---

## 🚨 Частые проблемы и решения

### 404 на страницах
**Причина**: Неправильные роуты или ссылки  
**Решение**: Проверить файлы в `/src/pages/` и роутинг в `App.tsx`

### Docker build падает
**Причина**: Синтаксические ошибки в коде  
**Решение**: Проверить логи в GitHub Actions → Build and Push Docker Image

### Медленная загрузка
**Причина**: Большой размер бандла  
**Решение**: 
- Проверить `vite.config.ts` → build.rollupOptions.output.manualChunks
- Lazy loading компонентов
- Оптимизация изображений

### Не индексируется в поисковиках
**Решение**:
1. Проверить robots.txt
2. Проверить sitemap.xml
3. Отправить sitemap в Яндекс Вебмастер и GSC
4. Проверить наличие мета-тегов (title, description)

---

## 💡 Быстрые команды

### Локальная разработка
```bash
npm install
npm run dev
```

### Деплой на production
```bash
# На сервере
deploy

# Или вручную
docker compose pull
docker compose up -d --force-recreate
```

### Проверка логов
```bash
docker logs goruslugimsk --tail 100 -f
```

---

## 🤖 Работа с AI-ассистентом

### Как начать новую сессию
Когда создаете новый чат в Perplexity, напишите:

```
Контекст: мониторинг сайта goruslugimsk.ru
См. MONITORING.md в репозитории: 
https://github.com/TheGusev/sanit-solutions-spark/blob/main/MONITORING.md

Сегодня нужно: [ваша задача]
```

### Типовые запросы
- "Проверь индексацию сайта в Яндексе и Google"
- "Найди ошибки на сайте goruslugimsk.ru"
- "Оптимизируй производительность сайта"
- "Исправь [описание проблемы] в коде"
- "Создай отчет по SEO за последнюю неделю"

---

## 📌 TODO

### В ближайшее время
- [ ] Настроить автоматические отчеты в Telegram
- [ ] Добавить мониторинг uptime (Uptime Robot или аналог)
- [ ] Настроить Sentry для отслеживания ошибок
- [ ] Оптимизировать изображения (WebP, lazy loading)

### Долгосрочные задачи
- [ ] Добавить блог для SEO
- [ ] Внедрить A/B тестирование
- [ ] Настроить автоматическое тестирование (E2E)
- [ ] Добавить микроразметку Schema.org

---

**Последнее обновление**: 26.01.2026, 21:00 МСК
