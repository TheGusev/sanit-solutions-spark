
# Plan: Fix Canonical URLs and Yandex Indexing Issues

## Root Cause Analysis

Yandex marks all pages as "non-canonical" with canonical pointing to the homepage (`https://goruslugimsk.ru/`) for two reasons:

1. **Static HTML files redirect to SPA**: All 23 static HTML files in `public/` contain `window.location.replace('/path')` which redirects Yandex's JS-capable crawler to the SPA shell. The SPA shell (`index.html`) has `<link rel="canonical" href="https://goruslugimsk.ru/">` -- pointing to the homepage. Yandex follows the JS redirect and sees the homepage canonical.

2. **Missing trailing slashes in React canonical tags**: 10 page components set canonical URLs WITHOUT trailing slash, which conflicts with the directory-based URL structure (`/path/index.html` = `/path/`).

## Changes Required

### Part 1: Remove JS redirects from static HTML files (10 files)

Remove the `window.location.replace()` script from ALL static HTML files in `public/`. These files already have correct SEO metadata -- the redirect destroys it for JS-capable crawlers.

Files to fix:
- `public/blog/index.html`
- `public/blog/borba-s-tarakanami/index.html`
- `public/blog/dezinfekciya-ofisa/index.html`
- `public/blog/gryzuny-v-dome/index.html`
- `public/blog/kak-podgotovit-pomeshchenie/index.html`
- `public/blog/klopy-v-kvartire/index.html`
- `public/blog/ozonirovaniye-pomeshcheniy/index.html`
- `public/blog/sezonnost-vreditelej/index.html`
- `public/blog/vidy-dezinfekcii/index.html`
- `public/contacts/index.html`
- `public/privacy/index.html`
- `public/terms/index.html`
- `public/uslugi/dezinfekciya/index.html`
- `public/uslugi/dezinsekciya/index.html`
- `public/uslugi/deratizaciya/index.html`
- `public/uslugi/dezodoraciya/index.html`
- `public/uslugi/ozonirovanie/index.html`
- `public/uslugi/sertifikaciya/index.html`
- `public/uslugi/po-okrugam-moskvy/index.html`
- `public/uslugi/dezinfekciya-cao/index.html` (and all 9 district files)

In each file, remove the entire `<script>` block containing `window.location.replace(...)`.

### Part 2: Add trailing slash to all React canonical URLs (10 files)

| File | Current canonical | Fixed canonical |
|------|------------------|----------------|
| `src/pages/Blog.tsx` | `/blog` | `/blog/` |
| `src/pages/BlogPost.tsx` | `/blog/${slug}` | `/blog/${slug}/` |
| `src/pages/Privacy.tsx` | `/privacy` | `/privacy/` |
| `src/pages/Terms.tsx` | `/terms` | `/terms/` |
| `src/pages/Contacts.tsx` | `/contacts` | `/contacts/` |
| `src/pages/DistrictsOverview.tsx` | `/uslugi/po-okrugam-moskvy` | `/uslugi/po-okrugam-moskvy/` |
| `src/pages/NeighborhoodsOverview.tsx` | `/rajony` | `/rajony/` |
| `src/pages/NeighborhoodPage.tsx` | `/rajony/${slug}` | `/rajony/${slug}/` |
| `src/pages/DistrictPage.tsx` | `/uslugi/${district.slug}` | `/uslugi/${district.slug}/` |
| `src/pages/ServiceSubpage.tsx` | `${subpage.fullPath}` | `${subpage.fullPath}/` (with normalization) |

Also fix `hrefLang` and `og:url` tags in the same files to match the trailing-slash canonical.

### Part 3: Verify robots.txt and admin noindex

- `robots.txt` already correctly allows `/blog/` and `/uslugi/` -- no changes needed
- `/admin` pages are correctly blocked in `robots.txt` (Disallow: /admin/) -- no changes needed
- Confirm no `noindex` tags on public pages -- they already use `index, follow`

## Full URL List for Resubmission in Yandex Webmaster

After publishing, request recrawl for ALL of these URLs:

**Main pages:**
- `https://goruslugimsk.ru/`
- `https://goruslugimsk.ru/contacts/`
- `https://goruslugimsk.ru/blog/`
- `https://goruslugimsk.ru/privacy/`
- `https://goruslugimsk.ru/terms/`
- `https://goruslugimsk.ru/rajony/`
- `https://goruslugimsk.ru/moscow-oblast/`

**Services (6):**
- `https://goruslugimsk.ru/uslugi/dezinfekciya/`
- `https://goruslugimsk.ru/uslugi/dezinsekciya/`
- `https://goruslugimsk.ru/uslugi/deratizaciya/`
- `https://goruslugimsk.ru/uslugi/ozonirovanie/`
- `https://goruslugimsk.ru/uslugi/dezodoraciya/`
- `https://goruslugimsk.ru/uslugi/sertifikaciya/`
- `https://goruslugimsk.ru/uslugi/po-okrugam-moskvy/`

**Districts (9):**
- `https://goruslugimsk.ru/uslugi/dezinfekciya-cao/`
- `https://goruslugimsk.ru/uslugi/dezinfekciya-sao/`
- `https://goruslugimsk.ru/uslugi/dezinfekciya-svao/`
- `https://goruslugimsk.ru/uslugi/dezinfekciya-szao/`
- `https://goruslugimsk.ru/uslugi/dezinfekciya-vao/`
- `https://goruslugimsk.ru/uslugi/dezinfekciya-yao/`
- `https://goruslugimsk.ru/uslugi/dezinfekciya-yuvao/`
- `https://goruslugimsk.ru/uslugi/dezinfekciya-yzao/`
- `https://goruslugimsk.ru/uslugi/dezinfekciya-zao/`

**Blog articles (8):**
- `https://goruslugimsk.ru/blog/borba-s-tarakanami/`
- `https://goruslugimsk.ru/blog/dezinfekciya-ofisa/`
- `https://goruslugimsk.ru/blog/gryzuny-v-dome/`
- `https://goruslugimsk.ru/blog/kak-podgotovit-pomeshchenie/`
- `https://goruslugimsk.ru/blog/klopy-v-kvartire/`
- `https://goruslugimsk.ru/blog/ozonirovaniye-pomeshcheniy/`
- `https://goruslugimsk.ru/blog/sezonnost-vreditelej/`
- `https://goruslugimsk.ru/blog/vidy-dezinfekcii/`

**Excluded pages from screenshots (also request recrawl):**
- `https://goruslugimsk.ru/rajony/voykovskiy/`
- `https://goruslugimsk.ru/uslugi/dezinsekciya/kvartir/`
- `https://goruslugimsk.ru/uslugi/deratizaciya/krysy/`
- `https://goruslugimsk.ru/uslugi/dezinsekciya/ofis/`
- `https://goruslugimsk.ru/uslugi/deratizaciya/`

**Total: ~37 URLs for priority recrawl**

## Technical Details

### Why Yandex chose homepage as canonical

```text
User visits /uslugi/dezinsekciya/
  -> static HTML has correct canonical (/uslugi/dezinsekciya/)
  -> BUT script executes: window.location.replace('/uslugi/dezinsekciya')
  -> Browser navigates to /uslugi/dezinsekciya (no trailing slash)
  -> SPA shell (index.html) loads with canonical = https://goruslugimsk.ru/
  -> Yandex sees FINAL canonical = homepage
  -> Marks original page as non-canonical
```

### Fix removes the redirect chain

```text
User visits /uslugi/dezinsekciya/
  -> static HTML with correct canonical (/uslugi/dezinsekciya/) 
  -> NO redirect
  -> Yandex indexes correct canonical
```

### Estimated timeline for re-indexing
- After publishing: request recrawl in Yandex Webmaster
- Yandex typically re-indexes within 3-7 days for active sites
- Full re-indexing of all pages: 2-4 weeks
