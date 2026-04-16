

# Phase 3 — Mid-Market Batch: Exact Change Plan

## Current State

| Город | cityTier | methodNotes | FAQ count | Distance FAQ? |
|-------|----------|-------------|-----------|---------------|
| Дмитров (65 км) | ✅ mid | ✅ | 3 | ✅ «Выезжаете ли в Дмитров?» |
| Яхрома (55 км) | ✅ mid | ✅ | 3 | ❌ missing |
| Чехов (52 км) | ✅ mid | ✅ | 3 | ✅ «Выезжаете ли в Чехов?» |
| Серпухов (73 км) | ✅ mid | ✅ | 4 ✅ | ✅ «Далеко ли ехать?» |
| Наро-Фоминск (50 км) | ✅ mid | ✅ | 3 | ✅ «Обслуживаете ли район?» |
| Клин (65 км) | ✅ mid | ✅ | 3 | ❌ missing |
| Солнечногорск (44 км) | ✅ mid | ✅ | 3 | N/A (<50 км) |

All 7 cities already have `cityTier: 'mid'` and `methodNotes` from Phase 1. No `objectContext` needed for mid-tier per plan rules.

## Remaining Work — Data Only (`src/data/moleCities.ts`)

Per plan rules: +0-1 FAQ only for cities >50 km without a distance/travel FAQ.

**Two cities qualify: Яхрома and Клин.**

### Яхрома — add 4th FAQ (line ~269, append to faq array):
```
{ question: 'Как долго ехать до Яхромы?', answer: 'Около 55 км от МКАД, приезжаем за 1 час. Выезд бесплатный при заказе обработки.' }
```
Intent: расстояние, барьер выезда.

### Клин — add 4th FAQ (line ~362, append to faq array):
```
{ question: 'Выезжаете ли в Клин (65 км)?', answer: 'Да, Клин в зоне обслуживания по Ленинградскому шоссе. Выезд бесплатный, приезжаем в день обращения.' }
```
Intent: расстояние, барьер выезда.

## What Changes
- 1 file: `src/data/moleCities.ts`
- 2 cities get +1 FAQ (total: 4 each)
- 5 remaining mid-market cities: NO CHANGE (already complete)

## What Does NOT Change
- URL, slug, canonical, indexability, sitemap — untouched
- Template (`MoleCityPage.tsx`) — no changes
- H1, title, description — untouched
- relatedCities topology — untouched
- No new routes, pages, or service entities
- Можайск (thin) — not in this phase

## Why Safe
- Only 2 FAQ additions to existing arrays
- Questions address real user concern (distance barrier) with factual answers
- Max 4 FAQ per city — no inflation
- No structural or template changes

