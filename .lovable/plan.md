

# Обновление памяти целей Яндекс.Метрики

Обновляю knowledge-запись `analytics/yandex-metrika-goals-v4` до `v5` с полным актуальным списком всех целей после последних добавлений.

## Содержимое новой записи

```text
Yandex Metrika (ID 105828040) — полный список целей:

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
tariff_call_{prefix}        — кнопка «Заказать» в тарифах
district_cta_call           — CTA районной страницы
districts_overview_call     — обзор районов
ses_cta_call                — нижний CTA на SES-странице
uchastki_cta_call           — нижний CTA на странице участков
blog_cta_call               — CTA в блоге
area_map_call               — карта районов

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

Prefix определяется функцией getYmGoalPrefix() из URL:
klopy, tarakany, muravyi, blohi, kleshchi, komary, muhi, mol,
krysy, kroty, dezinsekciya, deratizaciya, dezinfekciya,
dezodoraciya, ozonirovanie, sertifikaciya, uchastki, ses, main, general.
```

## Действие

Это обновление памяти проекта — изменений в коде нет.

