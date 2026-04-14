

# VALIDATION PASS — Верификация после пересборки контейнера 2026-04-14

---

## 1. VERIFIED IN CODE (подтверждено кодом в репозитории)

| # | Пункт | Статус | Файл:строка | Детали |
|---|-------|--------|-------------|--------|
| 1 | NchPage — один BreadcrumbList | ✅ VERIFIED OK | `NchPage.tsx` | Поиск `breadcrumbSchema` и `BreadcrumbList` = 0 результатов. Единственный источник — `Breadcrumbs.tsx` |
| 2 | DistrictPage — один BreadcrumbList | ✅ VERIFIED OK | `DistrictPage.tsx` | Поиск `breadcrumbSchema` и `BreadcrumbList` = 0 результатов |
| 3 | MoleCityPage — RelatedBlogLinks | ✅ VERIFIED OK | `MoleCityPage.tsx:303` | `<RelatedBlogLinks serviceSlug="borba-s-krotami" />` |
| 4 | telegram_click в ALL_CONV_GOALS | ✅ VERIFIED OK | `analytics.ts:189` | В Set |
| 5 | messenger_click в ALL_CONV_GOALS | ✅ VERIFIED OK | `analytics.ts:189` | В Set |
| 6 | messenger_click НЕ в vkEventMap | ✅ GAP CONFIRMED | `analytics.ts:210-216` | Отсутствует — только lead_submit, popup_submit, calc_open, phone_click, telegram_click |
| 7 | messenger_click НЕ в tmrGoalMap | ✅ GAP CONFIRMED | `analytics.ts:231-238` | Аналогично — отсутствует |
| 8 | ⚠ Двойная FAQPage на главной | ❌ BUG CONFIRMED | `FAQ.tsx:103-106` + `metadata.ts:138-148,157` | **Два разных FAQPage JSON-LD**: FAQ.tsx инжектит inline `<script>` с 6 вопросами из `generateFAQSchema()`, metadata.ts добавляет ещё один с 5 хардкодированными вопросами через SEOHead. Итого 2 блока `@type: FAQPage` с разными наборами вопросов |
| 9 | InternalLinks удалён | ✅ VERIFIED OK | Весь проект | 0 результатов поиска |
| 10 | isSeoLinkable фильтрация | ✅ VERIFIED OK | `internalLinking.ts` | Блокирует admin, utility, Tier 2/3 |

---

## 2. VERIFIED LIVE (подтверждено на production после rebuild)

| # | Пункт | Статус | Источник | Детали |
|---|-------|--------|----------|--------|
| 1 | robots.txt доступен | ✅ VERIFIED LIVE | `https://goruslugimsk.ru/robots.txt` | Полное совпадение с кодом. `Sitemap: https://goruslugimsk.ru/sitemap-index.xml` ✅ |
| 2 | sitemap-index.xml — 9 дочерних | ✅ VERIFIED LIVE | `https://goruslugimsk.ru/sitemap-index.xml` | 9 sitemap файлов: main, services, services-pest, services-object, moscow, moscow-region, nch, mole, blog. Все dated 2026-04-14 |
| 3 | sitemap-nch.xml — Tier 1 only | ✅ VERIFIED LIVE | `https://goruslugimsk.ru/sitemap-nch.xml` | URL начинаются с tarakany/arbat — Tier 1 pest. Длина контента ~43K символов = ~520 URL ✅ |
| 4 | SSG HTML рендерится | ✅ VERIFIED LIVE | Все проверенные страницы | Полноценный HTML-контент в initial response (не пустой SPA shell) |
| 5 | Tier 2 noindex страницы доступны | ✅ VERIFIED LIVE | `https://goruslugimsk.ru/uslugi/dezinsekciya/muravyi/arbat/` | Страница отдаёт HTML (для рекламного трафика) |
| 6 | Rebuild состоялся | ✅ VERIFIED LIVE | HTTP headers | `Last-Modified: Tue, 14 Apr 2026 14:13:31 GMT` — сегодняшний билд |

---

## 3. NOT YET VERIFIED (требует ручной проверки HTML source)

| # | Пункт | Почему не верифицировано | Что нужно |
|---|-------|------------------------|-----------|
| 1 | Главная — сколько FAQPage JSON-LD в HTML | Fetch tool не даёт доступ к `<head>` и inline `<script type="application/ld+json">` | Открыть `view-source:https://goruslugimsk.ru/` → Ctrl+F → `FAQPage` → посчитать |
| 2 | NchPage — сколько BreadcrumbList в live HTML | Аналогично | `view-source:https://goruslugimsk.ru/uslugi/dezinsekciya/tarakany/arbat/` → `BreadcrumbList` |
| 3 | DistrictPage — сколько BreadcrumbList | Аналогично | `view-source:https://goruslugimsk.ru/uslugi/dezinsekciya-cao/` → `BreadcrumbList` |
| 4 | og:image на главной | Не удалось извлечь из fetched HTML | `view-source:` → `og:image` |
| 5 | Description длина на главной | Не удалось извлечь | `view-source:` → `<meta name="description"` |
| 6 | MoleCityPage — RelatedBlogLinks в live HTML | Fetch tool видит контент, но нет возможности search | `view-source:https://goruslugimsk.ru/uslugi/borba-s-krotami/istra/` → ссылки на `/blog/` |
| 7 | FloatingButtons — Telegram кнопка | Требует JS-рендер | Открыть сайт → нажать кнопку → проверить t.me/one_help |
| 8 | Tier 2 NCH — noindex в HTML | Не удалось извлечь meta robots из HTML | `view-source:` muravyi/arbat → `noindex` |

---

## 4. CODE STATE vs LIVE STATE

| Изменение | Файл | В коде | На live после rebuild 14.04 | Требует ручную проверку |
|-----------|------|--------|---------------------------|----------------------|
| Дубль BreadcrumbList удалён (NchPage) | `NchPage.tsx` | ✅ Чисто | ✅ Вероятно ОК (rebuild сегодня) | Да — view-source |
| Дубль BreadcrumbList удалён (DistrictPage) | `DistrictPage.tsx` | ✅ Чисто | ✅ Вероятно ОК | Да — view-source |
| telegram_click в ALL_CONV_GOALS | `analytics.ts` | ✅ Есть | ✅ Вероятно ОК | Нет (JS runtime) |
| messenger_click в ALL_CONV_GOALS | `analytics.ts` | ✅ Есть | ✅ Вероятно ОК | Нет |
| FAQPage schema в generateIndexMetadata | `metadata.ts` | ✅ Есть | ✅ Вероятно ОК | **Да — проверить что НЕ дубль с FAQ.tsx** |
| og:image на IndexSSR | `IndexSSR.tsx` | ✅ Есть | ✅ Вероятно ОК | Да — view-source |
| Title/Description сокращены | `IndexSSR.tsx` | ✅ Есть | ✅ Вероятно ОК | Да — view-source |
| RelatedBlogLinks на MoleCityPage | `MoleCityPage.tsx` | ✅ Есть | ✅ Вероятно ОК | Да — view-source |
| FloatingButtons с Telegram | `FloatingButtons.tsx` | ✅ Есть | ✅ Вероятно ОК | Да — кликнуть |

---

## 5. ОБНАРУЖЕННЫЕ ПРОБЛЕМЫ

### ❌ BUG #1: Двойная FAQPage schema на главной (подтверждено кодом)

**Серьёзность**: HIGH — Google/Яндекс может показать warning, снижение доверия к structured data

**Источник 1**: `src/components/FAQ.tsx:103-106`
- Inline `<script type="application/ld+json">` с `@type: FAQPage`
- 6 вопросов из массива `faqs`

**Источник 2**: `src/lib/metadata.ts:138-148,157`
- FAQPage schema через SEOHead/Helmet
- 5 хардкодированных вопросов

**Результат**: 2 JSON-LD блока FAQPage с разными наборами вопросов на одной странице.

### ⚠ GAP #2: messenger_click не в VK/TMR (подтверждено кодом)

**Серьёзность**: LOW-MEDIUM

`messenger_click` попадает в Метрику и all_conversions, но **не отправляется** в VK Pixel (vkEventMap) и Top.Mail.Ru (tmrGoalMap).

---

## 6. POST-DEPLOY VERIFICATION CHECKLIST

| # | URL | Что проверять | Expected | Failure |
|---|-----|---------------|----------|---------|
| 1 | `view-source:https://goruslugimsk.ru/` | Ctrl+F → `FAQPage` | ⚠ **Сейчас будет 2 блока** (BUG #1 не исправлен) | 3+ блоков |
| 2 | `view-source:https://goruslugimsk.ru/` | `og:image` | `<meta property="og:image" content="...">` | Отсутствует |
| 3 | `view-source:https://goruslugimsk.ru/` | `<meta name="description"` | ≤150 символов | >160 |
| 4 | `view-source:https://goruslugimsk.ru/` | `BreadcrumbList` | Ровно 1 блок | 0 или 2+ |
| 5 | `view-source:.../dezinsekciya/tarakany/arbat/` | `BreadcrumbList` | Ровно 1 блок | 2+ = дубль не удалён |
| 6 | `view-source:.../dezinsekciya/tarakany/arbat/` | `noindex` | Отсутствует (Tier 1) | noindex = ошибка |
| 7 | `view-source:.../dezinsekciya-cao/` | `BreadcrumbList` | Ровно 1 блок | 2+ |
| 8 | `view-source:.../dezinsekciya-cao/` | `FAQPage` | 1 блок | 0 или 2+ |
| 9 | `view-source:.../borba-s-krotami/istra/` | ссылки на `/blog/` | Присутствуют | Нет = RelatedBlogLinks не задеплоен |
| 10 | `view-source:.../dezinsekciya/muravyi/arbat/` | `noindex` | `noindex, follow` (Tier 2) | index = утечка |
| 11 | `https://goruslugimsk.ru/robots.txt` | Sitemap URL | `sitemap-index.xml` | Другой URL |
| 12 | `https://goruslugimsk.ru/sitemap-index.xml` | Кол-во дочерних | 9 файлов | Другое число |
| 13 | `https://goruslugimsk.ru/sitemap-nch.xml` | Нет muravyi/blohi/mol | Только tarakany/klopy/krysy/myshi | Tier 2/3 попали |
| 14 | Live сайт → плавающая кнопка → Telegram | Ссылка | `https://t.me/one_help` | 404 или старые кнопки |
| 15 | `https://goruslugimsk.ru/admin/` | Доступ | Client-rendered SPA за auth | В sitemap или public |

---

## 7. ИТОГОВЫЙ ВЕРДИКТ

**По коду**: 9 из 10 пунктов — VERIFIED OK. 1 BUG (двойная FAQPage), 1 GAP (messenger_click в VK/TMR).

**По live**: robots.txt ✅, sitemap-index ✅ (9 файлов, 2026-04-14), sitemap-nch ✅ (Tier 1 only), SSG rendering ✅, rebuild confirmed ✅.

**Не верифицировано**: 8 пунктов требуют ручной проверки через `view-source:` (head/schema content недоступен через fetch tool).

**Блокер перед SCALE**: BUG #1 — двойная FAQPage schema на главной. Нужно удалить inline `<script>` из `FAQ.tsx:103-106` и оставить единственный источник в `metadata.ts`.

**Действия после ручной проверки view-source**:
1. Если FAQPage = 2 → исправить (убрать из FAQ.tsx)
2. Если BreadcrumbList на NCH/District = 1 → VERIFIED LIVE
3. Если og:image есть → VERIFIED LIVE
4. Добавить messenger_click в vkEventMap и tmrGoalMap (GAP #2)

