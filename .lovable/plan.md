

## Plan: Add 4 Missing MO Cities to Semantic Core

**Problem**: `semanticCore.ts` has 10 MO cities in `moCities` array (line 353-358), but 4 cities that have pages and are in all routing files are missing: Клин, Раменское, Чехов, Домодедово.

**Fix**: One edit in `src/data/semanticCore.ts`, line 358 — add 4 entries to `moCities` array:

```typescript
// After existing line 358:
{ slug: 'klin', name: 'клин' }, { slug: 'ramenskoe', name: 'раменское' },
{ slug: 'chekhov', name: 'чехов' }, { slug: 'domodedovo', name: 'домодедово' },
```

**Result**: `moCities` grows from 10 → 14 cities. This automatically generates:
- **+16 service entries** (4 cities × 4 services) in `moscowRegionEntries`
- **+16 pest entries** (4 cities × 4 tier-1 pests) in `moPestEntries`
- **Total new semantic entries: +32**

Comment on line 347 updates from "40 записей = 10 городов" → "56 записей = 14 городов", and line 372 from "40 записей" → "56 записей".

No other files need changes — routing/SSG/sitemap already include all 14 cities.

