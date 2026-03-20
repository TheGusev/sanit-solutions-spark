

## Verification of Screenshot Issues

### Screenshot 1: LLM Visibility Recommendations
- **robots.txt configured correctly** ✅ Confirmed — `robots.txt` allows GPTBot, PerplexityBot, ClaudeBot, Google-Extended, YandexBot
- **"Add llms.txt file"** ✅ TRUE — no `llms.txt` exists in the project. This file helps LLM crawlers understand site structure

### Screenshot 2: Geo-Service Pages by Districts — Only Dezinfekciya
✅ TRUE — `districtPages.ts` has slugs like `dezinfekciya-cao`, `dezinfekciya-sao`, etc. These are **only for dezinfekciya**. There are no `dezinsekciya-cao` or `deratizaciya-cao` equivalents. The pages at `/uslugi/dezinfekciya-[district]` cover only one service type.

However, these pages do mention "дезинсекция и дератизация" in their description text (line 43), so they function as multi-service geo hubs despite the URL suggesting dezinfekciya-only. This is a minor inconsistency but not critically broken — the `/rajony/` pages are the real geo hubs per project policy.

### Screenshot 3: Weak Zones

| Issue | Status | Details |
|---|---|---|
| **MO cities (Klin, Ramenskoe, Chekhov, Domodedovo)** | ✅ TRUE | These 4 cities exist in `moscowRegion.ts` and `semanticCore.ts` but have no pest×city NCH pages |
| **Hostel — no landing page** | ✅ TRUE | Object `hostela` exists in `objects.ts` and SSG generates `/uslugi/dezinsekciya/hostela/` etc., but there's no dedicated `/uslugi/dezinsekciya/v-hostele/` page with FAQ/pricing block. The current object pages are template-based without custom content |
| **B2B queries** | ✅ TRUE | Only 5 B2B blog articles exist. No systematic commercial landing pages for B2B queries like "журнал дератизации", "договор на дезинсекцию для общепита" |
| **PageSpeed Mobile 88** | ✅ TRUE | Confirmed in project data, target is 90+ for Yandex top positions |

---

## Plan: Fix All Three Issues

### 1. Create `public/llms.txt` (new file)
Standard LLM-readable site description file following the emerging `llms.txt` convention:
- Site name, purpose, primary services
- Key URLs for LLM context (homepage, services, blog, contacts)
- Structured summary of what the site offers
- Link to sitemap for full page discovery

### 2. Create `public/.well-known/llms.txt` (symlink/copy)
Some crawlers look for it at `/.well-known/llms.txt` — add there too.

### 3. No code changes needed for items 2-3
The district pages (screenshot 2) and weak zones (screenshot 3) are **confirmed gaps** but fixing them requires creating new pages/content, which is a separate task from verification. The user asked to "check the information from screenshots" — all three are verified as accurate.

### Summary
One new file: `public/llms.txt` to address the LLM visibility recommendation. All other issues from the screenshots are confirmed as real gaps in the project.

