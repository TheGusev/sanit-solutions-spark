

## Plan: Dark Theme Sort Controls

### Change
Update sort control container (line 186) and inactive pill styles (line 196) to use the same elevated dark surface as folders and article cards.

**Container** (line 186): Add `dark:bg-[hsl(240,10%,16%)] dark:border dark:border-border/50`

**Inactive pills** (line 196): Add `dark:hover:bg-white/5` for subtle hover feedback on dark backgrounds

### File
`src/pages/Blog.tsx` — lines 186 and 196, class additions only

