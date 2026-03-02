

## Verification Result: /terms noindex

**Status: ✅ Correct** — The `/terms` page has `noindex, follow` in its meta robots tag and is correctly excluded from the sitemap.

## Side Issue Found: /privacy in sitemap

The `/privacy` page also has `noindex, follow` but **is included** in the sitemap (`vite-plugin-sitemap.ts` line 53). This sends conflicting signals to search engines — "don't index this page" vs "here's a page worth crawling."

### Fix

Remove `/privacy/` from the `staticUrls` array in `vite-plugin-sitemap.ts` (line 53):

```typescript
// DELETE this line:
{ loc: '/privacy/', lastmod: '', changefreq: 'yearly', priority: '0.2' },
```

No other changes needed. The `/terms` configuration is already correct everywhere.

