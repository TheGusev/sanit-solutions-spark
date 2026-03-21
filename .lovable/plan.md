

## Plan: Create geo-pages for dezinsekciya and deratizaciya by Moscow districts

### What we're building
18 new pages: 12 for dezinsekciya (one per okrug) + 6 for deratizaciya (subset of okrugs where rodent issues are most relevant: ЦАО, САО, СВАО, ВАО, ЮВАО, ЮАО, ЮЗАО, ЗАО, СЗАО + НАО, ТАО, ЗелАО = all 12).

Total: **24 new pages** (12 dezinsekciya + 12 deratizaciya).

URL pattern: `/uslugi/dezinsekciya-cao/`, `/uslugi/deratizaciya-cao/`, etc. — same as existing `/uslugi/dezinfekciya-cao/`.

### Approach
Rather than duplicating all district data 3x, make `DistrictPage` **service-aware** — it receives a `serviceType` prop and adapts titles, descriptions, schema, and breadcrumbs accordingly. The existing `districtPages` data stays as-is (neighborhoods, cases, FAQ are district-specific, not service-specific).

### Steps

1. **`src/pages/ServicePage.tsx`** (lines 58-78) — extend the district detection to handle `dezinsekciya-*` and `deratizaciya-*` prefixes:
   ```
   // Check for any service-district slug pattern
   const serviceDistrictMatch = slug?.match(/^(dezinfekciya|dezinsekciya|deratizaciya)-(.+)$/);
   if (serviceDistrictMatch) {
     const [, servicePrefix, districtId] = serviceDistrictMatch;
     const district = getDistrictById(districtId);
     if (district) return <DistrictPage districtId={districtId} serviceType={servicePrefix} />;
   }
   ```

2. **`src/pages/DistrictPage.tsx`** — add `serviceType` prop (default `'dezinfekciya'`). Update all hardcoded "Дезинфекция" strings to use a service name map:
   - `serviceType='dezinsekciya'` → "Дезинсекция", base price 1200₽
   - `serviceType='deratizaciya'` → "Дератизация", base price 1400₽
   - `serviceType='dezinfekciya'` → "Дезинфекция", base price 1000₽
   - Update: `metaTitle`, `h1`, `canonicalUrl`, breadcrumbs, JSON-LD schemas, `og:title`, InternalLinks `currentService`
   - The `district.slug` for canonical becomes `${serviceType}-${district.id}`

3. **`src/lib/seoRoutes.ts`** (line 280-288) — add dezinsekciya and deratizaciya district routes:
   ```ts
   ['dezinfekciya', 'dezinsekciya', 'deratizaciya'].forEach(service => {
     districtSlugs.forEach(id => {
       routes.push({ path: `/uslugi/${service}-${id}/`, ... });
     });
   });
   ```

4. **`src/pages/DistrictsOverview.tsx`** — update the district cards to show links to all 3 service variants (dezinfekciya, dezinsekciya, deratizaciya) per district.

5. **Static HTML files** — generate `public/uslugi/dezinsekciya-{id}/index.html` and `public/uslugi/deratizaciya-{id}/index.html` for all 12 okrugs (24 files total) following the same minimal SSG pattern as existing `dezinfekciya-*` files.

### No data duplication
All 24 new pages reuse the same `districtPages` data — only the service label, prices, and SEO metadata change dynamically based on `serviceType`.

### SSG sync (3-way)
- `seoRoutes.ts` ✓ (step 3)
- `App.tsx` — no change needed, already handled by `/uslugi/:slug` → `ServicePage`
- `AppSSR.tsx` — no change needed (same routing)
- Static HTML files ✓ (step 5)

