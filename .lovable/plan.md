

## Plan: Add dezinsekciya & deratizaciya district links to ServiceDistricts and Footer

### Changes

**1. `src/components/ServiceDistricts.tsx`** — expand `adminDistricts` to include all 3 services and render them as tabbed/grouped rows:
- Replace the single `adminDistricts` array with 3 service groups (dezinfekciya, dezinsekciya, deratizaciya)
- Each okrug card shows 3 links (one per service) or use a tabbed UI with 3 tabs: Дезинфекция / Дезинсекция / Дератизация
- Each tab renders the same 9 okrug grid but with service-specific slugs

**2. `src/components/Footer.tsx`** — add a compact "По округам" subsection under the existing "Информация" column with links to the 3 overview-style district pages:
- Add 2 new links after the existing "По округам Москвы" link:
  - `• Дезинсекция по округам` → `/uslugi/po-okrugam-moskvy` (same page, or we add anchors)
  - Actually simpler: add direct links to a few key district pages for dezinsekciya and deratizaciya (e.g., dezinsekciya-cao, deratizaciya-cao) in the existing footer structure

### Refined approach

Keep it simple — two changes:

**1. `src/components/ServiceDistricts.tsx`** — add Tabs (Дезинфекция / Дезинсекция / Дератизация) above the admin districts grid. Each tab shows the same 9 okrugs with appropriate service prefix in the URL. Use shadcn Tabs component.

**2. `src/components/Footer.tsx`** — under "По округам Москвы" add two new lines:
```
• Дезинсекция по округам → /uslugi/dezinsekciya-cao
• Дератизация по округам → /uslugi/deratizaciya-cao
```

### Technical details
- `ServiceDistricts.tsx`: Extract okrug IDs (`cao`, `sao`, etc.) and generate slugs dynamically: `${service}-${id}`
- Tabs component from `@/components/ui/tabs`
- No new data files needed

