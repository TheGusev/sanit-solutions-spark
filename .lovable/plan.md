

## Plan: 3 UI/Content Fixes

### Task 1: Fix FAQ declension (grammar)

**Problem**: `genFAQ()` in `src/data/neighborhoods.ts` uses `prepositional` (e.g., "в Савёловском районе") for all FAQ questions. But verbs like "приедете" require accusative case ("в Савёловский район"), not prepositional.

**Solution**: Rewrite FAQ questions to work naturally with the prepositional case that's already stored, instead of adding a new accusative field to 130+ neighborhoods. Change:

```
"Как быстро вы приедете в Савёловском районе?" →
"Время прибытия мастера в Савёловском районе?"

"Сколько стоит дезинфекция в Савёловском районе?" → OK as-is ✅

"Есть ли доплата за выезд в Савёловском районе?" →  
"Есть ли доплата за выезд в Савёловском районе?" → OK as-is ✅

"Какие услуги вы оказываете в Савёловском районе?" → OK ✅

"Даёте ли вы гарантию на работы в Савёловском районе?" → OK ✅
```

Only question 1 has a grammar error. Also fix the answer for question 1. Similarly fix `generateFAQ()` in `src/lib/contentGenerator.ts` (line 256).

**Files**: `src/data/neighborhoods.ts` (genFAQ, line 54-55), `src/lib/contentGenerator.ts` (line 252-257)

---

### Task 2: Improve text contrast

**Problem**: `--muted-foreground` is too washed out — `215 16% 47%` in light mode and `240 5% 65%` in dark mode. Body text using `text-muted-foreground` looks disabled.

**Solution**: Bump contrast in `src/index.css`:
- Light mode: `--muted-foreground: 215 20% 35%` (was 47% lightness → 35%)
- Dark mode: `--muted-foreground: 240 5% 75%` (was 65% → 75%)

This fixes all paragraphs site-wide since they use the CSS variable. No component changes needed.

**File**: `src/index.css` (lines 34, 85)

---

### Task 3: Add tricolor underline to missing sections

**Problem**: The tricolor underline is already in `SectionHeading` component and CSS. But the Quiz (`ServiceQuiz.tsx`) and some inline headings don't use it.

**Solution**: Add the tricolor underline div after the heading in `ServiceQuiz.tsx` (line 143, after the h2). The `SectionHeading` component already includes it, so all 300+ usages are covered. Only standalone h2 headings need the manual addition.

**File**: `src/components/ServiceQuiz.tsx` (after line 143)

---

### Summary of changes
| File | Change |
|---|---|
| `src/data/neighborhoods.ts` line 54-55 | Reword question 1 to avoid accusative |
| `src/lib/contentGenerator.ts` lines 252-257 | Same fix for NchPage FAQ |
| `src/index.css` lines 34, 85 | Darken/lighten muted-foreground |
| `src/components/ServiceQuiz.tsx` line 143 | Add tricolor underline after h2 |

Total: 4 files, minimal changes, zero risk to routing or functionality.

