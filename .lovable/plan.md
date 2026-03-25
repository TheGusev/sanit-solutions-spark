

# Очистка целей: оставить только 12 утверждённых

## Текущее состояние

Сейчас на сайте ~40+ разных целей. Нужно оставить только 12 из Яндекс.Метрики и убрать все остальные.

## 12 целей которые ОСТАВЛЯЕМ

| Цель | Где срабатывает |
|------|----------------|
| `final_cta_call` | FinalCTA — кнопка «Позвонить» |
| `final_cta_calculator` | FinalCTA — кнопка «Рассчитать» |
| `calc_open` | CalculatorModal — открытие |
| `calc_interact` | Calculator — первое взаимодействие |
| `calc_price_view` | Calculator — результат расчёта |
| `quiz_lead_{prefix}` | ServiceQuiz — отправка заявки |
| `calc_lead_{prefix}` | LeadFormModal, CompactRequestModal — заявка из калькулятора |
| `service_sticky_call` | ServiceStickyBar — звонок |
| `calc_calculate` | ServiceStickyBar — узнать цену |
| `lead_submit` | QuickCallForm, ExitIntentPopup — общая заявка |
| `hero_callback_submit` | HeroCallbackForm — заявка с героя |
| `phone_click` | Header, Footer, FloatingButtons, MobileQuickCTA — звонок |

## Что УДАЛЯЕМ (маппинг замен)

| Удаляемая цель | Файл | Действие |
|----------------|------|----------|
| `sticky_quiz_lead_{prefix}` | ServiceQuiz | → `quiz_lead_{prefix}` (убрать ветку sticky) |
| `callback_{prefix}` | HeroCallbackForm | Удалить строку |
| `form_focus` | HeroCallbackForm | Удалить onFocus trackGoal |
| `quick_call_submit` | QuickCallForm | Удалить (оставить только `lead_submit`) |
| `flash_badge_shown` | FlashDiscountBadge | Удалить |
| `flash_badge_click` | FlashDiscountBadge | Удалить |
| `messenger_click` | Footer | Удалить |
| `sticky_cta_view` | StickyCTA | Удалить |
| `sticky_cta_click` | StickyCTA | → `calc_open` |
| `sticky_cta_call` | StickyCTA | → `phone_click` |
| `desktop_sticky_view` | DesktopStickySidebar | Удалить |
| `desktop_sticky_click` (order) | DesktopStickySidebar | → `calc_open` |
| `desktop_sticky_click` (phone) | DesktopStickySidebar | → `phone_click` |
| `hero_cta_click` | Hero | → `calc_open` |
| `tariff_call_{prefix}` | ServiceTariffs | → `phone_click` |
| `calculator_click` | MobileQuickCTA, ServicePage, ServiceSubpage, SESPage, UchastkiPage | → `calc_open` |
| `district_cta_call` | DistrictCTA | → `phone_click` |
| `blog_cta_call` | ServiceCTA (blog) | → `phone_click` |
| `districts_overview_call` | DistrictsOverview | → `phone_click` |
| `mole_city_call` | MoleCityPage | → `phone_click` |
| `ses_cta_call` | ServiceSESPage | → `phone_click` |
| `uchastki_cta_call` | ServiceLandingUchastkiPage | → `phone_click` |
| `exit_intent_shown` | ExitIntentPopup | Удалить |
| `exit_intent_submit` | ExitIntentPopup | → `lead_submit` |
| `max_click` | FloatingButtons | Удалить |
| `main_scroll_{n}` | useHomepageGoals | Удалить |
| `time_30s` / `time_60s` | useHomepageGoals, useGlobalGoals | Удалить |
| `section_{id}` | useHomepageGoals, useGlobalGoals | Удалить |
| `scroll_{n}` | useGlobalGoals, useScrollDepth | Удалить |
| `phone_copy` | useGlobalGoals | Удалить |
| `ai_referral` | analytics.ts | Удалить |

## Файлы (22 файла)

| # | Файл | Правки |
|---|------|--------|
| 1 | `src/components/ServiceQuiz.tsx` | Убрать ветку sticky_quiz_lead, всегда `quiz_lead_{prefix}` |
| 2 | `src/components/HeroCallbackForm.tsx` | Убрать `callback_{prefix}` и `form_focus` |
| 3 | `src/components/QuickCallForm.tsx` | Убрать `quick_call_submit` |
| 4 | `src/components/FlashDiscountBadge.tsx` | Убрать обе trackGoal |
| 5 | `src/components/Footer.tsx` | Убрать `messenger_click` |
| 6 | `src/components/StickyCTA.tsx` | view→удалить, click→`calc_open`, call→`phone_click` |
| 7 | `src/components/DesktopStickySidebar.tsx` | view→удалить, order→`calc_open`, phone→`phone_click` |
| 8 | `src/components/Hero.tsx` | `hero_cta_click`→`calc_open` |
| 9 | `src/components/ServiceTariffs.tsx` | `tariff_call_{prefix}`→`phone_click` |
| 10 | `src/components/MobileQuickCTA.tsx` | `calculator_click`→`calc_open` |
| 11 | `src/components/FloatingButtons.tsx` | Убрать `max_click` |
| 12 | `src/components/ExitIntentPopup.tsx` | shown→удалить, submit→`lead_submit` |
| 13 | `src/components/district/DistrictCTA.tsx` | → `phone_click` |
| 14 | `src/components/blog/ServiceCTA.tsx` | → `phone_click` |
| 15 | `src/pages/ServicePage.tsx` | `calculator_click`→`calc_open` |
| 16 | `src/pages/ServiceSubpage.tsx` | `calculator_click`→`calc_open` |
| 17 | `src/pages/ServiceSESPage.tsx` | calculator→`calc_open`, ses_cta_call→`phone_click` |
| 18 | `src/pages/ServiceLandingUchastkiPage.tsx` | calculator→`calc_open`, uchastki_cta_call→`phone_click` |
| 19 | `src/pages/DistrictsOverview.tsx` | → `phone_click` |
| 20 | `src/pages/MoleCityPage.tsx` | → `phone_click` |
| 21 | `src/hooks/useHomepageGoals.ts` | Удалить все trackGoal (scroll, time, section) |
| 22 | `src/hooks/useGlobalGoals.ts` | Удалить все trackGoal (scroll, time, section, phone_copy) |
| 23 | `src/hooks/useScrollDepth.ts` | Удалить trackGoal |
| 24 | `src/lib/analytics.ts` | Удалить `trackAIReferral`, `detectDarkAITraffic` |

## Что НЕ трогаем

- `trackPageView` — это не цель, это хит страницы
- `setUserProperties` — userParams, не цель
- VK Pixel / Top.Mail.Ru маппинг в `trackGoal` — оставляем, но обновляем маппинг под 12 целей
- `PATHNAME_SLUG_MAP` и `getYmGoalPrefix` — оставляем, нужны для `{prefix}`

