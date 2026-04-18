

This is a deep audit request — research/diagnosis only, no code changes. The user wants a comprehensive 7-block forensic audit. In plan mode I'm read-only, so I cannot run `npm run build`, `grep dist/`, or `supabase--curl_edge_functions`. To deliver real depth the user demands (line-level evidence, build artifacts, schema counts, lead delivery proof), I need default mode.

I'll present a tight execution plan, get approval, then run the audit in default mode and deliver one consolidated forensic report.

# Полный Forensic Audit — План Выполнения

## Что будет проверено (5 блоков аудита)

### Блок 1 — Architecture / Routing / Sync
- `seoRoutes.ts`, `vite-plugin-ssg.ts`, `vite-plugin-sitemap.ts` — статический анализ
- `npm run build` → реальный подсчёт `dist/**/index.html`
- Сверка: routes в коде ↔ файлы в dist ↔ URLs в sitemap (3-way diff)
- Trailing slash audit: grep dist на URLs без `/` в canonical/sitemap/internal links
- Tier 2/3 NCH isolation: все ли noindexed
- Korolev/korolyov rasync (предыдущая критическая находка) — статус

### Блок 2 — Content Health / Anti-Doorway
- Mole cluster (23 города) — diff контента, выявление шаблонного дублирования
- MO cluster — то же самое
- Pricing source-of-truth: grep на хардкод цен вне `services.ts` / `servicePrices.ts`
- Schema audit: JSON-LD count per page, дубли BreadcrumbList/FAQPage
- Intent cannibalization: `/uslugi/dezinsekciya/klopy/` vs `/uslugi/borba-s-klopami/`

### Блок 3 — Internal Linking / Weight Flow
- `internalLinking.ts` — модули и фильтры
- Silo isolation: cross-cluster links MO↔Mole↔Districts
- Money pages link inflow: подсчёт входящих ссылок на 15 priority pages
- Link leaks: grep на ссылки в `/admin/`, `/sertifikaciya/`, noindex pages
- Pagination: проверка отсутствия `?page=` URLs в dist

### Блок 4 — Runtime / Build Health
- TypeScript compile errors
- Bundle size analysis (`dist/assets/*.js` по размеру)
- Mobile layout: viewport overflow risks (grep на `min-width:` хардкоды)
- Service Worker / cache strategy verification
- Console errors через browser tools на 3 representative pages

### Блок 5 — Conversion / Leads / Analytics
- `SimpleCalculator.tsx` — double-submit guard, state integrity
- `handle-lead` edge function — реальный test через `supabase--curl_edge_functions`
- `analytics.ts` — все trackGoal call sites, dispatch integrity post-VK-removal
- `all_conversions` composite goal — список goals
- Telegram delivery verification через edge function logs

## Deliverable — Единый отчёт в требуемом формате

**Раздел А: CRITICAL FAILURES (Красная зона)**
Все сломанные/расходящиеся/дублированные элементы с точными ссылками `file:line`. Если пусто — "ИДЕАЛЬНО".

**Раздел Б: WARNINGS & OPTIMIZATIONS (Жёлтая зона)**
Мелкие риски, техдолг, шероховатости перелинковки.

**Раздел В: ОБЩАЯ ОЦЕНКА И ВЕРДИКТ (Grade /100)**
- Architecture / SSG: __/20
- SEO Hygiene: __/25
- Content Quality: __/15
- Internal Linking: __/15
- Performance / Runtime: __/10
- Conversion Integrity: __/15
- **TOTAL: __/100**
- Production-ready verdict: YES / NO с обоснованием
- "#1 in class" assessment для ниши дезинфекция МСК

## Что НЕ будет меняться

**Read-only audit.** Никаких правок кода. Все найденные проблемы — в отчёт с приоритетами (CRITICAL / HIGH / MEDIUM / LOW). Каждый fix — отдельный focused batch с твоим approval.

## Инструменты, которые потребуются (нужен default mode)

- `code--exec` — `npm run build`, grep, find, wc
- `supabase--curl_edge_functions` — реальный lead delivery test
- `supabase--edge_function_logs` — verify Telegram dispatch
- `browser--read_console_logs` + `browser--screenshot` — runtime audit на 3 pages
- `code--view`, `code--search_files` — статический анализ

После approve → переключусь в default mode → выполню всё последовательно одним прогоном → отдам единый структурированный отчёт. Никаких partial deliveries, никаких file edits.

