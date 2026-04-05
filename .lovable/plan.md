

# Phase 5: Schema.org, FAQ-блоки, all_conversions финализация

## Текущее состояние

### Schema.org
- **BreadcrumbList**: Существует в 2 вариантах — (a) через `Breadcrumbs.tsx` + `generateBreadcrumbSchema()` из `internalLinking.ts`, (b) inline в каждой page (ServicePage, ServicePestPage, NchPage, etc.). Проблемы:
  - `generateBreadcrumbSchema()` пишет `item: SEO_CONFIG.baseUrl` для "Главная" — **без trailing slash** (`https://goruslugimsk.ru` вместо `https://goruslugimsk.ru/`)
  - Inline schemas в ServicePestPage line 154: URL без trailing slash
  - ServicePage line 167/173/179: URL без trailing slash, последний элемент включает `item` (должен быть без)
  - **Дубли**: страницы, где есть и `Breadcrumbs` (с schema), и inline `breadcrumbSchema` в metadata — двойной BreadcrumbList JSON-LD
- **LocalBusiness**: Contacts.tsx уже имеет полноценный LocalBusiness schema (lines 53-100). Index.tsx — schema генерируется в `generateIndexMetadata()` без LocalBusiness. `jsonLD.ts` содержит `generateOrganizationLD()` но не используется на главной.
- **Service**: `StructuredData.tsx` имеет `generateService()`, но service hubs (ServicePage) используют inline schema с `@type: Service` (line 125-143). Уже работает.
- **FAQPage**: Уже есть на ServicePage, ServicePestPage, NchPage, DistrictPage, MoleCityPage, ServiceSubpage, ServiceDistrictPage, ServiceObjectPage, MoscowRegionServicePage, NeighborhoodPage.

### FAQ-блоки с контекстными ссылками
- ServicePestPage уже имеет FAQ с Link в ответах (lines 380-420). Вопрос: нужно ли менять текст FAQ или только убедиться что ссылки есть? → **Task B**: добавить/обновить FAQ с внутренними ссылками на 5 страницах. ServicePestPage уже имеет FAQ с ссылками, но вопросы из задания отличаются от текущих (генерируются из `pest.faq`). Нужно добавить контекстные ссылки в существующие FAQ ответы, а не заменять.
- `/uslugi/deratizaciya/` и `/uslugi/borba-s-krotami/` — FAQ из `service.faq` данных, без ссылок в ответах
- `/rajony/` (DistrictsOverview) — FAQ отсутствует

### all_conversions
- Уже реализован в `trackGoal()` (analytics.ts lines 184-204). `ALL_CONV_GOALS` set содержит 10 событий + prefix-based matching. **Уже работает корректно**.
- Все формы, tel:, quiz вызывают `trackGoal()` → автоматически fire `all_conversions`.
- Нет проблем с дублями — проверка `goalName !== 'all_conversions'` предотвращает рекурсию.

---

## Блок A: Schema.org стандартизация

### A1. Fix BreadcrumbList schemas

**Проблема 1**: `generateBreadcrumbSchema()` в `internalLinking.ts` использует `SEO_CONFIG.baseUrl` = `https://goruslugimsk.ru` (без slash) для "Главная". Нужно `+ '/'`.

**Проблема 2**: Последний breadcrumb item не должен иметь `item` поле. Текущая логика: если `item.href` отсутствует — `item` не добавляется. Это **уже корректно** для Breadcrumbs компонента (последний item без href).

**Проблема 3**: Inline breadcrumb schemas в page-файлах:
- `ServicePage.tsx` line 167: `"item": "https://goruslugimsk.ru"` → нужно `/`; line 179: последний элемент имеет `item` → убрать
- `ServicePestPage.tsx` line 154-156: без trailing slash, последний элемент с `item` → убрать
- `NchPage.tsx`, `DistrictPage.tsx` — аналогично (используют `SEO_CONFIG.baseUrl` без slash для Главная)
- `ServiceSESPage.tsx` line 44: `"item": "https://goruslugimsk.ru"` → нужно `/`

**Проблема 4**: Дубли schema на страницах, где `Breadcrumbs` компонент (с `showSchema=true`) и inline `breadcrumbSchema` в metadata оба рендерятся. Нужно на каждой странице оставить только один источник BreadcrumbList.

**Решение**: 
1. Fix `generateBreadcrumbSchema()` → добавить `/` к baseUrl для "Главная"
2. На страницах с `Breadcrumbs` компонентом — убрать inline `breadcrumbSchema` из metadata.schema (предпочитаем компонент)
3. На страницах без `Breadcrumbs` компонента — fix inline schemas: trailing slash, убрать `item` у последнего элемента

**Файлы**: `internalLinking.ts`, `ServicePage.tsx`, `ServicePestPage.tsx`, `ServiceSESPage.tsx`

### A2. LocalBusiness на главной

Index.tsx использует `SEOHead` с `generateIndexMetadata()`. Нужно добавить LocalBusiness schema в metadata.schema. Contacts.tsx уже имеет LocalBusiness — не трогаем.

**Файл**: `metadata.ts` — добавить LocalBusiness schema в `generateIndexMetadata()`

### A3. Service schema — уже на месте

ServicePage уже генерирует `@type: Service` schema (line 125-143). Ничего делать не нужно.

### A4. FAQPage schema — уже на месте

Все страницы с FAQ уже имеют FAQPage schema. Новые FAQ (DistrictsOverview) получат schema вместе с FAQ-блоком.

---

## Блок B: FAQ с контекстными ссылками

### B1-B4: ServicePestPage + ServicePage (hub pages)

ServicePestPage уже имеет FAQ с ссылками в AccordionContent (lines 380-420). Существующие FAQ содержат ссылки на `/uslugi/${service}/` и `/blog/kak-podgotovit-pomeshchenie/`. **Уже соответствует требованиям**.

ServicePage (hub) FAQ рендерит `service.faq` из данных — простой текст без ссылок. Добавлять ссылки в data-driven FAQ сложно и рискованно (нужно менять структуру данных).

**Подход**: Создать маппинг FAQ с контекстными ссылками для 3 ключевых hub-страниц (`dezinsekciya`, `deratizaciya`, `borba-s-krotami`) как специальный override. Когда на ServicePage рендерится FAQ для этих slugs, добавлять 1-2 вопроса с ссылками после основного FAQ.

**Файлы**: `ServicePage.tsx` — добавить contextual FAQ items с Link для 3 slugs

### B5: DistrictsOverview FAQ

Страница `/rajony/` сейчас не имеет FAQ. Добавить 2 вопроса + FAQPage schema.

**Файл**: `DistrictsOverview.tsx`

---

## Блок C: all_conversions

**Аудит результат**: `trackGoal()` уже автоматически стреляет `all_conversions` для всех primary events. Покрытие:
- `lead_submit` — QuickCallForm, LeadFormModal ✅
- `hero_callback_submit` — HeroCallbackForm ✅
- `phone_click` — Footer, ServicePage, ServiceTariffs, MoleCityPage, ServiceLandingUchastkiPage, DistrictCTA, blog ServiceCTA, MobileQuickCTA ✅
- `calc_open` — Hero, CalculatorModal, ServicePage, ServiceSubpage, ServiceLandingUchastkiPage ✅
- `quiz_lead_*` — ServiceQuiz ✅
- `calc_lead_*` — CompactRequestModal, LeadFormModal ✅

**Пробелы**: Contacts.tsx `handlePhoneClick` (line 41-43) делает `window.location.href = "tel:..."` **без** `trackGoal('phone_click')`. Аналогично `handleMaxClick` и `handleEmailClick`.

**Файл**: `Contacts.tsx` — добавить `trackGoal('phone_click')` в `handlePhoneClick`

**Admin exclusion**: trackGoal не проверяет pathname. Но admin страницы не содержат коммерческие формы/tel ссылки → фактически нет срабатываний. Допустимо не менять.

---

## Итого — файлы для изменения

| Действие | Файл | Что |
|----------|------|-----|
| Edit | `src/lib/internalLinking.ts` | Fix trailing slash в generateBreadcrumbSchema |
| Edit | `src/pages/ServicePage.tsx` | Fix inline breadcrumb schema (trailing slash, last item), add contextual FAQ links для 3 service slugs |
| Edit | `src/pages/ServicePestPage.tsx` | Fix inline breadcrumb schema |
| Edit | `src/pages/ServiceSESPage.tsx` | Fix inline breadcrumb schema |
| Edit | `src/lib/metadata.ts` | Add LocalBusiness schema в generateIndexMetadata |
| Edit | `src/pages/DistrictsOverview.tsx` | Add FAQ + FAQPage schema |
| Edit | `src/pages/Contacts.tsx` | Add trackGoal('phone_click') |

## Что НЕ меняется
- URL, canonical, robots, noindex, sitemap — без изменений
- Paid-traffic logic — без изменений  
- Новые страницы не создаются
- `all_conversions` логика в analytics.ts — уже корректна, не трогаем

