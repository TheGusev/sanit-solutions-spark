

## Plan: Remove Duplicate Price Display on Service Landing Pages

### Problem
On service landing pages, the minimum price is shown twice — once in the tariff cards (`ServiceTariffs`) and again in a separate price block below. The screenshot shows this duplication clearly.

### Pages Affected

1. **ServicePestPage.tsx** (lines 299-321) — has a "Price Block" (`от {pest.priceFrom}₽`) right after `ServiceTariffs`. This is the main culprit visible in the screenshot. **Remove this block entirely.**

2. **ServicePage.tsx** — has `ServiceTariffs` (line 311-315) AND a detailed `Pricing Table` (lines 486-559). These are NOT duplicates — tariffs show packages (Стандарт/Премиум/VIP) while the pricing table shows detailed per-object prices. **Keep both.**

### Changes

**File: `src/pages/ServicePestPage.tsx`**
- Remove lines 299-321 (the "Price Block" section with `от {pest.priceFrom}₽`, methods badges, and "Включено: выезд, диагностика..." text)
- This eliminates the duplicate since `ServiceTariffs` already displays pricing with more detail

One file, one deletion. The tariff cards remain as the single source of pricing info on pest pages.

