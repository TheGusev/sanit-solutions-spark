

## Plan: Медицинский glass-стиль для секции «Наши услуги»

### Изменения в `src/components/MiniPricing.tsx`

**1. Overlay секции** (line 34): заменить `bg-black/35` на градиентный overlay:
```
bg-gradient-to-b from-slate-900/65 via-slate-900/45 to-slate-900/35
dark:from-slate-950/70 dark:via-slate-950/55 dark:to-slate-950/40
```

**2. Карточки** (line 51): заменить текущие классы на строгий медицинский glass:
```
rounded-2xl border border-white/50 bg-white/35 backdrop-blur-xl
shadow-[0_18px_40px_rgba(15,23,42,0.25)] p-4 text-center
transition hover:border-white/80 hover:bg-white/45 hover:-translate-y-1
hover:shadow-[0_22px_50px_rgba(15,23,42,0.35)]
dark:border-white/25 dark:bg-slate-900/35 dark:hover:bg-slate-900/45
```

**3. Градиентная линия-подчёркивание** под subtitle в `SectionHeading`: добавить отдельный div после `SectionHeading` с классами:
```
h-[2px] w-24 mx-auto rounded-full bg-gradient-to-r from-sky-400/80 via-cyan-400/80 to-emerald-400/80 mb-8
```
Это заменит триколорную линию из SectionHeading для этой конкретной секции (спрячем её через CSS override).

**4. Без изменений**: grid layout (2x4), HTML-структура, кнопка — остаются как есть.

Файл: только `src/components/MiniPricing.tsx`.

