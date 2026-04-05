

# POST-DEPLOY QA: Phase 1 + Phase 2 Internal Linking

---

## 1. SEO QA

- **Passed**: noindex NCH Tier 2/3 excluded from all related blocks — `isSeoLinkable()` checks `tier1Pests` array (tarakany, klopy, krysy, myshi only)
- **Passed**: `/privacy/`, `/terms/`, `/admin/*`, `/login` excluded via `EXCLUDED_PREFIXES`
- **Passed**: canonical untouched — no changes to canonical logic in any page component
- **Passed**: robots/meta robots untouched — no noindex tags modified
- **Passed**: title/H1/description untouched across all pages
- **Passed**: sitemap logic untouched — `seoRoutes.ts` and `vite-plugin-sitemap.ts` not modified in Phase 1/2
- **Passed**: no new URLs created — only new components added, no routes changed
- **Passed**: no paid-traffic logic changed — TrafficContext untouched
- **Passed**: old Districts Links block removed from ServicePestPage (was linking to noindex NCH for Tier 2/3)
- **Passed**: duplicate BreadcrumbList schema fixed — `showSchema={false}` on ServicePestPage Breadcrumbs (line 215)
- **Passed**: `sertifikaciya` removed from `SERVICE_NAMES` map
- **Passed**: SES page has BreadcrumbList JSON-LD in metadata (lines 41-47)
- **Warning**: SES canonical missing trailing slash: `https://goruslugimsk.ru/sluzhba-dezinsekcii` — should be `https://goruslugimsk.ru/sluzhba-dezinsekcii/` per project standard. **Pre-existing issue, not introduced by Phase 1/2.**
- **Warning**: `InternalLinks` component still used on: BlogPost, Blog, NeighborhoodPage, MoscowRegionCityPage, ServiceLandingUchastkiPage — these are Phase 3 migration candidates, not regressions

---

## 2. UI QA

- **Passed**: all 3 components (`RelatedServices`, `RelatedGeoLinks`, `RelatedBlogLinks`) return `null` when `links.length === 0` — no empty blocks
- **Passed**: no empty headings — headings render only when block renders
- **Passed**: `RelatedGeoLinks` uses `flex-wrap justify-center gap-3` — wraps on mobile
- **Passed**: `RelatedServices` and `RelatedBlogLinks` use responsive grid `sm:grid-cols-2 lg:grid-cols-3`
- **Passed**: no duplicate links — `getRelatedServices` uses `pest.relatedPests` (self excluded); `getRelatedGeoLinks` iterates unique `topNeighborhoods`
- **Passed**: max link counts enforced — RelatedServices capped at 6, RelatedBlogLinks at 3, RelatedGeoLinks at 8+3
- **Passed**: FAQ contextual links are inline `<Link>` with `text-primary hover:underline` — consistent styling
- **Passed**: Breadcrumbs last element is `<span>` with `aria-current="page"`, not a link

---

## 3. PAGE-BY-PAGE QA

**Page: `/`**
- Breadcrumbs: N/A (homepage)
- RelatedServices: N/A (not added, correct)
- RelatedGeoLinks: N/A
- RelatedBlogLinks: N/A
- Noindex safety: OK
- Status: **OK**

**Page: `/uslugi/dezinsekciya/`**
- Breadcrumbs: Present (shadcn with schema) — OK
- District links: Uses `service.slug` dynamically (line 699) — **FIXED** from hardcoded `dezinfekciya`
- RelatedBlogLinks: **ADDED** (line 684) — replaces old inline articles block
- RelatedGeoLinks: **ADDED** (line 764) — 8 neighborhoods + 3 MO cities
- Related services: Present (hardcoded `relatedServices` + `displayServices`) — OK
- Noindex safety: OK
- Status: **OK**

**Page: `/uslugi/dezinsekciya/klopy/`**
- Breadcrumbs: OK, `showSchema={false}` — no duplicate JSON-LD
- RelatedBlogLinks: **ADDED** (line 453) — 2-3 articles for klopy
- RelatedServices: **ADDED** (line 475) — related pests + parent hub
- RelatedGeoLinks: **ADDED** (line 478) — 8 Tier 1 NCH neighborhoods (klopy is tier1 → direct NCH links)
- Old Districts Links: **REMOVED** — confirmed absent
- FAQ contextual links: **ADDED** — pricing link to `/uslugi/dezinsekciya/`, prep link to `/blog/kak-podgotovit-pomeshchenie/`
- Noindex safety: OK (klopy = Tier 1, all NCH links are indexable)
- Status: **OK**

**Page: `/uslugi/dezinsekciya/tarakany/`**
- Same structure as klopy — all fixes applied
- Status: **OK**

**Page: `/uslugi/deratizaciya/`**
- Breadcrumbs: Present (shadcn with schema) — OK
- District links: Uses `service.slug` dynamically — **FIXED**
- RelatedBlogLinks: **ADDED**
- RelatedGeoLinks: **ADDED**
- Status: **OK**

**Page: `/uslugi/borba-s-krotami/`**
- RelatedGeoLinks: **ADDED** — links to `/rajony/` neighborhoods (NOT NCH), correctly excludes MO cities (`serviceSlug !== 'borba-s-krotami'` check on line 166)
- Status: **OK**

**Page: `/uslugi/obrabotka-uchastkov/`**
- RelatedGeoLinks: **ADDED** — neighborhoods + MO cities
- Status: **OK**

**Page: `/rajony/`**
- RelatedServices: **ADDED** — 2 blocks: "Популярные услуги" (dezinsekciya pests) + "Борьба с грызунами" (deratizaciya pests)
- Not a doorway — only 2 compact blocks with 3-4 links each
- Status: **OK**

**Page: `/moscow-oblast/`**
- RelatedServices: **ADDED** — "Наши услуги" (dezinsekciya top 4 pests)
- Status: **OK**

**Page: `/sluzhba-dezinsekcii/`**
- Old `InternalLinks`: **REMOVED**, replaced with modular blocks
- RelatedServices: **ADDED** (line 208) — dezinsekciya pests
- RelatedGeoLinks: **ADDED** (line 209) — neighborhoods + MO
- RelatedBlogLinks: **ADDED** (line 210) — dezinsekciya articles
- FAQ contextual links: **ADDED** — pricing to `/uslugi/dezinsekciya/`, prep to `/blog/kak-podgotovit-pomeshchenie/`
- BreadcrumbList JSON-LD: Present in metadata (lines 41-47)
- Noindex safety: OK
- Status: **OK**

---

## 4. REMAINING `InternalLinks` USAGE (not regressions — Phase 3 candidates)

| Page | Component |
|------|-----------|
| `BlogPost.tsx` | `InternalLinks` based on post tags |
| `Blog.tsx` | `InternalLinks` (no params) |
| `NeighborhoodPage.tsx` | `InternalLinks` with currentNeighborhood |
| `MoscowRegionCityPage.tsx` | `InternalLinks` with currentCity |
| `ServiceLandingUchastkiPage.tsx` | `InternalLinks` for obrabotka-uchastkov |

These are not regressions — they were not in scope for Phase 1/2.

---

## 5. PRE-EXISTING ISSUES (not introduced by Phase 1/2)

| Issue | Severity | Detail |
|-------|----------|--------|
| SES canonical missing trailing slash | Low | `canonical: "https://goruslugimsk.ru/sluzhba-dezinsekcii"` — should end with `/` |
| `tier1Pests` duplicated | Low | Defined in both `nchSeeds.ts` and `seoRoutes.ts` — `internalLinking.ts` imports from `nchSeeds.ts` which is correct |

---

## 6. FINAL STATUS

### **READY FOR PRODUCTION**

All Phase 1 QA issues (duplicate geo block, duplicate BreadcrumbList schema, deprecated sertifikaciya) have been resolved in Phase 2. The new modular linking system is correctly deployed across all 10 priority pages. No SEO regressions detected. No links to noindex pages. No new URLs created. Canonical, robots, sitemap, and paid-traffic logic untouched.

