

# Phase 2 — Strong Near-MO: Exact Change Plan

## Current State (already done in Phase 1)

| Город | cityTier | methodNotes | objectContext | FAQ count |
|-------|----------|-------------|---------------|-----------|
| Красногорск | ✅ strong | ✅ | ✅ | 4 ✅ |
| Нахабино | ✅ strong | ✅ | ✅ | 4 ✅ |
| Истра | ✅ strong | ✅ | ✅ | 4 ✅ |
| Дедовск | ✅ strong | ✅ | ❌ missing | 3 (needs +1) |
| Лобня | ✅ strong | ✅ | ❌ missing | 3 (needs +1) |
| Долгопрудный | ✅ strong | ✅ | ❌ missing | 3 (needs +1) |
| Домодедово | ✅ strong | ✅ | ✅ | 3 (needs +1) |

## Remaining Work — Data Only (`src/data/moleCities.ts`)

No template changes needed — conditional rendering already in place from Phase 1.

### A. Add `objectContext` (3 cities)

**Дедовск** (line ~106, after `blogSlug`):
```
objectContext: 'Дачные участки и СНТ вдоль реки Истры — частный сектор и огороды от 6 до 15 соток.',
```

**Лобня** (line ~211, after `methodNotes`):
```
objectContext: 'Частные дома и дачные участки у озера Киово, огороды и садовые товарищества.',
```

**Долгопрудный** (line ~230, after `methodNotes`):
```
objectContext: 'Частные участки и дачи в пригородной зоне вдоль канала имени Москвы.',
```

### B. Add +1 FAQ (4 cities)

**Дедовск** — добавить 4-й FAQ:
```
{ question: 'Можно ли обработать участок рядом с рекой Истрой?', answer: 'Да, используем препараты, сертифицированные для применения вблизи водоёмов. Безопасно для экосистемы реки.' }
```
Intent: «обработка от кротов у реки», локальная привязка к Истре.

**Лобня** — добавить 4-й FAQ:
```
{ question: 'Когда лучше всего обрабатывать участок в Лобне?', answer: 'Оптимально — с апреля по июнь, когда торфяные почвы просыхают и кроты активно строят тоннели ближе к поверхности.' }
```
Intent: сезонность, soilType-привязка.

**Долгопрудный** — добавить 4-й FAQ:
```
{ question: 'Обрабатываете ли участки в СНТ Долгопрудного?', answer: 'Да, работаем со всеми СНТ и ДНП. При групповом заказе от 3 участков — скидка 15% каждому.' }
```
Intent: «кроты в СНТ», групповой заказ.

**Домодедово** — добавить 4-й FAQ:
```
{ question: 'Влияет ли близость Пахры на выбор метода?', answer: 'Да, у реки кроты особенно активны из-за плодородного грунта. Применяем комплексную обработку с усиленным барьером по границе участка со стороны реки.' }
```
Intent: waterfront specifics, method choice.

## What Changes
- 1 file: `src/data/moleCities.ts`
- 3 cities get `objectContext` (1 sentence each)
- 4 cities get +1 FAQ (total FAQ per city: 4)

## What Does NOT Change
- URL, slug, canonical, indexability, sitemap — untouched
- Template (`MoleCityPage.tsx`) — no changes, conditional rendering already works
- H1, title, description — untouched
- relatedCities topology — untouched
- No new routes, pages, or service entities

## Why Safe
- Only data additions to existing optional fields
- Template already renders these conditionally (Phase 1)
- FAQ questions are unique per city, tied to local landmarks/soil
- objectContext tied to real geography — no spam
- Max 4 FAQ per city — no inflation

