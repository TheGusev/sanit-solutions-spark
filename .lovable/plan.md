

# Revised Implementation Plan — Full Verification + VK Removal + Calculator Rework

## PHASE A: REAL Full-Site Pre-Change Verification

### A.1 — Build & SSG Verification
- Run `npm run build` and count all generated `index.html` files (must be >= 500)
- Confirm zero TypeScript errors
- List `dist/` top-level directories to verify all route branches exist

### A.2 — Representative URL Spot-Checks (12 page types)
For each type, grep the built HTML to verify: `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta name="robots">`, H1 tag, BreadcrumbList JSON-LD count, FAQPage JSON-LD count.

| # | Page Type | URL to check |
|---|-----------|-------------|
| 1 | Homepage | `/` |
| 2 | Service hub | `/uslugi/dezinsekciya/` |
| 3 | Pest page | `/uslugi/dezinsekciya/tarakany/` |
| 4 | Object page | `/uslugi/dezinsekciya/tarakany/kvartira/` |
| 5 | District page | `/rajony/tverskoy/` |
| 6 | MO overview | `/moscow-oblast/` |
| 7 | MO city page | `/moscow-oblast/korolev/` (fixed slug) |
| 8 | Mole city page | `/uslugi/borba-s-krotami/barvikha/` |
| 9 | Blog index | `/blog/` |
| 10 | Blog post | `/blog/klopy-v-kvartire/` |
| 11 | NCH page | `/uslugi/dezinsekciya/tarakany/tverskoy/` |
| 12 | Contacts | `/contacts/` |

### A.3 — Robots/Sitemap/Canonical Governance
- Parse `dist/sitemap.xml` or `dist/sitemap-index.xml` — count URLs, verify trailing slashes, verify no admin/noindex/utility pages
- Verify `dist/robots.txt` content matches expected policy
- Cross-check: canonical in HTML matches sitemap entry for 5 representative pages

### A.4 — Schema Deduplication
- Count `application/ld+json` scripts per page for 5 representative pages — must be exactly as expected (no duplicates)
- Verify no inline BreadcrumbList in page templates (centralized component only)

### A.5 — Pagination
- Confirm no `?page=` URLs in sitemap or internal links (grep dist for `?page=`)

### A.6 — Internal Linking
- Grep for broken internal links (links to `/uslugi/sertifikaciya/`, `/admin/`, etc. from SEO pages)
- Verify relatedServices/relatedPests slugs resolve

### A.7 — Analytics Pre-Check
- Document current `trackGoal` call sites and which goals fire
- Document VK/TMR references to be removed
- Baseline: `all_conversions` set contains 12 goals

### A.8 — Console/Runtime
- Check browser console for errors on homepage

---

## PHASE B: VK/TMR Layer Removal

### Exact Changes

**File 1: `index.html`** — Remove:
- Line 16: `<link rel="dns-prefetch" href="https://vk.com">`
- Line 17: `<link rel="dns-prefetch" href="https://top-fwz1.mail.ru">`
- Line 375: `<img src="https://vk.com/rtrg?p=3727204" ...>`
- Line 376: `<img src="https://top-fwz1.mail.ru/counter?id=3728465..." ...>`
- Lines 547-559: VK Pixel JS block + Top.Mail.Ru counter JS block

**File 2: `src/lib/analytics.ts`** — Remove:
- Lines 31-38: `window.VK` and `window._tmr` type declarations from `declare global`
- Line 42: `const TOP_MAIL_RU_ID = '3728465';`
- Lines 207-249: VK event dispatch block + TMR goal dispatch block inside `trackGoal()`

### What Stays
- Yandex.Metrika (ID 105828040) — untouched
- `all_conversions` composite goal (lines 184-205) — untouched
- `trackPageView`, `setUserProperties`, `getYmGoalPrefix`, `getYmGoalId` — untouched
- Hotjar/PostHog stubs — untouched
- `handle-lead` edge function — untouched (has zero VK references)

### Post-Removal Verification
- Grep entire codebase for `VK.Retargeting`, `_tmr`, `TOP_MAIL`, `vk.com/rtrg`, `top-fwz1` — must return zero in `.ts`/`.tsx`/`.html` (except `mail.ru` email addresses which are unrelated)
- Build must pass
- `trackGoal('lead_submit')` still fires Yandex.Metrika + `all_conversions`
- No dead imports, no undefined references

### Additional Schema Fix (same batch)
- `index.html` line 207: Remove `"https://wa.me/79069989888"` from `sameAs` array (WhatsApp excluded per memory)

---

## PHASE C: Calculator Rework

### Current Problem
The current `Calculator.tsx` (917 lines) uses a formula `basePrice = 20 * area * multipliers` that produces arbitrary prices disconnected from the site's actual pricing. No pest selection, no apartment room count selection.

### Source of Truth: `services.ts` pricing arrays
These are the EXACT prices displayed on each service page. The new calculator must use these values directly.

### COMPLETE PRICE MAPPING TABLE

All prices below are `coldFog` (default method) from `services.ts`:

```text
┌─────────────────────────┬───────────────────────┬────────────┐
│ Category                │ Object                │ Price      │
├─────────────────────────┼───────────────────────┼────────────┤
│ ДЕЗИНФЕКЦИЯ (dezinfekciya)                                   │
│ Плесень/Вирусы/Бактерии │ 1-к квартира          │ 1 000 ₽    │
│                         │ 2-к квартира          │ 1 500 ₽    │
│                         │ 3-к квартира          │ 2 000 ₽    │
│                         │ Офис/магазин до 100м² │ 2 500 ₽    │
│                         │ Помещение от 100м²    │ от 25₽/м²  │
├─────────────────────────┼───────────────────────┼────────────┤
│ ДЕЗИНСЕКЦИЯ (dezinsekciya)                                   │
│ Тараканы/Клопы/Муравьи  │ 1-к квартира          │ 1 200 ₽    │
│                         │ 2-к квартира          │ 1 800 ₽    │
│                         │ 3-к квартира          │ 2 500 ₽    │
│                         │ Частный дом до 150м²  │ 3 500 ₽    │
│                         │ Офис/ресторан до 100м²│ 3 000 ₽    │
├─────────────────────────┼───────────────────────┼────────────┤
│ ДЕРАТИЗАЦИЯ (deratizaciya)                                   │
│ Мыши/Крысы              │ Квартира до 80м²      │ 1 400 ₽    │
│                         │ Частный дом до 200м²  │ 3 000 ₽    │
│                         │ Подвал/чердак до 100м²│ 2 500 ₽    │
│                         │ Склад/произв. до 500м²│ 5 000 ₽    │
│                         │ Ресторан/кафе до 200м²│ 4 000 ₽    │
├─────────────────────────┼───────────────────────┼────────────┤
│ ОЗОНИРОВАНИЕ (ozonirovanie)                                  │
│ Запахи/Грибок/Вирусы    │ 1-к квартира          │ 1 500 ₽    │
│                         │ 2-к квартира          │ 2 500 ₽    │
│                         │ 3-к квартира          │ 3 500 ₽    │
│                         │ Офис/помещение до 100м│ 4 000 ₽    │
│                         │ Автомобиль            │ 1 500 ₽    │
├─────────────────────────┼───────────────────────┼────────────┤
│ ДЕЗОДОРАЦИЯ (dezodoraciya)                                   │
│ Устранение запахов       │ 1-к квартира          │ 1 200 ₽    │
│                         │ 2-к квартира          │ 1 800 ₽    │
│                         │ 3-к квартира          │ 2 500 ₽    │
│                         │ Частный дом до 200м²  │ 4 000 ₽    │
│                         │ Автомобиль            │ 1 500 ₽    │
├─────────────────────────┼───────────────────────┼────────────┤
│ ДЕМЕРКУРИЗАЦИЯ (demerkurizaciya)                             │
│ Разбитый градусник       │ 1 комната до 20м²    │ 3 000 ₽    │
│                         │ 2 комнаты до 40м²    │ 4 500 ₽    │
│                         │ Квартира целиком до80м│ 6 000 ₽    │
│                         │ Офис/предприятие 100м+│ от 60₽/м²  │
└─────────────────────────┴───────────────────────┴────────────┘
```

### New Calculator UX Flow

**Step 1: Выбор проблемы** (pest/problem selection)
6 buttons:
- 🪳 Тараканы/Клопы/Насекомые → maps to dezinsekciya pricing
- 🐀 Мыши/Крысы → maps to deratizaciya pricing
- 🦠 Плесень/Вирусы/Бактерии → maps to dezinfekciya pricing
- 🌬️ Неприятные запахи → maps to dezodoraciya pricing
- 💨 Озонирование → maps to ozonirovanie pricing
- ☣️ Разбитый градусник → maps to demerkurizaciya pricing

**Step 2: Выбор объекта** (filtered by problem)
Show only objects that exist in that service's pricing table. Examples:
- dezinsekciya: Квартира, Частный дом, Офис/Ресторан
- deratizaciya: Квартира, Частный дом, Подвал/Чердак, Склад, Ресторан/Кафе
- demerkurizaciya: 1 комната, 2 комнаты, Квартира целиком, Офис

**Step 3: IF "Квартира" selected and service has room breakdown** → explicit room count
- 1-к квартира
- 2-к квартира
- 3-к квартира
(No default selection. User must explicitly choose.)

**Step 4: Price display + lead form**
Show the exact price from the mapping table above. Format: "от X ₽"
Below: phone field, consent checkbox, "Вызвать мастера" button.

### Technical Implementation

**New file:** `src/components/SimpleCalculator.tsx` (~300 lines)
- Imports `servicePrices` concept but uses `servicePages` pricing arrays from `services.ts` as the actual source of truth (these are what's displayed on service pages)
- Creates a `CALC_PRICE_MAP` constant that maps `[problem][object][room?]` → price string directly from `services.ts` pricing data
- Uses existing `QuickCallForm` pattern for phone + submit, but adapted inline
- Consent checkbox (links to Privacy Policy)
- Double-submit protection via `isSubmitting` state
- Success/error states inline
- Mobile-first: large buttons (min-h-[48px]), single column, clear visual states

**Modified file:** `src/components/CalculatorModal.tsx`
- Change import from `./Calculator` to `./SimpleCalculator`

**Lead data sent to `handle-lead`:**
- `name`: "Калькулятор"
- `phone`: user input
- `object_type`: selected object (Russian label)
- `service`: selected problem category slug
- `final_price`: exact price string shown to user (e.g., "от 1 200 ₽")
- `source`: "calculator_v2"
- `last_page_url`: `window.location.href`
- All UTM params from TrafficContext
- `session_id`, `intent`, `variant_id`, `device_type` from TrafficContext

**NOT changed:**
- `Calculator.tsx` — kept but no longer imported (can be deleted later)
- `handle-lead` edge function — no changes needed, already accepts all fields
- `QuickCallForm.tsx` — not reused directly (new calculator has inline form), but pattern preserved
- `servicePrices.ts` — untouched
- `quizPriceMap.ts` — untouched

### Calculator States
1. `idle` — Step 1 visible, no selection
2. `pest_selected` — Step 2 appears with filtered objects
3. `object_selected` — Either Step 3 (room choice) appears OR skip to price
4. `room_selected` — Price shown + lead form
5. `submitting` — Button disabled, spinner
6. `success` — Green confirmation
7. `error` — Error message, retry available

### Analytics Integration
- `calc_open` — fires when modal opens (existing CalculatorModal logic)
- `calc_interact` — fires on first selection
- `calc_price_view` — fires when price becomes visible
- `lead_submit` — fires on successful submission → triggers `all_conversions`

---

## PHASE D: Post-Change Full Verification

### D.1 — Build
- `npm run build` — zero errors, page count >= 500

### D.2 — VK Removal Proof
- Grep `dist/index.html` for `vk.com`, `top-fwz1`, `_tmr` — zero matches
- Grep `src/` for same — zero matches (excluding `mail.ru` email)
- Grep for `vkEventMap`, `tmrGoalMap` — zero matches

### D.3 — Analytics Integrity
- Verify `trackGoal` function still has Yandex.Metrika dispatch + `all_conversions` composite
- Verify no dead imports in analytics.ts
- Count `trackGoal` call sites across codebase — same count as before (minus zero, VK was inline)

### D.4 — Lead Delivery Test
- Use `supabase--curl_edge_functions` to POST a test lead to `handle-lead` and verify success response

### D.5 — Representative URL Re-Check
Same 12 URLs from Phase A — verify title, canonical, robots, schema counts unchanged

### D.6 — Calculator-Specific Checks
- Verify `CalculatorModal` imports `SimpleCalculator`
- Verify all 6 problem categories render correct object lists
- Verify apartment room selection appears and has no default
- Verify 3 price spot-checks match the table above exactly

### D.7 — Schema
- Verify WhatsApp removed from sameAs
- Verify no new JSON-LD added

### D.8 — Mobile
- Check calculator at 375px viewport — buttons 48px+, no overflow

---

## Implementation Order (Safe Batches)

| Batch | Phase | Files Changed | Risk |
|-------|-------|--------------|------|
| 0 | A | None (read-only verification) | Zero |
| 1 | B | `index.html`, `src/lib/analytics.ts` | Low (deletions only) |
| 2 | C | New `SimpleCalculator.tsx`, modify `CalculatorModal.tsx` | Medium |
| 3 | D | None (verification only) | Zero |

## Files NOT Changed
- Routing, slugs, canonicals, sitemap logic
- `seoRoutes.ts`, `vite-plugin-ssg.ts`, `vite-plugin-sitemap.ts`
- `handle-lead` edge function
- `services.ts`, `servicePrices.ts`, `quizPriceMap.ts`
- Any page template or SEO component
- `robots.txt`, `_redirects`

