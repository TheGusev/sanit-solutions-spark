

# Phase 4: Replace InternalLinks + Canonical Fix

## Canonical Fix
Already applied — `src/pages/ServiceSESPage.tsx` line 28 already has trailing slash. No action needed.

## Phase 4 Scope — 7 files

| # | File | Current | Replace with |
|---|------|---------|-------------|
| 1 | `DistrictPage.tsx` (line 393) | `InternalLinks currentService, currentDistrict` | RelatedServices + RelatedGeoLinks + RelatedBlogLinks |
| 2 | `NchPage.tsx` (lines 590-595) | `InternalLinks currentService, currentPest, currentNeighborhood` | RelatedServices + RelatedGeoLinks + RelatedBlogLinks |
| 3 | `MoleCityPage.tsx` (line 298) | `InternalLinks currentService="borba-s-krotami"` | RelatedServices + RelatedGeoLinks |
| 4 | `MoscowRegionServicePage.tsx` (lines 337-341) | `InternalLinks currentService, currentCity` | RelatedServices + RelatedGeoLinks + RelatedBlogLinks |
| 5 | `DistrictsOverview.tsx` (line 167) | `InternalLinks` (no params) | RelatedServices + RelatedBlogLinks |
| 6 | `ServiceSubpage.tsx` (line 391) | `InternalLinks currentService` | RelatedServices + RelatedGeoLinks + RelatedBlogLinks |
| 7 | `ServiceDistrictPage.tsx` (lines 209-214) | `InternalLinks currentService, currentNeighborhood` | RelatedServices + RelatedGeoLinks + RelatedBlogLinks |

## New helpers in `src/lib/internalLinking.ts`

### `getRelatedMoleCities(currentCitySlug: string): InternalLinkItem[]`
Uses `moleCities[current].relatedCities` to return 3-5 neighboring mole city pages.
```ts
import { moleCities } from '@/data/moleCities';
export function getRelatedMoleCities(currentCitySlug: string): InternalLinkItem[] {
  const city = moleCities.find(c => c.slug === currentCitySlug);
  if (!city) return [];
  return city.relatedCities.slice(0, 5).map(slug => {
    const rel = moleCities.find(c => c.slug === slug);
    return rel ? { url: `/uslugi/borba-s-krotami/${slug}/`, text: rel.name } : null;
  }).filter(Boolean);
}
```

### `getRelatedMoCityServices(citySlug: string, currentServiceSlug: string): InternalLinkItem[]`
Returns other services available in the same MO city (excluding current).
```ts
const MO_SERVICES = ['dezinsekciya', 'deratizaciya', 'dezinfekciya'];
export function getRelatedMoCityServices(citySlug: string, currentServiceSlug: string): InternalLinkItem[] {
  return MO_SERVICES
    .filter(s => s !== currentServiceSlug)
    .map(s => ({ url: `/moscow-oblast/${citySlug}/${s}/`, text: SERVICE_NAMES[s] || s }))
    .slice(0, 4);
}
```

### `getRelatedMoCitiesForService(serviceSlug: string, currentCitySlug: string): InternalLinkItem[]`
Returns 4-5 other MO cities offering the same service.
```ts
export function getRelatedMoCitiesForService(serviceSlug: string, currentCitySlug: string): InternalLinkItem[] {
  return moscowRegionCities
    .filter(c => c.slug !== currentCitySlug)
    .slice(0, 5)
    .map(c => ({ url: `/moscow-oblast/${c.slug}/${serviceSlug}/`, text: c.name }));
}
```

## Per-file details

### 1. DistrictPage.tsx
DistrictPage is for /uslugi/dezinfekciya-cao/ style pages (service+district combos). Replace line 393:
```tsx
<RelatedServices serviceSlug={serviceType} title={`Услуги в ${district.name}`} />
<RelatedGeoLinks serviceSlug={serviceType} title="Работаем по районам Москвы" />
<RelatedBlogLinks serviceSlug={serviceType} />
```

### 2. NchPage.tsx
Replace lines 589-595. Service/pest/neighborhood are already available as variables:
```tsx
<RelatedServices serviceSlug={service} pestSlug={pestSlug} title="Смотрите также" />
<RelatedGeoLinks serviceSlug={service} pestSlug={pestSlug} />
<RelatedBlogLinks serviceSlug={service} pestSlug={pestSlug} />
```

### 3. MoleCityPage.tsx
Replace line 298. Use new `getRelatedMoleCities` helper via a new `RelatedMoleCities` inline block:
```tsx
<RelatedServices serviceSlug="borba-s-krotami" title="Смежные услуги" />
<RelatedGeoLinks serviceSlug="borba-s-krotami" />
```
Also add inline block for related mole cities (3-5 links from `city.relatedCities`):
```tsx
{relatedMoleCityLinks.length > 0 && (
  <section className="py-8">
    <div className="container mx-auto px-4 text-center">
      <h3 className="text-lg font-bold mb-4">Борьба с кротами в других городах МО</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {relatedMoleCityLinks.map(link => (
          <Link key={link.url} to={link.url} className="px-4 py-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors text-sm font-medium">
            {link.text}
          </Link>
        ))}
      </div>
    </div>
  </section>
)}
```
Where `relatedMoleCityLinks = getRelatedMoleCities(city.slug)`.

### 4. MoscowRegionServicePage.tsx
Replace lines 336-341. Use `getRelatedMoCityServices` and `getRelatedMoCitiesForService`:
```tsx
<RelatedServices serviceSlug={serviceSlug} title={`Другие услуги в ${city.prepositional}`} />
<RelatedGeoLinks title="Районы Москвы" />
<RelatedBlogLinks serviceSlug={serviceSlug} />
```
Plus inline block for same service in other MO cities using `getRelatedMoCitiesForService`.

### 5. DistrictsOverview.tsx
Replace line 167. This is the /uslugi/po-okrugam-moskvy/ hub:
```tsx
<RelatedServices serviceSlug="dezinsekciya" title="Популярные услуги" />
<RelatedBlogLinks serviceSlug="dezinsekciya" title="Полезные статьи" />
```
No RelatedGeoLinks — the page itself IS the geo hub.

### 6. ServiceSubpage.tsx
Replace line 391:
```tsx
<RelatedServices serviceSlug={parentSlug || ''} title="Смежные услуги" />
<RelatedGeoLinks serviceSlug={parentSlug} />
<RelatedBlogLinks serviceSlug={parentSlug} />
```

### 7. ServiceDistrictPage.tsx
Replace lines 209-214. This is /uslugi/dezinsekciya/arbat/ (service+neighborhood):
```tsx
<RelatedServices serviceSlug={serviceSlug || ''} title="Смотрите также" />
<RelatedGeoLinks serviceSlug={serviceSlug} />
<RelatedBlogLinks serviceSlug={serviceSlug} />
```

## Files changed

| Action | File |
|--------|------|
| Edit | `src/lib/internalLinking.ts` — add 3 new helpers |
| Edit | `src/pages/DistrictPage.tsx` |
| Edit | `src/pages/NchPage.tsx` |
| Edit | `src/pages/MoleCityPage.tsx` |
| Edit | `src/pages/MoscowRegionServicePage.tsx` |
| Edit | `src/pages/DistrictsOverview.tsx` |
| Edit | `src/pages/ServiceSubpage.tsx` |
| Edit | `src/pages/ServiceDistrictPage.tsx` |

## What does NOT change
- URL, canonical, robots, noindex, sitemap — untouched
- H1/title/description — untouched
- Paid-traffic logic — untouched
- No new pages created
- `InternalLinks.tsx` component file — kept (can be deleted in cleanup phase when confirmed zero imports)

