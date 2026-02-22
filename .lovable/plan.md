
# Полный аудит сайта goruslugimsk.ru — Санитарные Решения

## 1. Что было и что стало: от 4300+ до ~550 страниц

### Было (до оптимизации)
- **4300+ страниц**, из которых ~3600 были doorway-страницы (услуга x район x объект)
- Массовая каннибализация: десятки страниц конкурировали за одни и те же запросы
- Тонкий контент: сотни страниц с почти одинаковым текстом
- Риск фильтра Яндекса/Google за doorway

### Стало (текущее состояние)
Подсчёт по seoRoutes.ts и sitemap-plugin:

| Категория | Количество | Примеры URL |
|---|---|---|
| Статические | 4 | `/`, `/contacts`, `/blog`, `/privacy` |
| Обзорные | 3 | `/rajony/`, `/moscow-oblast/`, `/uslugi/po-okrugam-moskvy/` |
| Услуги | 7 | `/uslugi/dezinsekciya/`, `/uslugi/borba-s-krotami/` |
| Подстраницы услуг | 6 | `/uslugi/dezinfekciya/kvartir/` |
| Услуга+Вредитель | 8 | `/uslugi/dezinsekciya/tarakany/` |
| Услуга+Объект | 30 | `/uslugi/demerkurizaciya/kvartir/` (5 услуг x 6 объектов) |
| НЧ (услуга+вредитель+район) | 120 | `/uslugi/dezinsekciya/tarakany/arbat/` (8 вредителей x 15 районов) |
| Округа | 12 | `/uslugi/dezinfekciya-cao/` |
| Районы Москвы | 130 | `/rajony/arbat/` |
| Города МО | 10 | `/moscow-oblast/khimki/` |
| Услуги в городах МО | 40 | `/moscow-oblast/khimki/dezinsekciya/` |
| Блог | 181 | `/blog/borba-s-tarakanami/` |
| **ИТОГО** | **~551** | |

Сокращение в **8 раз** (4300 -> 551). Все doorway-страницы удалены.

---

## 2. Семантическое ядро

Файл `semanticCore.ts` содержит записи по кластерам:

| Кластер | Записей | Пример запроса |
|---|---|---|
| service | 8 | "дезинфекция москва" |
| pest | 14 | "уничтожение тараканов москва" |
| object | 30 | "дезинсекция квартиры" |
| district | 12 | "дезинфекция цао" |
| nch | 120 | "уничтожение тараканов арбат" |
| blog | 20 + 18 | "как избавиться от тараканов навсегда" |
| moscow-region | 40 | "дезинсекция химки" |
| **ИТОГО** | **~262** | |

### Приоритеты
- **Приоритет 1** (6 запросов): "дезинфекция москва", "дезинсекция москва", "дератизация москва", "уничтожение тараканов москва", "уничтожение клопов москва", "уничтожение крыс москва", + 2 информационных "как избавиться от..."
- **Приоритет 2** (~30 запросов): остальные услуги, ключевые вредители, округа ЦАО/САО/ВАО/ЮАО
- **Приоритет 3-5** (~220 запросов): НЧ-кластеры, блог, МО

### Оценка: каннибализация устранена
Функция `validateNoDuplicates()` проверяет, что один запрос не назначен двум страницам. Конфликтов нет.

---

## 3. Роутинг — найденные проблемы и статус

### Исправлено
- `ServiceObjectPage.tsx` — добавлена `demerkurizaciya` в `validServices`. 6 страниц демеркуризации объектов теперь работают.

### Текущее состояние роутинга (App.tsx)
Все маршруты корректно разрешаются:
- `/uslugi/:slug` -> `ServicePage` (7 услуг + 12 округов через `dezinfekciya-{id}`)
- `/uslugi/:parentSlug/:subSlug` -> `ServiceRouteResolver` (подстраницы, вредители, объекты, районы)
- `/uslugi/:service/:segment2/:segment3` -> `ThreeSegmentRouteResolver` (НЧ-страницы)
- `/rajony/:slug` -> `NeighborhoodPage`
- `/moscow-oblast/:citySlug` -> `MoscowRegionCityPage`
- `/moscow-oblast/:citySlug/:serviceSlug` -> `MoscowRegionServicePage`

### ServiceRouteResolver приоритеты разрешения (корректно):
1. Подстраница из serviceSubpages.ts
2. Вредитель (getPestBySlug)
3. Объект (getObjectBySlug)
4. Район (neighborhoods)

Потенциальный конфликт: slug `kvartir` есть и в serviceSubpages (dezinfekciya/kvartir), и в objects. Но приоритет 1 (serviceSubpages) корректно обрабатывает этот случай для dezinfekciya, а для других услуг подстраницы нет — используется ServiceObjectPage.

---

## 4. КРИТИЧЕСКИЕ ПРОБЛЕМЫ nginx.conf

### Проблема 1: Отсутствуют location-правила для /rajony/ и /moscow-oblast/
В `nginx.conf` нет правил для:
```
/rajony/arbat/
/moscow-oblast/khimki/
/moscow-oblast/khimki/dezinsekciya/
```

Текущий fallback `location /` использует `try_files $uri $uri/ $uri/index.html =404`. Если SSG сгенерировал `dist/rajony/arbat/index.html`, nginx найдёт его через `$uri/index.html`. **Но** если URL приходит без trailing slash (`/rajony/arbat`), nginx может не найти файл.

**Статус: Потенциальная проблема.** Работает только если SSG корректно генерирует все файлы. Рекомендуется добавить explicit location-правила для надёжности.

### Проблема 2: 3-сегментные URL услуг
Правило `location ~ ^/uslugi/[^/]+/[^/]+/$` покрывает двухсегментные URL (`/uslugi/dezinsekciya/tarakany/`), но нет правила для трёхсегментных (`/uslugi/dezinsekciya/tarakany/arbat/`).

**Статус: Критическая проблема.** 120 НЧ-страниц могут не работать на production. Нужно добавить:
```nginx
location ~ ^/uslugi/[^/]+/[^/]+/[^/]+/$ {
    try_files $uri $uri/index.html =404;
    add_header Cache-Control "public, max-age=3600, stale-while-revalidate=86400";
}
```

### Проблема 3: Редирект без trailing slash
Нет автоматического редиректа `/uslugi/dezinsekciya` -> `/uslugi/dezinsekciya/`. Это может создавать дубли в индексе. Canonical в HTML есть, но 301 надёжнее.

---

## 5. SEO — что работает хорошо

| Элемент | Статус | Детали |
|---|---|---|
| Title, H1, Description | OK | Уникальные для каждой страницы, генерируются из данных |
| Canonical URL | OK | `generateSEOMeta()` добавляет trailing slash |
| hreflang | OK | ru + x-default |
| Schema.org (Service) | OK | На всех страницах услуг |
| Schema.org (FAQ) | OK | На услугах, районах, НЧ |
| Schema.org (BreadcrumbList) | OK | На услугах |
| Schema.org (LocalBusiness) | OK | На НЧ-страницах |
| Open Graph | OK | title, description, image, type |
| robots meta | OK | index,follow + max-snippet:-1 |
| robots.txt | OK | Закрыт /admin/, WordPress-пути |
| Sitemap Index | OK | 8 sub-sitemaps, ~551 URL |
| 404 pages | OK | Кастомный 404.html |
| 410 Gone | OK | Старые WordPress URL |

---

## 6. Перелинковка (InternalLinks.tsx)

Компонент генерирует 8-12 ссылок по правилам:
1. Другие вредители той же услуги (3-4 ссылки)
2. Соседние районы по геокоординатам (3-4 ссылки) — приоритет из topNeighborhoods
3. Главные страницы услуг (2 ссылки)
4. Города МО (1-2 ссылки)

**Оценка: Хорошая** — перелинковка контекстная, не хаотичная. Географическая сортировка — сильное решение.

**Замечание:** Перелинковка на страницах объектов (`ServiceObjectPage`) передаёт только `currentService`, без `currentPest` и `currentNeighborhood`. Это означает, что ссылки генерируются менее таргетировано. Можно улучшить.

---

## 7. Гео-покрытие

### Москва
- 12 округов (ЦАО-ЗелАО) — по 1 странице на округ
- 130 районов — по 1 странице на район
- 15 топ-районов для НЧ-комбинаций (8 вредителей x 15 = 120 страниц)

### Московская область
- 10 городов (Химки, Мытищи, Балашиха, Красногорск, Подольск, Королёв, Люберцы, Одинцово, Долгопрудный, Щёлково)
- 4 услуги в каждом городе = 40 страниц
- 18 гео-статей блога по кротам (Новорижское/Рублёвское/Дмитровское шоссе)

**Оценка: Достаточное покрытие.** Для топ-100 запросов по Москве хватает. МО покрывает крупнейшие города.

---

## 8. Контент и A/B тестирование

### MVT-система
- Thompson Sampling с альфа/бета параметрами
- SEO-безопасная: тестирует только UX-элементы (подзаголовки, CTA, порядок блоков)
- H1, Title, Description, Canonical не меняются (правило из memory)
- Варианты C и D отключены, трафик на A, B, E, F

### Контент-генерация
- `contentGenerator.ts` — генерирует уникальные тексты для НЧ-страниц (650-800 слов)
- `blogContentGenerator.ts` — шаблоны для 163 статей блога
- `neighborhoodContentGenerator.ts` — для районов

### Отзывы
- Таблица `reviews` с RLS — только одобренные видны публично
- View `public_reviews` для отображения

---

## 9. Backend и база данных

| Таблица | Назначение | RLS |
|---|---|---|
| leads | Заявки с калькулятора | INSERT с валидацией, SELECT только admin |
| reviews | Отзывы | INSERT с валидацией, SELECT approved OR admin |
| traffic_events | Аналитика | INSERT с валидацией, SELECT admin |
| mvt_arm_params | MVT параметры | ALL только admin |
| mvt_impressions | MVT показы | INSERT с валидацией, SELECT admin |
| ab_test_stats | A/B статистика | INSERT/SELECT/UPDATE admin |
| user_roles | Роли | ALL admin, SELECT own |

**Оценка: Безопасность хорошая.** Все таблицы с RLS, валидация на уровне БД.

---

## 10. Технический стек

- React 19 + Vite + TypeScript + Tailwind CSS
- Supabase (Lovable Cloud) — БД, Edge Functions, Auth
- Docker + Nginx — production deployment
- SSG (vite-plugin-ssg.ts) — пререндеринг всех страниц
- Sitemap Index с 8 sub-sitemaps
- GitHub Actions CI/CD -> Docker Hub
- Dokploy для автодеплоя

---

## 11. Сводка проблем

### Критические (нужно исправить)
1. **nginx.conf**: Отсутствует location для 3-сегментных URL `/uslugi/*/*/*/` — 120 НЧ-страниц могут отдавать 404 на production
2. **nginx.conf**: Отсутствуют location для `/rajony/` и `/moscow-oblast/` — 180 страниц зависят от generic fallback
3. **CI/CD разрыв**: Последние изменения не попадают на production (обсуждалось ранее)

### Средние (рекомендуется исправить)
4. **Trailing slash redirect**: Нет 301 редиректа с `/uslugi/dezinsekciya` на `/uslugi/dezinsekciya/` на уровне nginx
5. **Комментарий в semanticCore**: Переменная `services4` названа "4 услуги", но содержит 5 (включая demerkurizaciya) — мелочь, но путает
6. **ServiceObjectPage breadcrumb**: Всегда ссылается на `/uslugi/dezinsekciya` как "Услуги", даже если текущая услуга — демеркуризация

### Незначительные
7. **Blog canonical mismatch**: Некоторые записи в semanticCore ссылаются на slug, которых нет в blogArticleSlugs (например `kak-izbavitsya-ot-tarakanov` vs `kak-izbavitsya-ot-tarakany`)
8. **Перелинковка ServiceObjectPage**: Не передаёт объект/район — ссылки менее таргетированы

---

## 12. Заключение

### Что сделано хорошо
- Архитектурно грамотное сокращение с 4300 до 551 страниц
- Устранены doorway-страницы и каннибализация
- Семантическое ядро из 262 записей покрывает коммерческие и информационные запросы
- Уникальный контент на каждой странице
- Schema.org разметка (Service, FAQ, LocalBusiness, BreadcrumbList)
- A/B тестирование безопасно для SEO
- Перелинковка по геокоординатам — умное решение
- RLS-политики на всех таблицах

### Что нужно для топ-100 / первого места
Семантическое ядро покрывает основные коммерческие запросы. Для первого места по "дезинфекция москва", "уничтожение тараканов москва" и т.д. нужно:
1. Исправить nginx (120+ страниц могут быть недоступны на production)
2. Наладить CI/CD (изменения не попадают на production)
3. Дождаться переиндексации Яндексом/Google после удаления 3700+ страниц
4. Наращивать внешние ссылки и поведенческие факторы

### Итоговая оценка: 8/10
Сайт технически сильный, семантически продуманный, но есть критическая проблема с nginx, блокирующая ~300 страниц на production.
