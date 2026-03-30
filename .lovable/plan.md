

# SAFE SEO REFACTOR — goruslugimsk.ru

## Executive Summary

Проект имеет ~1,249 SSG-страниц. Главный риск — 734 NCH-страницы (pest+neighborhood) с шаблонным контентом, которые Яндекс уже помечает "малоценными". Предлагается 3-этапный рефакторинг: немедленно убрать Tier 3 из индекса (90 стр.), усилить Tier 1 уникальными блоками, почистить orphan-ссылки на `/uslugi/sertifikaciya/` в JSON-LD.

---

## 1. Классификация страниц

### Оставить `index, follow` (~425 стр.)
- Главная, контакты, команда, СЭС, отзывы, блог-листинг
- 7 услуг-хабов + 17 подстраниц + 14 pest-страниц
- 56 object-страниц, 36 округов, 130 районов
- 71 МО, 23 кротов, 207 блог-статей
- NCH Tier 1 (524 стр.) — после усиления

### Перевести в `noindex, follow` (~210 стр.)
- **NCH Tier 3** (90 стр.): 6 слабых вредителей × 15 районов — максимальный doorway-риск
- **NCH Tier 2** (120 стр.): муравьи/блохи/моль × 40 районов — средний риск
- `/privacy/`, `/terms/` — уже noindex, подтвердить

### Усилить уникализацию (~524 стр.)
- **NCH Tier 1**: tarakany, klopy, krysy, myshi × 131 район

### Orphan-починка
- Удалить `/uslugi/sertifikaciya` из JSON-LD в `index.html` (строки 332-355) — страница-orphan без SPA-рендера
- Удалить ссылку на sertifikaciya из SSR-fallback в `index.html` (строка 388, 480)
- Удалить ссылку из `public/uslugi/po-okrugam-moskvy/index.html` (строка 82)

---

## 2. NCH Tier обработка

### Tier 3 → `noindex, follow` + убрать из sitemap
90 страниц: komary, muhi, osy-shershni, cheshuynitsy, kleshchi, mokricy × 15 районов

**Файлы:**
1. `src/pages/NchPage.tsx` — добавить проверку: если pest в tier3PestsList → robots = `noindex, follow`
2. `vite-plugin-sitemap.ts` — убрать блок Tier 3 (строки 403-413)
3. `src/components/InternalLinks.tsx` — не линковать на Tier 3 NCH страницы

### Tier 2 → `noindex, follow` + убрать из sitemap
120 страниц: muravyi, blohi, mol × 40 районов

**Файлы:**
1. `src/pages/NchPage.tsx` — если pest в tier2PestsList → robots = `noindex, follow`
2. `vite-plugin-sitemap.ts` — убрать блок Tier 2 (строки 390-401)

SSG продолжит генерировать HTML (страницы остаются для пользователей из рекламы), но поисковики не будут их индексировать.

### Tier 1 → усиление уникальности (524 стр.)

Текущая проблема: `contentGenerator.ts` имеет 3-4 вариации на каждый блок, выбираемые по хешу. Для 524 страниц это даёт массовое совпадение shingle-отпечатков.

**Новый подход — добавить в NchPage.tsx 3 уникальных блока:**

#### A. Блок «Когда нужна обработка именно в {район}»
Генерируется в `contentGenerator.ts` новой функцией `generateWhyThisArea(ctx)`:
- Использует `neighborhood.description`, `neighborhood.districtId`, pest-specific данные
- 6+ вариаций текста, выбираемых по хешу `pest+neighborhood+district`
- Включает: тип застройки района, близость к водоёмам/паркам/метро, климатические особенности

#### B. Блок «Стоимость по типу объекта»
Таблица цен: квартира 1к / 2к / 3к / дом / офис — с разными ценами для каждого pest
- Данные из `pest.priceFrom` с множителями по типу объекта
- Уникальная для каждой комбинации pest+район (множитель по districtId — ЦАО дороже)

#### C. Блок «Отзыв из района»
Детерминистичный выбор отзыва из `reviews.ts` по хешу neighborhood, с привязкой к району в тексте.

**Также:**
- H2 вариация: 8+ шаблонов вместо текущих 3, с кластером спроса (жильё vs коммерция)
- Intro: 8+ вариаций вместо 4
- FAQ: добавить 2 pest-specific + 1 neighborhood-specific вопроса к базовым 5

---

## 3. High Risk URLs/Templates

| Шаблон | Риск doorway | Риск thin | Риск дубля | Действие |
|--------|-------------|-----------|------------|----------|
| NCH Tier 3 (90) | HIGH | HIGH | HIGH | `noindex` + убрать из sitemap |
| NCH Tier 2 (120) | MEDIUM | HIGH | HIGH | `noindex` + убрать из sitemap |
| NCH Tier 1 (524) | MEDIUM | MEDIUM | MEDIUM | Усилить контент (блоки A/B/C) |
| Object-страницы (56) | LOW | MEDIUM | MEDIUM | Оставить (разные услуги = разный intent) |
| Районы (130) | LOW | LOW | LOW | Оставить |
| Округа (36) | LOW | LOW | LOW | Оставить |
| Сертификация orphan | — | — | — | Убрать из JSON-LD, оставить static HTML |

---

## 4. Exact Code/File Changes

### Файл 1: `src/pages/NchPage.tsx`
- Импортировать `tier2PestsList`, `tier3PestsList` из `nchSeeds.ts`
- После строки 86 (`const seoMeta = ...`): проверить pest tier и выставить robots:
```
const isNoindexTier = tier2PestsList.includes(pestSlug) || tier3PestsList.includes(pestSlug);
```
- В Helmet: заменить `seoMeta.robots` на `isNoindexTier ? 'noindex, follow' : seoMeta.robots`
- Добавить после секции "Guarantee" (строка 470): блоки A (WhyThisArea), B (PriceByObjectType), C (LocalReview)

### Файл 2: `src/lib/contentGenerator.ts`
- Добавить функцию `generateWhyThisArea(ctx)` — 6+ вариаций
- Добавить функцию `generatePriceTable(ctx)` — цены по типу объекта
- Добавить функцию `generateLocalReview(ctx)` — детерминистичный отзыв
- Расширить `generateIntro()` с 4 до 8 вариаций
- Расширить `generateFAQ()` — добавить pest-specific вопросы

### Файл 3: `vite-plugin-sitemap.ts`
- Удалить блок Tier 2 (строки 390-401)
- Удалить блок Tier 3 (строки 403-413)
- Пересчёт: sitemap уменьшится на ~210 URL

### Файл 4: `index.html`
- Удалить JSON-LD блок сертификации (строки 332-355)
- Удалить ссылку на sertifikaciya из SSR-fallback (строка 388, 480)

### Файл 5: `public/uslugi/po-okrugam-moskvy/index.html`
- Удалить строку 82 (ссылка на sertifikaciya)

### Файл 6: `src/components/InternalLinks.tsx`
- Добавить фильтр: не линковать на NCH-страницы с pest из tier2/tier3 списков

---

## 5. Что НЕ делать

- **Не создавать** `/uslugi/borshchevik/` — нет коммерческого спроса, статья в блоге достаточна
- **Не создавать** `/uslugi/sertifikaciya/` как SPA-страницу — orphan-контент, низкий спрос
- **Не создавать** combo-pest страниц (klopov-i-tarakanov)
- **Не плодить** новые NCH-слои
- **Не трогать** A/B тесты — они уже SEO-safe (H1/Title статичны, вариации только UI)

---

## 6. Безопасность: Cloaking / UA-switching

Подтверждаю по коду:
- `contentVariations.ts` использует `simpleHash(slug)` — детерминистичный, одинаковый для бота и пользователя
- A/B тесты: Thompson Sampling через `useABVariant` кэширует вариант в localStorage, но H1/Title/Description статичны (SEO guardrails)
- Нет UA-based branching, нет `navigator.userAgent` проверок для контентных решений
- SSG выдаёт одинаковый HTML для всех

---

## 7. Rollout Plan

### Этап 1: IMMEDIATE (этот деплой)
1. NCH Tier 2+3 → `noindex, follow` в NchPage.tsx
2. Tier 2+3 убрать из sitemap
3. Orphan sertifikaciya — убрать из JSON-LD и SSR-fallback
4. InternalLinks — не линковать на noindex NCH

### Этап 2: AFTER REINDEX (через 1-2 недели)
1. Усилить NCH Tier 1 — блоки A/B/C в NchPage.tsx
2. Расширить contentGenerator.ts (8+ вариаций)
3. Отправить обновлённый sitemap в Вебмастер

### Этап 3: GROWTH (через 3-4 недели, после стабилизации)
1. Мониторинг: если Tier 1 стабильно индексируется → оставить
2. Если Tier 1 помечается малоценным → дальнейшее noindex до Tier 1 topNeighborhoods (15 районов)
3. Масштабирование рекламы только после стабилизации индексации

