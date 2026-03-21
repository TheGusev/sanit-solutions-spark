

## Plan: Add district geo-links to InternalLinks + verify ServiceDistricts tabs

### Changes

**1. `src/components/InternalLinks.tsx`** — add a new section (between main services and MO cities) generating links to service-district geo-pages:

After section 3 (main services), add section 3.5: "Услуги по округам" (2-3 links):
- When `currentService` is set, link to geo-pages of **other** services for a relevant okrug (e.g., on dezinsekciya page → link to `dezinfekciya-cao`, `deratizaciya-cao`)
- When on a district page (we can detect via a new optional `currentDistrict` prop), link to same-district pages for other services
- Use okrug IDs: `cao`, `sao`, `yao`, `vao` etc.
- Link text: "Дезинсекция в ЦАО", "Дератизация в САО"

Add new `InternalLink` type value: `'district'`

**2. Verify tabs** — I'll check the ServiceDistricts component in the preview to confirm tabs work correctly.

### Technical details

New prop `currentDistrict?: string` on `InternalLinksProps`. New link generation block:

```ts
// 3.5 Услуги по округам (2-3 ссылки)
const okrugIds = ['cao', 'sao', 'svao', 'vao', 'yuvao', 'yao', 'yzao', 'zao', 'szao'];
const services = ['dezinfekciya', 'dezinsekciya', 'deratizaciya'];
const serviceNames = { dezinfekciya: 'Дезинфекция', dezinsekciya: 'Дезинсекция', deratizaciya: 'Дератизация' };
const okrugNames = { cao: 'ЦАО', sao: 'САО', ... };

// Link to other services in same/random okrug
services.filter(s => s !== currentService).slice(0, 2).forEach(s => {
  const okrug = currentDistrict || okrugIds[Math.floor(...)]; // deterministic pick
  links.push({ url: `/uslugi/${s}-${okrug}`, text: `${serviceNames[s]} в ${okrugNames[okrug]}`, type: 'district' });
});
```

