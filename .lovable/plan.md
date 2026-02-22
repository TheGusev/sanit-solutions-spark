

# Фаза 1: Sticky-панель + Hero-форма (Критический приоритет)

## Что уже есть и как это учтено

- `StickyCTA` -- привязан к калькулятору на главной, показывает цену после расчёта. На страницах услуг бесполезен.
- `MobileQuickCTA` -- встроен в контент главной (3 кнопки), не sticky.
- `FloatingButtons` -- плавающие WhatsApp/Telegram/Телефон, остаются без изменений.
- `CompactRequestModal` -- содержит `formatPhone()` и паттерн отправки через `handle-lead`. Переиспользуем.

---

## 1. Новый компонент: `ServiceStickyBar.tsx`

Фиксированная панель внизу экрана, **только mobile** (`md:hidden`).

**Логика:**
- Появляется после 20% скролла (не мешает Hero)
- Скрывается в зоне footer (как в StickyCTA)
- z-index: 40 (ниже модалок z-50, но выше контента)
- Две кнопки 50/50, высота 48px:
  - "Позвонить" -- `tel:+79069989888`, иконка Phone
  - "Узнать цену" -- скролл к `#pricing-by-area` (секция цен на ServicePage)
- Аналитика через `trackGoal`

**Файл:** `src/components/ServiceStickyBar.tsx`

---

## 2. Новый компонент: `HeroCallbackForm.tsx`

Компактная форма обратного звонка внутри Hero-блока.

**Поля:**
- Телефон (маска +7, переиспользуем `formatPhone` из CompactRequestModal)
- Кнопка "Перезвоните мне"
- Чекбокс согласия с политикой

**Отправка:**
```typescript
supabase.functions.invoke("handle-lead", {
  body: {
    name: "Обратный звонок",
    phone,
    source: "hero_callback",
    service: serviceSlug,
    last_page_url: window.location.href,
    // + UTM и контекст из useTraffic()
  }
})
```

**Стилизация:**
- Desktop: inline (в строку) -- поле + кнопка + чекбокс
- Mobile: в столбик, кнопка во всю ширину, высота 48px
- Фон: `bg-background/80 backdrop-blur-sm`, скругление, лёгкая тень

**Пропсы:** `serviceSlug: string` (для трекинга, какая услуга)

**Файл:** `src/components/HeroCallbackForm.tsx`

---

## 3. Интеграция в ServicePage.tsx

Минимальные изменения:

1. Импорт двух компонентов
2. `<HeroCallbackForm serviceSlug={service.slug} />` -- вставить после кнопок "Рассчитать стоимость" / "Позвонить" (после строки ~237, перед УТП-бейджами)
3. `<ServiceStickyBar />` -- перед `</main>` (перед строкой ~724)
4. Добавить `pb-16 md:pb-0` на `<main>` чтобы sticky-бар не перекрывал контент

---

## 4. Интеграция в ServicePestPage.tsx

Аналогично:

1. Импорт двух компонентов
2. `<HeroCallbackForm serviceSlug={service + '/' + pestSlug} />` -- после кнопок в Hero (после строки ~191)
3. `<ServiceStickyBar />` -- перед `</main>`
4. `pb-16 md:pb-0` на `<main>`

---

## Изменяемые файлы

| Файл | Действие | Объём |
|------|----------|-------|
| `src/components/ServiceStickyBar.tsx` | Создать | ~80 строк |
| `src/components/HeroCallbackForm.tsx` | Создать | ~120 строк |
| `src/pages/ServicePage.tsx` | +2 импорта, +2 строки JSX, +1 класс | 5 строк |
| `src/pages/ServicePestPage.tsx` | +2 импорта, +2 строки JSX, +1 класс | 5 строк |

---

## Что НЕ меняется

- URL страниц
- H1, Title, Description
- Роутинг
- Header / Footer / FloatingButtons
- Существующие SEO-тексты
- Структура меню
- Edge function `handle-lead` (используем as-is)

