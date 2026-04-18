

User wants Batch 3 P2 execution: expand 23 mole pages to 650+ words and decide on Khimki. I need to inspect current state of mole pages and data structure to plan precisely.
<lov-tool-use id="toolu_vrtx_01ULr5bSJ1j4KNdiXXK5DTuH" name="code--view" integration-id="code" data="{\"file_path\": \"src/data/moleCities.ts\", \"lines\": \"1-80\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_018aM97wnD9rjkzTGtbxayoo" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/MoleCityPage.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01RRiYtfZhFNYPWLL9iDfAAh" name="code--view" integration-id="code" data="{\"file_path\": \"src/data/moleCities.ts\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_011J6uBFLcmBBWMoq8WzuYQ7" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/MoleCityPage.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_013y2fZ32RR4FfxoARhHNDGS" name="code--view" integration-id="code" data="{\"file_path\": \"src/data/moleCities.ts\", \"lines\": \"227-490\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_018f2sp45f7tHksHDbWzeZSQ" name="code--view" integration-id="code" data="{\"file_path\": \"src/data/moleCities.ts\", \"lines\": \"460-490\"}">
</lov-tool-use>
I have enough context. Now let me check `mem://seo/mole-landing-quality-standard` and confirm the count of cities.
<lov-tool-use id="toolu_vrtx_01PHqaPbYSMDh2jiWXGkhQZN" name="code--exec" integration-id="code" data="{\"command\": \"grep -c \\\"^  {\\\" src/data/moleCities.ts && grep -c \\\"slug:\\\" src/data/moleCities.ts\", \"user_facing_description\": \"Counting mole cities\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01W6cVfPUED56yiuq9diief6" name="code--view" integration-id="code" data="{\"file_path\": \"mem://seo/mole-landing-quality-standard\"}">
</lov-tool-use>
Now I have full context. Let me present a clean, focused plan.

<lov-plan>

# Batch 3 P2 — Mole Cluster Quality Hardening

## Что делаю

Расширяю **23 mole-страницы** до 650+ слов через дополнительные city-specific блоки в данных + рендеринг в `MoleCityPage.tsx`. Без новых URL, без изменения роутинга/canonical/sitemap.

## Решение по Химкам

**Добавляю Khimki как 24-ю полноценную mole city page.** Обоснование:
- Химки — крупнейший пропущенный город МО (Ленинградское шоссе, 9 км от МКАД, население 260k+)
- Архитектурно идентично существующей модели (Долгопрудный, Лобня уже есть — рядом)
- Не создаёт подкластеров, не меняет шаблон, использует те же роуты `/uslugi/borba-s-krotami/khimki/`
- SSG автоматически подхватит через `moleCitySlugs`

## Изменения в данных (`src/data/moleCities.ts`)

Расширяю интерфейс `MoleCity` тремя новыми опциональными полями:

```ts
seasonalNote?: string;       // 2-3 предложения о сезонной специфике
sntContext?: string;         // 2-3 предложения про СНТ/КП/ДНП конкретного города
geologyDetails?: string;     // 2-3 предложения о геологии/гидрологии
extraFaq?: Array<{question, answer}>; // 2-3 дополнительных FAQ
```

Заполняю **все 23 + Khimki** уникальным текстом на основе:
- highway / soilType / landmarks (уже есть)
- distanceFromMkad (уже есть)
- cityTier (premium → ландшафт/газоны; strong → СНТ+коттеджи; mid/thin → дачи+огороды)

Каждый город получает **уникальный** контент — без копипаста, с региональными маркерами (топонимы, шоссе, почвы, водоёмы, СНТ/КП по названию района).

## Изменения в шаблоне (`src/pages/MoleCityPage.tsx`)

Добавляю 3 новых рендер-блока **между существующими секциями** (без перестройки структуры):

1. **«Геология и гидрология участков»** — после секции "Почему кроты выбирают" (рендерит `geologyDetails`)
2. **«Сезонная специфика обработки»** — после секции "Методы" (рендерит `seasonalNote`)
3. **«СНТ, КП и дачные посёлки»** — перед FAQ (рендерит `sntContext`)
4. **`extraFaq`** — мерджится в существующий FAQ-аккордеон (без отдельной секции, без дубля FAQPage schema)

Все блоки conditional (`{city.field && (...)}`) — если поле пустое, секция не рендерится. Полная обратная совместимость.

## Целевой объём

- Текущий средний: ~500 слов
- Целевой: **750-900 слов** на каждую страницу
- Прирост: ~250-400 слов через 3 новых блока + extraFaq

## Стоп-условия (соблюдаю)

- ✅ Никаких новых URL (Khimki использует существующий шаблон роута `/uslugi/borba-s-krotami/:citySlug/`)
- ✅ Slug `khimki` — стандартная транслитерация
- ✅ Canonical/sitemap auto-sync через существующий `moleCitySlugs`
- ✅ Никаких новых schema entities (используется текущий Service + FAQPage)
- ✅ Никаких изменений в `seoRoutes.ts`, `vite-plugin-sitemap.ts`, `internalLinking.ts`
- ✅ FAQ schema обновляется автоматически (extraFaq мерджится в `city.faq`)

## Verification после работ

1. `npm run build` clean (24 mole pages вместо 23)
2. Word count для 5 representative pages: `wc -w dist/uslugi/borba-s-krotami/{istra,khimki,barvikha,dmitrov-mo,dubna-mo}/index.html` — все ≥650
3. Sitemap auto-sync: `khimki` появился в `dist/sitemap-moscow-region.xml`
4. Spot-check Khimki: title/canonical/H1/breadcrumbs корректны
5. Schema integrity: 1 BreadcrumbList + 1 Service + 1 FAQPage на страницу
6. Уникальность: `geologyDetails` и `sntContext` различаются между городами (не копипаст)

## Файлы

- `src/data/moleCities.ts` — расширение интерфейса + контент для 24 городов
- `src/pages/MoleCityPage.tsx` — 3 новых conditional render-блока

## Что НЕ трогаю

- `seoRoutes.ts`, `vite-plugin-sitemap.ts`, `internalLinking.ts` (core lockdown)
- Hero, Tariffs, Quiz секции
- Существующие FAQ entries (только мерджатся с extraFaq)
- Schema generators

