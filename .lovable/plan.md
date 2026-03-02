

## Plan: Create `scripts/verify-build.js` Build Verification Script

### What will be created

**One new file:** `scripts/verify-build.js` — a pure Node.js script (no dependencies) that runs 10 verification blocks after each build.

**One edit:** `package.json` — update `build` script to chain verification, add `verify` script.

### Block-by-block implementation

**Block 1 — File existence:** Check 35+ critical paths via `fs.existsSync`. Any miss = FAIL + exit(1).

**Block 2 — File size:** Each HTML from Block 1 checked via `fs.statSync`. Below 15KB = FAIL, below 5KB = CRITICAL.

**Block 3 — SEO audit:** Read each HTML, regex-check for `<title>`, `<meta name="description"`, `<link rel="canonical"`, single `<h1>`, `window.ym`, `schema.org`. Also check for forbidden strings (`undefined`, `lovable.app`, `localhost`, bad grammar, old guarantee text, dev artifacts).

**Block 4 — Metrika & goals:** Read source files `src/lib/analytics.ts`, `src/components/ServiceQuiz.tsx`, `src/components/LeadFormModal.tsx` and verify presence of `getYmGoalPrefix`, counter ID constant, `calc_lead_`, `quiz_lead_`, `sticky_quiz_lead_`, `quiz_source` sessionStorage check. No `lead_all` check (it doesn't exist in current code — will skip that sub-check).

**Block 5 — Sitemap:** Check `dist/sitemap-index.xml` existence, count `<sitemap>` tags (min 5 sub-sitemaps). Also check individual sitemap files for `<url>` count (min 700 total). Verify no `lovable.app`/`localhost`, verify critical URLs present.

**Block 6 — Robots.txt:** Check `dist/robots.txt`, verify `Sitemap:` line with correct domain, no full `Disallow: /` for `*`, has `Disallow: /admin/`.

**Block 7 — Internal links:** Read `src/components/Footer.tsx`, check for `/otzyvy`, `/sluzhba-dezinsekcii`, `/uslugi/obrabotka-uchastkov` links. Read `src/components/InternalLinks.tsx`, verify it generates related links.

**Block 8 — Code security:** Recursive scan of `src/` for `debugger` (FAIL), API key patterns (CRITICAL), `console.log`/`TODO`/`FIXME` (WARN).

**Block 9 — Image accessibility:** Scan `.tsx` files in `src/pages/` for `<img` tags without `alt=` (FAIL) or `loading=` (WARN).

**Block 10 — Summary:** Print totals, exit(1) if any FAIL/CRITICAL.

### package.json changes

```json
"verify": "node scripts/verify-build.js",
"build": "vite build && node scripts/verify-build.js"
```

### Technical notes

- Script uses only `fs`, `path` — zero external deps
- All checks are synchronous for simplicity
- Output format: colored terminal output with PASS/FAIL/WARN per check
- The sitemap plugin generates `sitemap-index.xml` (not `sitemap.xml`), so Block 5 accounts for that
- `lead_all` goal doesn't exist in current code — Block 4 will not check for it to avoid false negatives
- Canonical check uses regex to extract href and verify `https://goruslugimsk.ru` prefix

