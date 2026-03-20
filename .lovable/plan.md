

## Plan: Generate background images for 3 remaining service cards

### What needs to happen

Generate AI images for the 3 service cards that currently lack background images, then add them to the component.

### Cards needing images

1. **Озонирование** (Ozonation) — professional ozone treatment equipment in a room, blue-tinted atmosphere
2. **Демеркуризация** (Mercury cleanup) — hazmat suit worker with specialized equipment, clinical/safety feel
3. **Обработка участков** (Outdoor area treatment) — pest control specialist spraying an outdoor garden/yard area

### Steps

1. **Generate 3 images** using AI image generation (google/gemini-3-pro-image-preview for quality):
   - `public/images/services/ozonirovanie-bg.jpg` — ozone equipment in indoor setting
   - `public/images/services/demerkurizaciya-bg.jpg` — hazmat/mercury cleanup scene
   - `public/images/services/obrabotka-uchastkov-bg.jpg` — outdoor pest treatment

2. **Update `src/components/MiniPricing.tsx`** — add `bgImage` property to the 3 remaining service objects (lines 10, 12, 14)

### Technical detail
- Images generated at appropriate resolution for card backgrounds
- Each prompt will request a realistic, professional pest control photography style consistent with the existing uploaded photos
- Existing card rendering logic handles `bgImage` automatically — no template changes needed

