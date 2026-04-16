

# Phase 4 — Thin-Risk Batch: Exact Change Plan

## Current State

| Город | Distance | cityTier | methodNotes | FAQ count | Distance FAQ? |
|-------|----------|----------|-------------|-----------|---------------|
| Можайск (90 км) | 90 км | ✅ thin | ✅ | 3 | ✅ «Выезжаете ли за 80 км?» |
| Талдом (110 км) | 110 км | ✅ thin | ❌ missing | 3 | ✅ «Выезжаете ли в Талдом?» |
| Дубна (120 км) | 120 км | ✅ thin | ❌ missing | 3 | ✅ «Далеко ли ехать?» |
| Руза (80 км) | 80 км | ✅ thin | ❌ missing | 3 | ✅ implicit in FAQ |
| Воскресенск (80 км) | 80 км | ✅ thin | ✅ | 3 | ✅ «Выезжаете ли?» |

All 5 cities already have `cityTier: 'thin'`. Per the plan rules, thin-tier cities get `methodNotes` only (no `objectContext`, no extra FAQ beyond what exists).

## Remaining Work — Data Only (`src/data/moleCities.ts`)

**Three cities need `methodNotes` added: Талдом, Дубна, Руза.**

### Талдом — add `methodNotes` (after line 423, `cityTier: 'thin'`):
```
methodNotes: 'Торфяно-болотистая почва поглощает газ быстрее — увеличиваем концентрацию и дополняем механическими кротоловками на активных выходах.',
```

### Дубна — add `methodNotes` (after line 440, `cityTier: 'thin'`):
```
methodNotes: 'Аллювиальная супесь пропускает газ — акцент на кротоловки в активных тоннелях и барьерную защиту по границе участка.',
```

### Руза — add `methodNotes` (after line 458, `cityTier: 'thin'`):
```
methodNotes: 'Лесной суглинок с высоким гумусом привлекает червей — кроты особенно активны, применяем комплекс газации и усиленного барьера.',
```

## What Changes
- 1 file: `src/data/moleCities.ts`
- 3 cities get `methodNotes` (1 sentence each)
- 2 remaining thin cities (Можайск, Воскресенск): NO CHANGE (already have `methodNotes`)

## What Does NOT Change
- URL, slug, canonical, indexability, sitemap — untouched
- Template (`MoleCityPage.tsx`) — no changes (conditional rendering already works)
- H1, title, description — untouched
- relatedCities topology — untouched
- FAQ arrays — untouched (no additions for thin tier)
- No new routes, pages, or service entities

## Why Safe
- Only 3 `methodNotes` additions to existing data entries
- Each note is factual, tied to the city's `soilType` field
- Template already renders `methodNotes` conditionally (Phase 1)
- No content inflation — thin cities stay minimal by design
- Differentiation from generic template by adding soil-specific method rationale

## Post-Phase 4 Status: All 23 Mole Cities Complete

After this phase, every mole city will have:
- ✅ `cityTier` assigned
- ✅ `methodNotes` with soil-specific method rationale
- ✅ Distance FAQ for cities >50 km
- ✅ `objectContext` for premium and strong tiers
- ✅ 4+ FAQ for premium/strong/mid tiers

