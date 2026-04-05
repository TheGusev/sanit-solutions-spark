

# Аудит robots.txt и sitemap

## ROBOTS.TXT — Что закрыто

| Bot | Allow | Disallow | Другое |
|-----|-------|----------|--------|
| **Yandex** | `/` | `/admin/`, `/2022/` | Host, Crawl-delay: 1, Clean-param (UTM и т.д.) |
| **Googlebot** | `/` | `/admin/`, `/2022/` | — |
| **Bingbot** | `/` | `/admin/`, `/2022/` | — |
| **Twitterbot, facebookexternalhit, LinkedInBot, TelegramBot** | `/` | — | Полный доступ для шеринга |
| **GPTBot, ChatGPT-User, PerplexityBot, anthropic-ai, ClaudeBot, Google-Extended, YandexBot** | `/` | `/admin/` | LLM-краулеры — полный доступ кроме админки |
| **AhrefsBot** | — | `/` (полный блок) | Crawl-delay: 2 |
| **SemrushBot** | (всё открыто) | — | Crawl-delay: 2 |
| **MJ12bot, DotBot, BLEXBot, DataForSeoBot** | — | `/` (полный блок) | — |
| **\* (все остальные)** | `/` | `/admin/`, `/2022/`, `/wp-admin/`, `/wp-content/`, `/wp-includes/` | — |

**Ссылка на sitemap:** `https://goruslugimsk.ru/sitemap-index.xml`

### Robots.txt — Minor issues

| # | Sev | Проблема |
|---|-----|----------|
| R1 | Low | Комментарий говорит "10 файлов", но генерируется только **9 sitemaps** |
| R2 | Low | **SemrushBot** — не заблокирован (только Crawl-delay: 2), в отличие от AhrefsBot который заблокирован полностью. Semrush будет тратить краулинговый бюджет |
| R3 | Info | Дата `Last updated: 2026-03-22` — устарела, но не критично |

---

## SITEMAP — КРИТИЧЕСКАЯ ПРОБЛЕМА С ДУБЛЯМИ

### Структура sitemap-index.xml (9 файлов)

| Файл | Содержимое | Кол-во URL |
|------|-----------|------------|
| sitemap-main.xml | Главная, контакты, блог, rajony, МО, SES, отзывы, team | 10 |
| sitemap-services.xml | 7 хабов услуг + 16 подстраниц | ~23 |
| sitemap-services-pest.xml | 11 dezinsekciya + 3 deratizaciya пестов | 14 |
| sitemap-services-object.xml | 5 services × objects | ~56 |
| sitemap-moscow.xml | 36 округов + 130 районов | 166 |
| sitemap-moscow-region.xml | 14 городов × (1 + 4 услуги) | 70 |
| sitemap-nch.xml | NCH Tier 1 + **ДУБЛИ + ОШИБКИ** | ~740 (с багами) |
| sitemap-mole.xml | 23 города кротов | 23 |
| sitemap-blog.xml | Все статьи блога | ~207 |

### НАЙДЕННЫЕ ПРОБЛЕМЫ

| # | Sev | Проблема | Детали |
|---|-----|----------|--------|
| **S1** | **CRITICAL** | **60 дублей URL** в sitemap-nch.xml | Block 1 (lines 377-387): Tier 1 pests × ALL 130 neighborhoods = 520 URLs. Block 2-3 (lines 389-411): ALL pests × topNeighborhoods (15). Для Tier 1 пестов (tarakany, klopy, krysy, myshi) × 15 topNeighborhoods = 60 URL уже есть в Block 1, но добавляются повторно |
| **S2** | **CRITICAL** | **15 URL кротов (kroty)** в sitemap, которые **не должны существовать** | Block 3 (line 402): deratizaciyaPestSlugs включает `kroty`. Kroty × topNeighborhoods = 15 URL. Но kroty ИСКЛЮЧЕНЫ из городских районов Москвы по политике проекта! Эти страницы — 404 или doorway |
| **S3** | **HIGH** | **135 noindex URL** Tier 2/3 в sitemap | Block 2 (line 390): `dezinsekciyaPestSlugs` включает ВСЕ 11 пестов, в т.ч. Tier 2 (muravyi, blohi, mol) и Tier 3 (komary, muhi, osy-shershni, cheshuynitsy, kleshchi, mokricy). Эти × 15 topNeighborhoods = 135 noindex URL, которые **не должны быть в sitemap** по политике NCH-тиерирования |

### Итого по sitemap-nch.xml

```text
Block 1:  520 URLs (Tier 1 × all 130 nhoods) — КОРРЕКТНО
Block 2:  165 URLs (all 11 dezinsekciya pests × 15 topNhoods)
          - 30 дублей (tarakany, klopy × 15)
          - 90 noindex Tier 3 URLs
          - 45 noindex Tier 2 URLs (muravyi, blohi, mol × 15)
Block 3:   45 URLs (all 3 deratizaciya pests × 15 topNhoods)
          - 30 дублей (krysy, myshi × 15)
          - 15 kroty URLs (не существующие страницы)

ПРОБЛЕМНЫХ URL: 60 dupes + 135 noindex + 15 kroty = 210
```

---

## ПЛАН ИСПРАВЛЕНИЙ

### S1 + S2 + S3: Удалить Block 2 и Block 3 целиком

Lines 389-411 в `vite-plugin-sitemap.ts` — это **legacy-код**, оставшийся до внедрения тиерированной модели. Block 1 (lines 377-387) уже корректно генерирует все Tier 1 NCH URL. Blocks 2-3 нужно просто удалить.

**После удаления:**
- sitemap-nch.xml будет содержать ровно 520 URL (4 Tier 1 pests × 130 neighborhoods)
- 0 дублей, 0 noindex, 0 kroty

### R1: Исправить комментарий

Строка 96 в robots.txt: `# Главный индекс sitemap (10 файлов)` → `(9 файлов)`

### R2: Заблокировать SemrushBot (опционально)

Добавить `Disallow: /` для SemrushBot, аналогично AhrefsBot. Экономия краулингового бюджета.

---

## ФАЙЛЫ

| Действие | Файл |
|----------|------|
| Изменить | `vite-plugin-sitemap.ts` — удалить lines 389-411 (Block 2 + Block 3) |
| Изменить | `public/robots.txt` — fix комментарий "10 → 9", опционально block SemrushBot |

## Что НЕ меняется
- URL, canonical, nginx, _redirects — без изменений
- Код страниц — без изменений
- Новые страницы не создаются

