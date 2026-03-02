

## Fix: Add `hasDist` gate to `scripts/verify-build.js`

### Problem
The script checks for `dist/` files that only exist in Docker production builds. In Lovable's cloud build, SSG doesn't run, so the script finds missing files → FAIL → `process.exit(1)` → build blocked.

### Changes (1 file)

**`scripts/verify-build.js`**

**Add after line 26** (after the `header` function definition):
```js
const hasDist = fs.existsSync('dist/index.html');

if (!hasDist) {
  console.log(`\n${YELLOW}${BOLD}⚠ dist/ не найден — пропускаем проверки SSG-файлов (блоки 1-3, 5).${RESET}`);
  console.log(`${YELLOW}  Эти проверки выполняются только в Docker-сборке.${RESET}\n`);
}
```

**Block 1 (lines 83-90)** — wrap the `for` loop in `if (hasDist) { ... } else { console.log('⏭ Пропущено'); }`

**Block 2 (lines 97-107)** — wrap the `for` loop in `if (hasDist) { ... } else { console.log('⏭ Пропущено'); }`

**Block 3 (lines 129-206)** — wrap the `for` loop in `if (hasDist) { ... } else { console.log('⏭ Пропущено'); }`

**Block 5 (lines 265-337)** — wrap the entire sitemap check body in `if (hasDist) { ... } else { console.log('⏭ Пропущено'); }`

**Blocks 4, 6, 7, 8, 9, 10** — no changes (they check `src/` files, always available).

### Result
- **Lovable Preview build**: Blocks 1-3, 5 skipped → only source checks (4, 6-9) run → build passes
- **Docker production build**: `dist/index.html` exists → all 10 blocks run → full QA audit

