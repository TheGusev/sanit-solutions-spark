

## 3-Way Route Sync Audit

### Comparison Results

| Route | App.tsx | AppSSR.tsx | seoRoutes.ts |
|-------|---------|------------|-------------|
| `/` | ✓ | ✓ | ✓ |
| `/blog` | ✓ | ✓ | ✓ |
| `/blog/:slug` | ✓ | ✓ | ✓ (227 slugs) |
| `/privacy` | ✓ | ✓ | ✓ |
| `/terms` | ✓ | ✓ | **MISSING** |
| `/team` | ✓ | ✓ | **MISSING** |
| `/contacts` | ✓ | ✓ | ✓ |
| `/sluzhba-dezinsekcii` | ✓ | ✓ | ✓ |
| `/otzyvy` | ✓ | ✓ | ✓ |
| `/uslugi/po-okrugam-moskvy` | ✓ | ✓ | ✓ |
| `/uslugi/:slug` (services) | ✓ | ✓ | ✓ (7 slugs) |
| `/uslugi/:p/:s` (subpages) | ✓ | ✓ | ✓ (22 combos) |
| `/uslugi/:s/:p/:n` (3-seg) | ✓ | ✓ | ✓ (~210 combos) |
| `/uslugi/obrabotka-uchastkov` | ✓ | ✓ | ✓ |
| `/uslugi/dezinfekciya-{id}` (districts) | ✓ | ✓ | ✓ (12 slugs) |
| `/rajony` | ✓ | ✓ | ✓ |
| `/rajony/:slug` | ✓ | ✓ | ✓ (130 slugs) |
| `/moscow-oblast` | ✓ | ✓ | ✓ |
| `/moscow-oblast/:city` | ✓ | ✓ | ✓ (14 cities) |
| `/moscow-oblast/:city/:svc` | ✓ | ✓ | ✓ (56 combos) |

Route ordering in AppSSR.tsx matches App.tsx — static routes before parametric. No issues there.

### Problems Found

Two public routes exist in App.tsx and AppSSR.tsx but are **not listed** in `seoRoutes.ts`. This means SSG will not generate HTML for them — they will 404 on production when accessed directly.

### Fix

Add 2 entries to the `staticRoutes` array in `src/lib/seoRoutes.ts`:

```typescript
{ path: '/terms', outputPath: 'terms/index.html', priority: '0.2', changefreq: 'yearly' },
{ path: '/team', outputPath: 'team/index.html', priority: '0.5', changefreq: 'monthly' },
```

No changes needed in App.tsx or AppSSR.tsx — they are already in sync.

