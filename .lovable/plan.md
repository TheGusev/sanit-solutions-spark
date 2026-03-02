

## Problem

Build #443 fails because the SSG fail-fast guard correctly detects that critical pages are missing and throws an error. But the `throw` also crashes the **Lovable preview build**, which doesn't need SSG at all (preview serves as SPA).

Two distinct issues need fixing:

### Issue 1: `replaceHeadTags` line 483 still uses the old regex

```js
html = html.replace(/<title>.*?<\/title>/, helmet.title);
```

After the first page is processed, `helmet.title` outputs `<title data-rh="true">...</title>`. On the next page, the regex `/<title>.*?<\/title>/` won't match because the title tag now has attributes. This means head replacement silently fails for subsequent pages.

### Issue 2: SSG `throw` crashes Lovable preview builds

The `throw error` at line 875 crashes any production build, including Lovable's own build where SSG is not expected to work (no proper SSR environment). SSG should only hard-fail in CI (Docker/GitHub Actions), not in Lovable preview.

## Fix Plan (2 changes, same file)

**1. `vite-plugin-ssg.ts` line 483 — Fix `replaceHeadTags` title regex**

```
- html = html.replace(/<title>.*?<\/title>/, helmet.title);
+ html = html.replace(/<title[^>]*>.*?<\/title>/, helmet.title);
```

**2. `vite-plugin-ssg.ts` lines 858-875 — Only throw in CI environments**

Wrap the critical-pages guard and re-throw in a `process.env.CI || process.env.GITHUB_ACTIONS` check. In non-CI (Lovable preview), log a warning instead of crashing the build.

```js
const isCI = process.env.CI || process.env.GITHUB_ACTIONS;

// Critical pages guard
const criticalPages = [...];
const missingCritical = criticalPages.filter(...);
if (missingCritical.length > 0) {
  const msg = `SSG CRITICAL: Missing critical pages:\n${...}`;
  if (isCI) throw new Error(msg);
  else console.warn(msg);
}

if (successCount === 0) {
  const msg = 'SSG CRITICAL: Zero pages were generated.';
  if (isCI) throw new Error(msg);
  else console.warn(msg);
}

// catch block: only re-throw in CI
} catch (error) {
  console.error('❌ SSG prerendering failed:', error);
  if (isCI) throw error;
}
```

This way:
- **Lovable preview**: SSG is best-effort, build succeeds even if SSG fails
- **Docker CI (GitHub Actions)**: build fails red if critical pages are missing

