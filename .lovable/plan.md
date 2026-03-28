

# Анализ проблем индексации и скрипта IndexNow

## Что показывают скриншоты

### Статистика обхода — 3 категории проблем:

**1. Правильные 301 редиректы (НЕ проблема):**
- `/moscow-oblast/krasnogorsk` → 301 (без слеша → со слешем)
- `/moscow-oblast/domodedovo` → 301
- `/uslugi/dezinsekciya/blohi` → 301 (старый doorway → /rajony/)
- `/uslugi/dezinsekciya/restoranov` → 301
- `/uslugi/deratizaciya/unichtozhenie-krys` → 301
- `/terms`, `/team` без слеша → 301

Это нормально. Яндекс постепенно переобходит и запоминает новые адреса.

**2. Настоящие 404 — старые doorway-пути без редиректов:**
- `/uslugi/dezinsektsiya/` → 404 (11 марта) — Ошибка! Есть в `_redirects` строка 27, НО Яндекс обходил без trailing slash. Нужно добавить вариант без слеша
- `/uslugi/dezinfektsiya/` → 404 (6 марта) — та же проблема
- `/uslugi/dezinsekciya/kvartir/` → 404 (2 марта)
- `/uslugi/deratizaciya/skladov/` → 404 (2 марта) — ранее были 404, теперь должны быть 200 OK (если SSG уже развёрнут)
- `/uslugi/dezinsekciya/cheshuynits/` → 404 — нет в `_redirects`

**3. Массовые 404 на блог-статьях (скрин 4 — февраль):**
- ~20 статей: `postelnye-klopy-polnyj-gajd`, `profilaktika-tarakanov`, `dezinfekciya-ofisa-bez-pomeh` и т.д.
- Все эти слаги ЕСТЬ в SSG/sitemap/data
- **Причина:** эти статьи были добавлены после того, как Яндекс обходил сайт в феврале. На момент обхода HTML-файлов не существовало в deploy. После последнего деплоя они должны отдавать 200 OK

**4. Страницы в поиске с пометкой "Малоценная" (скрин 7):**
- `/blog/borba-s-tarakanami/` — малоценная
- `/uslugi/dezinfekciya/akademichesky/` — малоценная  
- `/uslugi/dezinsekciya/tarakany/lyublino/` — малоценная (doorway)

---

## Про скрипт IndexNow — он БЕЗОПАСЕН

Скрипт парсит **только sitemap-*.xml** из `dist/`. Sitemap генерируется из `vite-plugin-sitemap.ts`, который содержит только реальные URL. Он НЕ отправит:
- 404 страницы (их нет в sitemap)
- Doorway URL (их нет в sitemap)
- Старые WordPress пути (их нет в sitemap)

**Но** есть нюанс: если sitemap содержал фантомные URL (мы убрали `kroty` из tier2 и дубль блога), при следующем деплое они исчезнут.

---

## Почему индексация падает (293 → -9%)

1. **301 редиректы работают правильно** — Яндекс убирает старые doorway URL из индекса и заменяет их на /rajony/. Это НОРМАЛЬНОЕ падение числа, не деградация
2. **Блог-статьи отдавали 404** в феврале потому что были добавлены в код, но ещё не задеплоены с SSG. После деплоя они начнут отдавать 200
3. **Пометка "Малоценная"** — для NCH Tier 3 страниц (pest+geo) это ожидаемо, потому что контент шаблонный

---

## План исправлений (3 файла)

### 1. `public/_redirects` — добавить недостающие 301

Яндекс обходит URL и с trailing slash, и без. Нужно добавить:

```text
# Варианты без trailing slash для typo-редиректов
/uslugi/dezinsektsiya           /uslugi/dezinsekciya/           301
/uslugi/dezinfektsiya           /uslugi/dezinfekciya/           301
/uslugi/deratizatsiya           /uslugi/deratizaciya/           301

# Без trailing slash для moscow-oblast городов
/moscow-oblast/khimki           /moscow-oblast/khimki/          301
/moscow-oblast/domodedovo       /moscow-oblast/domodedovo/      301
/moscow-oblast/krasnogorsk      /moscow-oblast/krasnogorsk/     301
/moscow-oblast/mytishchi        /moscow-oblast/mytishchi/       301
/moscow-oblast/ramenskoe        /moscow-oblast/ramenskoe/       301

# Doorway pest+geo → чистый pest (404 в логе)
/uslugi/dezinsekciya/cheshuynits/   /uslugi/dezinsekciya/cheshuynitsy/  301
/uslugi/dezinsekciya/kvartir/       /uslugi/dezinsekciya/               301
/uslugi/deratizaciya/skladov/       /uslugi/deratizaciya/               301
```

Также добавить wildcard-редирект для pest+geo doorway (где pest-slug + neighborhood slug):
```text
/uslugi/dezinsekciya/tarakany/:slug  /uslugi/dezinsekciya/tarakany/     301
/uslugi/dezinsekciya/klopy/:slug     /uslugi/dezinsekciya/klopy/        301
/uslugi/dezinsekciya/muravyi/:slug   /uslugi/dezinsekciya/muravyi/      301
/uslugi/dezinsekciya/blohi/:slug     /uslugi/dezinsekciya/blohi/        301
/uslugi/dezinsekciya/mol/:slug       /uslugi/dezinsekciya/mol/          301
/uslugi/deratizaciya/krysy/:slug     /uslugi/deratizaciya/krysy/        301
/uslugi/deratizaciya/myshi/:slug     /uslugi/deratizaciya/myshi/        301
```

### 2. `public/_redirects` — обработать `/uslugi/` (403 Forbidden)

Яндекс обходит `/uslugi/` — это корень услуг, для него нет страницы. Нужен 301:
```text
/uslugi/          /                301
/uslugi           /                301
```

### 3. `public/_redirects` — обработать `/sluzhba-dezinsekcii/`

Виден в логе обхода — 200 OK но это SPA fallback (фактически пустая страница). Нужен 301:
```text
/sluzhba-dezinsekcii/    /uslugi/dezinsekciya/    301
```

---

## Итого

| Действие | Файл | Результат |
|----------|------|-----------|
| Добавить ~25 недостающих 301 редиректов | `public/_redirects` | Убирает все 404 из лога Вебмастера |
| Редирект `/uslugi/` → `/` | `public/_redirects` | Убирает 403 Forbidden |
| Wildcard pest+geo → pest | `public/_redirects` | Ловит ВСЕ doorway комбинации, даже те что ещё не обнаружены |

**IndexNow скрипт менять не нужно** — он уже отправляет только валидные URL из sitemap.

**Почему падает индексация — это нормально:** Яндекс убирает из индекса 390 doorway-страниц (получают 301) и заменяет их на 130 хабов /rajony/. Числа стабилизируются через 2-3 недели.

