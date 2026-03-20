

## Plan: Blog Page UI/UX Refactor — "Document/Folder" Style

### What changes
**One file**: `src/pages/Blog.tsx` — pure visual refactor of the blog listing page.

BlogPost.tsx stays untouched (it already has clean editorial layout with prose styles, TOC, breadcrumbs, tricolor accent).

### Changes in Blog.tsx

#### 1. Category folder cards
- Replace emoji-based icons with Lucide icons: `FolderOpen` (Все), `ShieldCheck` (Дезинфекция), `Bug` (Дезинсекция), `Mouse` (Дератизация), `Lightbulb` (Советы), `Scale` (Законы), `FlaskConical` (Препараты), `Briefcase` (Кейсы)
- Remove `truncate` class → allow 2-line wrap with proper padding
- Active state: `bg-primary text-primary-foreground` with `shadow-md shadow-primary/20` glow
- Inactive: `bg-card border-border` with `hover:border-primary/30 hover:shadow-sm` transition
- Add `focus-visible:ring-2 focus-visible:ring-primary` for accessibility
- Grid stays `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Icon rendered as Lucide component (size 20) instead of emoji text

#### 2. Sort controls
- Wrap in a `bg-muted/30 rounded-xl p-1 inline-flex` container (segmented control look)
- Active pill: `bg-primary text-primary-foreground shadow-sm`
- Inactive pill: `text-muted-foreground hover:text-foreground`
- Remove the standalone `ArrowDownWideNarrow` icon — clean segmented look

#### 3. Article cards — "document" style
- Add subtle left border accent: `border-l-2 border-l-primary/20` on hover → `border-l-primary`
- Keep existing structure (category chip, clock, title, excerpt)
- Add `transition-all duration-200` for smooth hover
- Hover: `hover:shadow-md hover:border-border/80 hover:-translate-y-0.5`
- Category chip: keep `bg-primary/10 text-primary` (already good)
- Excerpt: keep `line-clamp-2` with `text-sm text-muted-foreground`

#### 4. Performance
- Wrap `filteredPosts` computation in `useMemo` with deps `[selectedCategory, sortBy]`
- Wrap `popularSlugs` in module-level const (it's static data)
- No new components, no extra re-renders

#### 5. Empty state
- Add a simple "Нет статей в этой категории" block if `filteredPosts.length === 0`

#### 6. Accessibility
- Add `role="tablist"` on category grid, `role="tab"` + `aria-selected` on each button
- Add `aria-label` on sort buttons

### What is preserved
- All SEO: Helmet, StructuredData, canonical, OG tags — untouched
- All routing: Link to `/blog/${post.slug}` — untouched
- All data: `allBlogArticles`, `blogCategories`, counts — untouched
- Breadcrumbs, Header, Footer, CTA section — untouched
- Load-more pagination (`visibleCount` + Button) — untouched
- Sort/filter logic — only wrapped in useMemo, logic identical

### Files
1. `src/pages/Blog.tsx` — visual refactor only

