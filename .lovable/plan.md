

User wants me to execute the consolidated TZ. This is implementation work (P0 + P1 fixes + verification). Plan mode = read-only, so I present a focused execution plan and get approval, then switch to default mode.

Key constraints from TZ:
- 3 batches with mandatory verification between each
- Strict stop-conditions (no new URLs, no slug changes, no routing drift)
- Must produce evidence-based verification report

Let me check a few critical files first to confirm the actual state before planning fixes.

I'll keep the plan tight: 3 batches, exact files, exact changes, verification gates. No fluff.

# Final Cleanup & Verification — Consolidated TZ Execution

## Batch 1 — P0 Critical Fixes (single batch, ~30 min)

### 1.1 Telegram HTML mode — `supabase/functions/handle-lead/index.ts`
- Replace `parse_mode: "Markdown"` → `parse_mode: "HTML"`
- Add HTML escape helper for `<`, `>`, `&`
- Convert `*bold*` → `<b>bold</b>`, `[text](url)` → `<a href="url">text</a>`
- Live test via `supabase--curl_edge_functions` with payload containing `(`, `-`, emoji, `+7...`
- Verify via `supabase--edge_function_logs` — no "can't parse entities" errors

### 1.2 Korolev sitemap fix — `vite-plugin-sitemap.ts:272`
- Replace `korolyov` → `korolev`
- Grep entire repo for residual `korolyov` references
- Rebuild, grep `dist/sitemap-moscow-region.xml` to confirm zero `korolyov` URLs

### 1.3 Sertifikaciya exclusion — choose option B (keep + noindex)
- Add `<meta name="robots" content="noindex,follow">` to ServicePage when slug is `sertifikaciya`
- Remove from sitemap generation
- Remove from any `RelatedServices` / footer / internal linking output
- Rationale: physical page kept (no broken links), but excluded from index

### 1.4 WhatsApp purge
- Grep `src/`, `public/`, `index.html` for `wa\.me`, `whatsapp`, `api.whatsapp`
- Remove all matches (priority: `index.html:503` noscript block)
- Verify post-build: `grep -ri "wa\.me\|whatsapp" dist/` → 0 hits

### Batch 1 Verification Gate
- `npm run build` clean
- Live Telegram test passed
- Sitemap grep clean
- WhatsApp grep clean
- 3 representative URLs (homepage, service hub, sertifikaciya) — canonical/robots correct

---

## Batch 2 — P1 High Priority (~1.5 h)

### 2.1 Duplicate schema cleanup
- Audit `SEOHead.tsx`, `StructuredData.tsx`, `Breadcrumbs.tsx`, page templates
- Enforce single-source: BreadcrumbList only via SEOHead
- Remove duplicate AggregateRating from pest pages (keep only in Service schema)
- Remove FAQPage schema where no visible accordion exists
- Verify: `grep -c "BreadcrumbList" dist/<page>/index.html` = 1 on all representative URLs

### 2.2 Pricing centralization
- Grep hardcoded prices in `FAQ.tsx`, `StructuredData.tsx`, `neighborhoods.ts`, content generators
- Refactor to import from `servicePrices.ts`
- Stop-condition: do NOT change actual price values

### 2.3 Calculator double-submit guard — `SimpleCalculator.tsx`
- Add `isSubmitting` state
- `disabled={isSubmitting}` on submit button
- Reset on success/error
- Mobile UX preserved

### 2.4 Internal linking leaks
- Add `rel="nofollow"` to admin link in `Footer.tsx:138`
- Audit `RelatedGeoLinks` filter for MO↔Mole contamination — add cluster-type filter
- Audit money page inflow counts — boost where <5 inbound (no new URLs, only adjust existing related-blocks logic)

### Batch 2 Verification Gate
- Schema dedup verified per template type
- Pricing audit: change one test price, confirm propagates everywhere
- Calculator: rapid double-click → 1 lead only
- Internal linking: `grep "/admin/" dist/**/*.html` shows only nofollow

---

## Batch 3 — P2 Quality Hardening (separate session, optional now)

Defer unless explicitly requested in same execution:
- Mole content enhancement (650+ words per city)
- Khimki addition decision
- Bundle/performance optimization
- Service worker stale-HTML strategy

**Recommendation:** Execute Batch 1 + Batch 2 now, defer Batch 3 to separate approval.

---

## Verification Report Format (TZ-mandated)

**Section A — FIXES APPLIED**: file list, exact changes, why no architecture impact

**Section B — VERIFICATION RESULTS** across 12 representative URLs:
- homepage `/`
- service hub `/uslugi/dezinsekciya/`
- pest page `/uslugi/dezinsekciya/klopy/`
- object page `/uslugi/dezinsekciya/kvartira/`
- Moscow district `/rajony/cao/`
- MO overview `/moscow-oblast/`
- MO city `/moscow-oblast/podolsk/`
- mole city `/moscow-oblast/istra/kroty/`
- blog `/blog/klopy-v-kvartire/`
- utility `/uslugi/sertifikaciya/` (post-noindex)
- contacts `/contacts/`
- calculator-bearing page

For each: title / canonical / robots / H1 / BreadcrumbList count / FAQPage presence / pricing consistency

**Section C — STOP-CONDITIONS CHECK**: explicit confirmation that no new URLs, no slug changes, no routing drift, no canonical drift, no analytics regression

---

## Stop-Conditions (will be respected)

- ✅ No new URLs
- ✅ No slug changes (only fixing `korolyov` typo to match existing `korolev` standard)
- ✅ No canonical/routing/sitemap drift (except intentional sertifikaciya exclusion)
- ✅ No new schema entities
- ✅ No analytics regression
- ✅ No blog→money drift

## Tools needed in default mode

- `code--exec` — npm run build, grep, find
- `code--line_replace` / `code--write` — code edits
- `supabase--curl_edge_functions` — live Telegram test
- `supabase--edge_function_logs` — verify Telegram delivery
- `supabase--deploy_edge_functions` — deploy handle-lead after fix

After approve → execute Batch 1 → verification gate → Batch 2 → verification gate → final report in 3-section format. Batch 3 deferred to separate approval per TZ ordering.

