

# SAFE ENHANCEMENT PASS — MO + Mole Cluster + Premium-West

## Scope

Усиление 23 существующих mole city pages (`MoleCityPage.tsx`) через данные в `moleCities.ts` и минимальные template-изменения. Никаких новых URL, routes, slugs, canonical, sitemap, indexability изменений.

---

## PHASE 0 — PRE-IMPLEMENTATION QA

### Template bugs to check/fix first

1. **Methods block**: 4 карточки hardcoded inline в `MoleCityPage.tsx:196-201` — **идентичны на всех 23 страницах**. Это главный doorway-сигнал. Нужно вынести в данные и сделать город-зависимыми.

2. **MoleCity interface**: нет поля для город-специфичных методов и нет поля для типа города (premium/strong/mid/thin). Нужно расширить интерфейс.

3. **SEO check**: H1 ✅ (один), canonical ✅ (trailing slash через `generateSEOMeta`), BreadcrumbList ✅ (один, через `Breadcrumbs.tsx`), FAQPage ✅ (один, через inline JSON-LD). Всё чисто.

4. **Linking check**: RelatedServices ✅, RelatedGeoLinks ✅, RelatedBlogLinks ✅, relatedCities ✅. Нет ссылок на noindex/admin.

---

## PHASE 1 — PREMIUM-WEST (Барвиха, Жуковка, Усово, Одинцово)

### Что меняется

**A. Data layer (`moleCities.ts`)**

Расширить `MoleCity` interface:
```typescript
interface MoleCity {
  // ...existing fields...
  cityTier?: 'premium' | 'strong' | 'mid' | 'thin';
  methodNotes?: string; // 1 предложение, город-специфичное уточнение к методам
  objectContext?: string; // тип объектов: "коттеджные участки 20-50 соток", "дачи и СНТ" и т.п.
}
```

Для 4 premium городов добавить:
- `cityTier: 'premium'`
- `methodNotes` — короткое уточнение про деликатную обработку (1 предложение)
- `objectContext` — тип объектов premium сегмента

Добавить 1-2 FAQ на город (max 5 FAQ итого):
- Барвиха: вопрос про рулонный газон
- Жуковка: вопрос про абонемент для КП
- Усово: вопрос про сезонность у реки
- Одинцово: вопрос про обработку большого участка

**B. Template layer (`MoleCityPage.tsx`)**

1. **Секция «Специфика района»** (строки 162-185): после существующих абзацев — условный абзац из `city.objectContext` (если есть). Max 2 предложения.

2. **Секция «Методы»** (строки 187-214): после 4 карточек — условный абзац `city.methodNotes` (если есть). Не новая карточка, а пояснение под карточками. Формат: `<p>` в `text-muted-foreground`.

3. **Visual refinement**: для `cityTier === 'premium'` — добавить subtle badge в hero (например, иконка `Gem` + «Деликатная обработка»). Один chip, без агрессии.

### Лимиты
- +1 абзац в специфике (через `objectContext`)
- +1 абзац под методами (через `methodNotes`)
- +1-2 FAQ
- +1 trust chip в hero
- Никаких новых секций, URL, routes

### Почему безопасно
- Данные добавляются в существующие поля `moleCities.ts`
- Template рендерит условно — пустые поля = нет изменений
- Doorway-сигнал снижается (методы перестают быть 100% одинаковыми)
- Каннибализация невозможна — URL, H1, title не меняются

---

## PHASE 2 — STRONG NEAR-MO (Красногорск, Нахабино, Дедовск, Истра, Лобня, Долгопрудный, Домодедово)

### Что меняется

**Data layer**: для 7 городов добавить:
- `cityTier: 'strong'`
- `objectContext` — «дачные участки, СНТ, частные дома» (1 предложение)
- `methodNotes` — уточнение метода под soilType (1 предложение)
- +1 FAQ на город (сезонность или СНТ-контекст)

### Лимиты
- +1 абзац в специфике
- +1 абзац под методами
- +1 FAQ
- Никаких visual changes сверх template

---

## PHASE 3 — MID-MARKET (Дмитров, Яхрома, Чехов, Серпухов, Наро-Фоминск, Солнечногорск, Клин)

### Что меняется

**Data layer**: для 7 городов:
- `cityTier: 'mid'`
- `methodNotes` — 1 предложение про soilType-специфику метода
- +1 FAQ (про расстояние/выезд) только для городов >50 км без такого вопроса

### Лимиты
- Только `methodNotes` (1 предложение)
- +0-1 FAQ
- Без `objectContext` (не нужен для mid)

---

## PHASE 4 — THIN-RISK (Можайск, Талдом, Дубна, Руза, Воскресенск)

### Решение: MINIMAL CHANGE

- `cityTier: 'thin'`
- `methodNotes` только если FAQ generic (Можайск, Воскресенск) — 1 предложение
- Без `objectContext`
- Без новых FAQ

---

## PHASE 5 — TEMPLATE CHANGES SUMMARY

### `src/data/moleCities.ts`
- Расширить `MoleCity` interface (+3 optional поля)
- Обновить данные для 23 городов (tier + contextual fields)

### `src/pages/MoleCityPage.tsx`
- Секция специфики: +1 conditional `<p>` из `city.objectContext`
- Секция методов: +1 conditional `<p>` из `city.methodNotes`
- Hero: +1 conditional chip для premium tier
- Всё conditional — пустые поля = нет изменений = backward compatible

### Не меняется
- URL, slug, canonical, indexability, sitemap
- routing, seoRoutes, SSG logic
- H1, title, description logic
- BreadcrumbList, FAQPage schema
- RelatedServices, RelatedGeoLinks, RelatedBlogLinks
- relatedCities topology
- ServiceTariffs (остаётся pest.tariffs — одинаковый)
- ServiceQuiz
- robots.txt
- Блог

---

## Execution order

1. Template QA pass (verify no existing bugs)
2. Extend `MoleCity` interface
3. Premium-west data + template conditional blocks
4. Verify premium-west (self-check)
5. Strong near-MO data
6. Verify strong (self-check)
7. Mid-market data
8. Verify mid (self-check)
9. Thin-risk data
10. Final verification pass

Each batch: exact changes → implementation → diff → self-check → next.

