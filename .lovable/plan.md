

## Plan: Add rotating images to "Почему мы" section

### What changes

The "Почему мы" section currently has a single static image (`/images/work/office-cleaning.png`). Add the uploaded photo as a second image and implement crossfade rotation (every 6 seconds), matching the Hero section's pattern.

### Steps

1. **Copy uploaded image** to `public/images/work/why-us-documents.jpg`

2. **Update `src/components/WhyUsExtended.tsx`**:
   - Add a `useState` + `useEffect` timer for image index rotation (same pattern as Hero)
   - Define an array of 2 images: existing `office-cleaning.png` + new `why-us-documents.jpg`
   - Render both `<img>` tags stacked with `absolute inset-0`, toggling opacity via the index state
   - Crossfade with `transition-opacity duration-1000`

