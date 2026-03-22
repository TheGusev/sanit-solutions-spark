

# Исправление ошибок индексации Яндекса + подготовка к переобходу

## Анализ скриншотов

### Что происходит

1. **`/uslugi/dezinsektsiya/` → 404** — Яндекс обходит URL с опечаткой (dezinsek**TS**iya вместо dezinsek**C**iya). У нас нет редиректа — Яндекс получает 404. Надо добавить 301.

2. **`/uslugi/dezinsekciya/blohi` → 301** и **`/uslugi/dezinsekciya/restoranov` → 301** — это URL без trailing slash. SPA fallback отдаёт `index.html`, роутер рендерит страницу, но Яндексу видит 301 (добавление `/`). Это нормальное поведение, не ошибка.

3. **«Маловостребованная страница»** — это стандартная метка Яндекса для новых НЧ-страниц. Они в индексе, просто помечены как low-demand. По мере роста ссылочной массы и трафика метка уйдёт.

4. **Google: 328 из 446** — нормальный рост, 118 excluded — типично для нового контента.

**Вывод: страницы НЕ выкидываются из поиска.** Единственная реальная проблема — 404 на опечатке `/dezinsektsiya/`.

## Что сделаем

### 1. Добавить 301-редиректы на частые опечатки в `public/_redirects`

```
/uslugi/dezinsektsiya/           /uslugi/dezinsekciya/           301
/uslugi/dezinsektsiya/*          /uslugi/dezinsekciya/:splat     301
/uslugi/dezinfektsiya/           /uslugi/dezinfekciya/           301
/uslugi/dezinfektsiya/*          /uslugi/dezinfekciya/:splat     301
/uslugi/deratizatsiya/           /uslugi/deratizaciya/           301
/uslugi/deratizatsiya/*          /uslugi/deratizaciya/:splat     301
```

### 2. Обновить `robots.txt` — актуализировать дату

### 3. Подготовить список URL для ручной отправки на переобход

Вывести пользователю инструкцию: какие URL отправить на переобход в Яндекс.Вебмастер и Google Search Console (sitemap-index.xml + ключевые страницы).

### Файлы

| Файл | Действие |
|------|----------|
| `public/_redirects` | +6 строк 301-редиректов для опечаток |
| `public/robots.txt` | Обновить дату |

Минимальные правки — 2 файла, ~10 строк.

