

## Plan: Global Frontend & SEO Polish — 7 Changes

### 1. Fix canonical domain in 3 pages + schema URLs

**Files:** `ServiceSESPage.tsx`, `ServiceLandingUchastkiPage.tsx`, `ReviewsPage.tsx`

Replace all `sanit-solutions-spark.lovable.app` with `goruslugimsk.ru`:
- SES: canonical + schema url (lines 22, 28)
- Uchastki: canonical (line 23)
- Reviews: canonical (line 47)

Leave `cors.ts` as-is (it correctly allows the lovable.app domain for CORS).

---

### 2. ServiceSubpage.tsx: Replace `<Helmet>` with `<SEOHead>`

Replace the direct `<Helmet>` block (lines 4, 85-94) with `<SEOHead>` component:
- Import `SEOHead` and `PageMetadata` type
- Remove `Helmet` import
- Build a `PageMetadata` object from `subpage` fields (title, description, canonical with `goruslugimsk.ru`, schema array with Service + FAQ schemas)
- Replace `<Helmet>...</Helmet>` with `<SEOHead metadata={metadata} pagePath={subpage.fullPath} />`

---

### 3. Add images to new pages

**ServiceSESPage.tsx:** Add `specialist-closeup.jpg` in hero section alongside the form:
```
<img src="/images/work/specialist-closeup.jpg" alt="Специалист службы дезинсекции в защитном костюме" ... loading="lazy" />
```

**ServiceLandingUchastkiPage.tsx:** Add `outdoor-treatment.png` image in hero:
```
<img src="/images/work/outdoor-treatment.png" alt="Обработка дачного участка от клещей и комаров" ... loading="lazy" />
```

**ServiceSubpage.tsx:** Add `fog-generator.jpg` as a visual element in the hero section with overlay.

All images: `loading="lazy"`, `decoding="async"`, explicit `width`/`height`, meaningful Russian `alt` tags.

---

### 4. Client-side "Load More" buttons

**ReviewsPage.tsx:**
- Add `visibleCount` state starting at 12
- Render `reviews.slice(0, visibleCount)` instead of all reviews
- Add "Показать ещё" button when `visibleCount < reviews.length`, incrementing by 12
- No URL changes

**Blog.tsx:**
- Add `visibleCount` state starting at 30
- Render `filteredPosts.slice(0, visibleCount)`
- Reset `visibleCount` to 30 when `selectedCategory` changes
- Add "Показать ещё" button below the grid

---

### 5. Add CalculatorModal to SES and Uchastki pages

**ServiceSESPage.tsx:**
- Import `CalculatorModal` and add `useState` for `showCalculator`
- Add "Рассчитать стоимость" button next to phone link in hero
- Add second CTA button in bottom CTA section
- Render `<CalculatorModal open={showCalculator} onOpenChange={setShowCalculator} />`

**ServiceLandingUchastkiPage.tsx:**
- Same pattern: import, state, buttons in hero + CTA, modal render

---

### 6. Remove hardcoded colors from Contacts.tsx

Replace in lines 174-175:
- `bg-[#168DE2]/10` → `bg-primary/10`
- `text-[#168DE2]` → `text-primary`

---

### 7. Build verification

After all changes, confirm TypeScript compilation succeeds with no import or type errors.

---

### Summary of files modified

| File | Changes |
|------|---------|
| `ServiceSESPage.tsx` | Fix canonical, add image, add CalculatorModal |
| `ServiceLandingUchastkiPage.tsx` | Fix canonical, add image, add CalculatorModal |
| `ReviewsPage.tsx` | Fix canonical, add "Load More" |
| `Blog.tsx` | Add "Load More" |
| `ServiceSubpage.tsx` | Replace Helmet→SEOHead, add image |
| `Contacts.tsx` | Replace hardcoded hex colors |

