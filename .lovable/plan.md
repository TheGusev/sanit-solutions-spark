

User wants two things:
1. Extend `monitor.py` with sample-50 sitemap sync check (HTTP 200 + canonical match)
2. Fix 6 critical issues from latest monitoring run

Let me inspect each issue first before planning.
<lov-tool-use id="toolu_vrtx_01FPYT7Ac5QeHx8ERih3mBwh" name="code--view" integration-id="code" data="{\"file_path\": \"MONITORING.md\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01UwqCZBM6UJwQdW8B32vraR" name="code--view" integration-id="code" data="{\"file_path\": \"scripts/monitor.py\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01PHweSptRyr5GUskrap9uTN" name="code--view" integration-id="code" data="{\"file_path\": \"MONITORING.md\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_013sSMRkz2MeGbCYeR6JGtJv" name="code--view" integration-id="code" data="{\"file_path\": \"scripts/monitor.py\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_015RSDXQmyKETHwU1qhenVpm" name="code--view" integration-id="code" data="{\"file_path\": \"scripts/monitor.py\", \"lines\": \"417-873\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_0116DG12VSwGBKwKTNhEkZt5" name="code--search_files" integration-id="code" data="{\"query\": \"noindex\", \"include_patterns\": \"src/pages/ServiceSESPage.tsx,src/pages/ServicePage.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01LLt4E8iEv6SruJrjHndp1f" name="code--search_files" integration-id="code" data="{\"query\": \"sertifikaciya\", \"include_patterns\": \"src/**/*.ts,src/**/*.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_016yz8rdr1EZseQCbtLgb13V" name="code--search_files" integration-id="code" data="{\"query\": \"/admin\", \"include_patterns\": \"src/components/Footer.tsx,src/components/Header.tsx,src/App.tsx\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_012YxtSXn4FxS7AMvnencbhZ" name="code--search_files" integration-id="code" data="{\"query\": \"sertifikaciya\", \"include_patterns\": \"src/**/*,public/**/*,vite-plugin-sitemap.ts\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01AYSM5JvLAEvPkUEgykzsSi" name="code--search_files" integration-id="code" data="{\"query\": \"cao|kvartira|khimki\", \"include_patterns\": \"src/lib/seoRoutes.ts\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_013CT5n7jKkJr8Z9pyDur3bt" name="code--view" integration-id="code" data="{\"file_path\": \"src/components/SEOHead.tsx\"}">
</lov-tool-use>
Now I need to check: blog post duplicate BreadcrumbList, /rajony/cao/ canonical drift, kvartira/khimki 404s, and footer admin link rendering. The `sertifikaciya` static HTML already has noindex, but monitor said it was missing — maybe SPA fallback overrides static. Let me check.
<lov-tool-use id="toolu_vrtx_017ZdtkjZkKr2Bkb6jpraQJ5" name="code--view" integration-id="code" data="{\"file_path\": \"src/pages/BlogPost.tsx\", \"lines\": \"1-100\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01VnvpbQXujoZgWZS6mJBCjs" name="code--view" integration-id="code" data="{\"file_path\": \"src/lib/seoRoutes.ts\", \"lines\": \"100-200\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_011bmzmSTxeqiZ33KL8rb3en" name="code--search_files" integration-id="code" data="{\"include_patterns\": \"src/**/*.tsx,src/**/*.ts\", \"query\": \"BreadcrumbList\"}">
</lov-tool-use>

<lov-tool-use id="toolu_vrtx_01VXRH4VrvNvR7vmoPQgDj9E" name="code--view" integration-id="code" data="{\"file_path\": \"nginx.conf\"}">
</lov-tool-use>
Now I have full context. Let me analyze the 6 critical issues to determine which are real bugs vs monitor false-positives:

1. **`/uslugi/dezinsekciya/kvartira/` 404** — `objectSlugs` uses `kvartir` (genitive plural), not `kvartira`. Monitor uses wrong slug → **false positive in monitor**.
2. **`/uslugi/borba-s-krotami/khimki/` 404** — Khimki added but live site not yet rebuilt/redeployed → **deploy delay, real issue if persists; verify in build**.
3. **`/rajony/cao/` canonical drift** — page returns `canonical = https://goruslugimsk.ru/` (homepage). This is a real bug — DistrictPage probably not getting canonical set properly OR nginx returns SPA fallback (`/index.html`) → real bug to investigate.
4. **`/blog/klopy-v-kvartire/` 2× BreadcrumbList** — BlogPost.tsx renders one via `<StructuredData type="BreadcrumbList">` AND another in metadata schema. Real bug.
5. **`/uslugi/sertifikaciya/` indexable** — static file already has `noindex, follow`. But monitor says it's indexable. Means SPA fallback overrides static, OR robots header missing. Need to check why nginx serves SPA instead of static. Look at nginx — `location ~ ^/uslugi/[^/]+/$` requires file → `=404`. The static `/uslugi/sertifikaciya/index.html` exists, so should return 200 with noindex. Monitor may be misreading? Need to verify in plan.
6. **/admin/ leak** — Footer.tsx HAS `rel="nofollow noindex"`. Monitor is finding `/admin` matches that include this OK link. But monitor's regex `"/admin" in href and "nofollow" not in rel_str` should pass. Unless there's another `/admin` link elsewhere. The issue may be Header or nav menu references. Actually one is the Footer link with proper nofollow. So monitor must have found another. Need to check.

Plus the new task: add seoRoutes.ts ↔ sitemap sample-50 sync check.

<lov-plan>

# Monitor v3.1 + Fix 6 Critical Issues

## Часть 1 — расширение `scripts/monitor.py`

Добавляю **новую секцию check 13: SeoRoutes ↔ Sitemap Sync**:

- Парсит `src/lib/seoRoutes.ts` через regex (без TS-eval): извлекает массивы `staticRoutes`, `servicesSlugs`, `dezinsekciyaPestSlugs`, `objectSlugs`, `districtSlugs`, `moscowRegionCitySlugs`, `moleCitySlugs` и т.д.
- Строит ожидаемый набор путей по тем же шаблонам, что и `getAllSSGRoutes()` (упрощённо: services, pest combos, objects, districts, MO cities, mole cities).
- Сравнивает с фактическим sitemap-набором → находит **missing in sitemap** и **orphan in sitemap**.
- Берёт **детерминистический sample 50 URL** (фиксированный seed, чтобы не было drift между запусками): по 5 из каждой категории + 5 из `staticRoutes`.
- HEAD-запросом проверяет 200 OK; для сэмпла из 10 GET-ит full HTML и проверяет `canonical == fetched URL`.
- При >5% failures → `WARNING`, при >15% → `CRITICAL`.

Новые поля в `.monitoring-cache.json`:
```json
"sample_50_http_failures": 0,
"sample_50_canonical_failures": 0,
"seoroutes_sitemap_diff": 0
```

Новая секция в MONITORING.md: **«SeoRoutes ↔ Sitemap Sync»** в блоке Governance Checks.

**Также чиню false-positive в `REPRESENTATIVE_URLS`:**
- `("object_page", "/uslugi/dezinsekciya/kvartira/")` → `("object_page", "/uslugi/dezinsekciya/ofisov/")` (использовать существующий object slug `ofisov` из `objectSlugs`).

## Часть 2 — фикс 6 critical issues

### 2.1. `/rajony/cao/` canonical drift → homepage canonical

`DistrictPage.tsx` либо `metadata.ts` не выставляет canonical → SPA fallback оставляет canonical из `index.html` (= homepage). 

**Действие:** проверю `src/pages/DistrictPage.tsx` и `src/lib/metadata.ts` на genDistrictMetadata; если нет — добавлю явный canonical через SEOHead.

### 2.2. `/blog/klopy-v-kvartire/` 2× BreadcrumbList

В `BlogPost.tsx` два источника:
- `<StructuredData type="BreadcrumbList">` (line 147)
- Helmet schema от metadata generator (если он тоже включает breadcrumb)

**Действие:** оставлю один источник (StructuredData), уберу дубль из metadata schema. Согласно `mem://seo/structured-data-integrity-policy` — единый источник.

### 2.3. `/uslugi/sertifikaciya/` индексируется (хотя static имеет noindex)

Проверю что реально отдаёт live (если static `/uslugi/sertifikaciya/index.html` действительно содержит `noindex, follow`, то monitor ловит SPA fallback). 

**Возможные причины:**
- nginx правило `location ~ ^/uslugi/[^/]+/$` отдаёт `=404` для `sertifikaciya`, и SPA route на `/uslugi/sertifikaciya` рендерится без noindex.
- Static index.html лежит, но nginx по cache возвращает старую версию.

**Действие:**
1. Добавить в `nginx.conf` для `/uslugi/sertifikaciya/` явный header `X-Robots-Tag: noindex, follow` (страховка)
2. Убедиться что route `/uslugi/sertifikaciya` в `App.tsx` (если есть SPA-страница) имеет meta robots noindex через SEOHead. Если нет SPA-роута — нужно проверить что SSG не генерирует страницу.
3. Удалить `sertifikaciya` из любого внутреннего меню (если есть), чтобы не было orphan link.

### 2.4. `/uslugi/dezinsekciya/kvartira/` 404 → false positive monitor

**Действие:** уже исправлено в Часть 1 (REPRESENTATIVE_URLS slug). Реальный URL — `/uslugi/dezinsekciya/ofisov/`.

### 2.5. `/uslugi/borba-s-krotami/khimki/` 404

Khimki добавлен в `moleCities.ts` в Batch 3 P2, но live-сайт может ещё не быть пересобран/задеплоен. 

**Действие:** Это deployment lag, не code bug. После следующего CI build будет 200. В плане ничего не меняем кроме verification: после монитор-прогона проверить что khimki индексной странице 200.

### 2.6. /admin/ ссылки без nofollow

`Footer.tsx` уже имеет `rel="nofollow noindex"`. Monitor нашёл 2 ссылки — одна это footer (с nofollow OK), вторая — где-то ещё (возможно в Header, navigation menu, или в каком-то компоненте sidebar).

**Действие:** grep по всему проекту `href.*admin` без nofollow → найти и пофиксить. Если других нет — фикс в monitor.py: перед сравнением учитывать что `rel` может содержать `nofollow` в любом порядке/формате (regex проверка вместо substring).

## Файлы

- `scripts/monitor.py` — добавление SeoRoutes↔Sitemap check, fix REPRESENTATIVE_URLS slug, улучшение admin link detection
- `src/pages/DistrictPage.tsx` или `src/lib/metadata.ts` — canonical для районов
- `src/pages/BlogPost.tsx` — убрать дубль BreadcrumbList
- `nginx.conf` — `X-Robots-Tag: noindex` header для `/uslugi/sertifikaciya/`
- (возможно) Header/nav компонент — добавить `rel="nofollow"` на admin ссылки

## Verification

1. `python scripts/monitor.py` локально → проверить новую секцию SeoRoutes Sync
2. Проверить что:
   - `kvartira` → `ofisov` в representative audit (200 OK)
   - `cao` canonical = `https://goruslugimsk.ru/rajony/cao/` (не homepage)
   - blog post: `breadcrumb_count == 1`
   - sertifikaciya: `robots_meta` содержит `noindex`
   - admin leak count = 0
3. Cache: записаны новые 3 поля
4. `MONITORING.md` → Status: STABLE или WARNING (без CRITICAL)

## Что НЕ трогаю

- `seoRoutes.ts` (core lockdown)
- `vite-plugin-sitemap.ts` (core lockdown)
- workflow расписание
- Существующие structured data generators

