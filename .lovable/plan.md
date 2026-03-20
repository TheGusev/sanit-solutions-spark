

## Plan: Folder-Style Category Cards — Matching iPhone Reference

### Approach
The reference shows **skeuomorphic folder cards** with a distinctive "tab" on the top-left corner, dark elevated backgrounds, and a blue glow on the active folder. The current implementation uses flat `bg-card` buttons — no folder shape, no depth.

To achieve the folder look with pure CSS (no images), each category button gets:
1. **A folder "tab"** — a `::before` pseudo-element positioned at top-left, smaller width, slightly different background, rounded top corners — simulating the classic folder tab
2. **Elevated dark surface** — in dark mode: `bg-[hsl(240,10%,16%)]` (lighter than page bg `8%`); in light mode: `bg-card` with a subtle inner shadow
3. **Active state glow** — `box-shadow: 0 0 20px hsl(primary/0.4)` + `bg-primary` fill
4. **Soft inner shadow** for depth — `shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`

Since Tailwind alone can't do `::before` pseudo-elements inline, I'll add a small CSS class `.folder-card` in `index.css` with the tab shape, then apply Tailwind utilities for colors/states.

### File Changes

#### 1. `src/index.css` — Add `.folder-card` styles (~20 lines)
```css
.folder-card {
  position: relative;
  border-radius: 0 0.75rem 0.75rem 0.75rem;
  padding-top: 1.25rem;
}
.folder-card::before {
  content: '';
  position: absolute;
  top: -0.5rem;
  left: 0;
  width: 45%;
  height: 0.5rem;
  border-radius: 0.5rem 0.5rem 0 0;
  background: inherit;
  border: inherit;
  border-bottom: none;
}
```
Plus dark/light variants for the tab highlight, active glow, and hover states.

#### 2. `src/pages/Blog.tsx` — Update category button markup
- Add `folder-card` class to each button
- Active: `bg-primary` + glow shadow + bright text
- Inactive dark: elevated dark surface (`bg-muted/60` or custom), subtle border
- Inactive light: soft card surface with border
- Keep all existing logic: `role="tablist"`, `aria-selected`, `onClick`, icon mapping, counts

Article cards and sort controls remain as-is (already clean from previous refactor).

### What stays untouched
- All SEO (Helmet, StructuredData, canonical, OG)
- Routing (`Link to="/blog/${post.slug}"`)
- Data contracts (`allBlogArticles`, `blogCategories`)
- Filter/sort logic (`useMemo`, `selectedCategory`, `sortBy`)
- Breadcrumbs, Header, Footer, CTA, load-more button
- Article card markup and sort pill controls

