

# Добавление целей на все кнопки тарифов и CTA без трекинга

## Проблема

Кнопки «Заказать» в `ServiceTariffs` и телефонные CTA в нескольких компонентах не отправляют цели в Яндекс.Метрику. Это слепые зоны аналитики.

## Компоненты без целей (нужно добавить trackGoal)

| # | Компонент | Кнопка | Цель |
|---|-----------|--------|------|
| 1 | `ServiceTariffs.tsx` | «Заказать» (tel) | `tariff_call_{prefix}` + params: tariff name, price |
| 2 | `DistrictCTA.tsx` | Телефон (tel) | `district_cta_call` + params: district, service |
| 3 | `DistrictsOverview.tsx` | Телефон (tel) | `districts_overview_call` |
| 4 | `ServiceSESPage.tsx` (нижний CTA, строка 179) | Телефон (tel) | `ses_cta_call` |
| 5 | `ServiceLandingUchastkiPage.tsx` (нижний CTA, строка 195) | Телефон (tel) | `uchastki_cta_call` |
| 6 | `blog/ServiceCTA.tsx` | Телефон (tel) | `blog_cta_call` |
| 7 | `ServiceAreaMap.tsx` (2 места, строки 127 и 303) | Телефон (tel) | `area_map_call` |

## Компоненты с целями (уже ОК)

- `ServiceStickyBar` — `service_sticky_call` ✅
- `FinalCTA` — `final_cta_call` ✅
- `Footer` — `phone_click` ✅
- `StickyCTA` — `phone_click` ✅
- `MobileQuickCTA` — `phone_click` ✅
- `DesktopStickySidebar` — через TrafficContext ✅
- `ServicePage` hero — `handlePhoneClick` ✅
- `ServiceSESPage` hero — `phone_click` ✅
- `ServiceLandingUchastkiPage` hero — `phone_click` ✅
- `HeroCallbackForm` — `hero_callback_submit` ✅
- `LeadFormModal` — `calc_lead_*` ✅
- `QuickCallForm` — `quick_call_submit` + `lead_submit` ✅
- `Calculator` — `calc_interact`, `calc_price_view` ✅
- `CalculatorModal` — `calc_open` ✅
- `FlashDiscountBadge` — `flash_badge_click` ✅

## Файлы для правки

| Файл | Правка |
|------|--------|
| `src/components/ServiceTariffs.tsx` | Добавить import `trackGoal`, `getYmGoalPrefix`; onClick на кнопку «Заказать» |
| `src/components/district/DistrictCTA.tsx` | Добавить import `trackGoal`; onClick на телефонную ссылку |
| `src/pages/DistrictsOverview.tsx` | Добавить onClick с `trackGoal` на телефонную кнопку |
| `src/pages/ServiceSESPage.tsx` | Добавить onClick с `trackGoal` на нижний CTA (строка 179) |
| `src/pages/ServiceLandingUchastkiPage.tsx` | Добавить onClick с `trackGoal` на нижний CTA (строка 195) |
| `src/components/blog/ServiceCTA.tsx` | Добавить import `trackGoal`; onClick на «Позвонить» |
| `src/components/ServiceAreaMap.tsx` | Добавить import `trackGoal`; onClick на 2 телефонные кнопки |

## Полный актуальный список целей после правки

```text
── Формы / лиды ──────────────────────────────
calc_lead_{prefix}          — отправка формы из калькулятора
quiz_lead_{prefix}          — отправка формы из квиза  
sticky_quiz_lead_{prefix}   — лид из sticky-квиза
hero_callback_submit        — форма обратного звонка (hero)
callback_{prefix}           — pest-specific callback
quick_call_submit           — быстрый звонок
lead_submit                 — общий лид

── Телефонные звонки ─────────────────────────
phone_click                 — общий клик по телефону
service_sticky_call         — sticky bar (мобильный)
final_cta_call              — финальный CTA
tariff_call_{prefix}        — кнопка «Заказать» в тарифах  ← НОВАЯ
district_cta_call           — CTA районной страницы         ← НОВАЯ
districts_overview_call     — обзор районов                 ← НОВАЯ
ses_cta_call                — нижний CTA на SES-странице    ← НОВАЯ
uchastki_cta_call           — нижний CTA на странице участков ← НОВАЯ
blog_cta_call               — CTA в блоге                   ← НОВАЯ
area_map_call               — карта районов                 ← НОВАЯ

── Калькулятор ───────────────────────────────
calc_open                   — открытие калькулятора
calc_interact               — взаимодействие с калькулятором
calc_price_view             — просмотр цены
calc_calculate              — расчёт стоимости

── Скролл / вовлечение ──────────────────────
scroll_25 / scroll_50       — глубина прокрутки
time_30s / time_60s         — время на сайте
section_pricing_visible     — видимость секции цен
section_reviews_visible     — видимость отзывов
section_faq_visible         — видимость FAQ
section_gallery_visible     — видимость галереи
section_process_visible     — видимость процесса

── Прочие ────────────────────────────────────
form_focus                  — фокус на форме
flash_badge_shown           — показ скидки
flash_badge_click           — клик по скидке
ai_referral                 — переход из AI
telegram_click              — клик по Telegram
```

7 файлов, 7 правок — добавление import + onClick handler.

