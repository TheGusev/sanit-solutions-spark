

User wants to push 24 mole URLs to IndexNow for fast reindexing after content expansion. Let me check the existing IndexNow infrastructure.

Existing setup (from memory + files):
- `scripts/send-indexnow-stateless.mjs` — daily batch of 50 URLs to Yandex only
- `.github/workflows/daily-indexnow.yml` — runs daily at 03:00 UTC
- Key: `goruslugimsk-2026-indexnow`, host: `goruslugimsk.ru`
- IndexNow protocol: submitting to one endpoint (Yandex OR Bing) propagates to all participating engines

Current daily script targets Yandex only — but per IndexNow protocol that's enough (Bing/Yandex share submissions). However, for redundancy and faster Bing pickup, sending to both endpoints is best practice.

This is a one-shot manual push, not a recurring job. Best approach: create a focused one-off script that sends exactly the 24 mole URLs to both Yandex and Bing IndexNow endpoints, run it once, report results.

# IndexNow Push — 24 Mole URLs

## What I'll do

Create a one-off script `scripts/push-mole-indexnow.mjs` that:
1. Generates the exact 24 mole URLs (23 existing + Khimki) using the canonical pattern `https://goruslugimsk.ru/uslugi/borba-s-krotami/{slug}/`
2. Sends the batch to **both** IndexNow endpoints in parallel:
   - `https://yandex.com/indexnow` (Yandex)
   - `https://api.indexnow.org/indexnow` (generic — propagates to Bing + others)
3. Uses existing key `goruslugimsk-2026-indexnow` and keyLocation `https://goruslugimsk.ru/goruslugimsk-2026-indexnow.txt`
4. Reports HTTP status from each endpoint with full response bodies

## URL list (24 total)

Pulled from `src/data/moleCities.ts` slugs:
```
istra, dmitrov-mo, dubna-mo, klin, naro-fominsk, sergiev-posad,
chekhov, stupino, kashira, voskresensk, egoryevsk, pavlovskij-posad,
orekhovo-zuevo, schyolkovo, balashikha, krasnogorsk, odintsovo,
podolsk, ramenskoe, mytishchi, lyubertsy, korolev, dolgoprudny,
khimki
```

All resolve to canonical `/uslugi/borba-s-krotami/{slug}/` (trailing slash, per policy).

## Execution

- Run script via `node scripts/push-mole-indexnow.mjs`
- Both endpoints called in parallel
- Expected: HTTP 200 or 202 from both
- Failure modes handled: network error, 4xx (key validation), 5xx (endpoint down)

## What I won't touch

- Daily IndexNow workflow (`daily-indexnow.yml`) — independent, keeps running
- Stateless daily script — unchanged
- Sitemap, routing, SSG pipeline
- Memory standards (per `mem://infrastructure/indexnow-stateless-automation`)

## Deliverable

Single execution + report: per-endpoint status, accepted URL count, any errors. No recurring change to the project.

