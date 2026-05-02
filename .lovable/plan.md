## Задание 1 — визуальное усиление страниц «Клопы» и «Тараканы» (мобила в приоритете)

### 1.1 Загрузка ассетов от пользователя
Скопировать в `public/images/pests/real/`:
- `user-uploads://39d64351-...png` → `bedbug-mattress-real.jpg` (заражённый матрас)
- `user-uploads://e23ec8b9-...png` → `bedbug-treatment-real.jpg` (специалист с распылителем)
- `user-uploads://IMG_5838.MOV` → `public/videos/bedbug-process.mp4`
- `user-uploads://IMG_5843.MOV` → `public/videos/bedbug-process-2.mp4`

(MOV → MP4 через `ffmpeg -c:v libx264 -crf 26 -preset slow -movflags +faststart -an`, плюс poster-кадр для CLS).

### 1.2 ServicePestPage — новый блок «Real Hero Visual» для klopy
В `src/pages/ServicePestPage.tsx` сразу под Hero (или внутри Hero на мобиле) добавить условный блок для `pestSlug === 'klopy'`:
- На мобиле (`md:hidden`): сразу ПОД breadcrumbs и заголовком — две реальные фотографии «Проблема → Решение» в плотной 2-колоночной сетке (gap-2), aspect-square, с подписями-бэйджами «До» / «Работа специалиста».
- Под фото — компактный inline-видеоплеер (`<video muted playsInline autoPlay loop preload="metadata" poster=...>`) с реальной обработкой матраса. Высота ~220px, rounded-xl, shadow.
- На десктопе (`hidden md:block`): блок-баннер на всю ширину под hero — 3-колоночный grid (фото 1 / видео / фото 2) с заголовком «Реальные фото с объекта в Москве».

### 1.3 Тараканы на мобиле — fix существующего блока
Сейчас фото таракана (`pestImage`) скрыто на мобиле (`hidden md:block`, скрин 5 это подтверждает). Делаем:
- Убрать `hidden md:block` — показывать на ВСЕХ устройствах для `tarakany` (и других pests с готовым `pestImage`).
- На мобиле: фото идёт СРАЗУ после H1 + краткого описания, ПЕРЕД bullet-листом и trust-бейджами (визуальный якорь).
- Использовать `OptimizedImage` с WebP, aspect-[4/3], rounded-2xl, shadow-xl, eager loading, бэйдж «Избавим за 1 день!» в нижнем углу.
- Порядок секций hero на мобиле перестроить через `flex flex-col` с `order-*`: 1) breadcrumbs+заголовок 2) фото 3) описание 4) bullets 5) trust 6) CTA-кнопки 7) callback-форма.

### 1.4 Производительность мобилы
- Видео — `preload="metadata"`, не autoplay на slow-3g (через `connection.effectiveType` гард).
- Все новые `<img>` с `width/height` для CLS = 0.
- Poster-кадр (jpg ≤30 KB) обязателен для видео.

---

## Задание 2 — страницы «Кроты» и «Участки»: убрать притемнение + добавить контент + центровка

### 2.1 Снятие притемнения фона (главная + ServicePage)

**`src/components/Hero.tsx` (главная):**
- Заменить overlay строку 105 — текущий `from-background/70 via-background/50 to-background/30` слишком тёмный.
- Новый: `from-background/35 via-background/15 to-transparent dark:from-background/55 dark:via-background/30 dark:to-background/10` — фото становится ярким, текст остаётся читаемым за счёт текстового drop-shadow.
- Добавить `text-shadow` через inline-style на H1/subtitle для контраста на ярком фоне.

**`src/pages/ServicePage.tsx` (кроты + участки + остальные):**
- Строки 210-229: blur c `3px` (desktop) → `1.5px`, opacity с `0.65` → `0.85`. На мобиле blur `1px`→`0.5px`, opacity `0.95` оставить.
- Удалить второй overlay-слой (строки 228-229), оставить ТОЛЬКО легкий градиент `from-background/45 via-background/15 to-transparent`.
- В тёмной теме — `dark:from-background/65`.

### 2.2 Центровка блоков на десктопе (фикс по скринам)
На скринах 2-3 видно: блок «Когда нужно» в 3 колонки, но 4-я и 5-я карточки прижаты влево, а правая колонка пустая.

Фикс в `ServicePage.tsx` (строки ~385-399):
- Заменить `grid sm:grid-cols-2 lg:grid-cols-3` → когда `reasons.length === 5` использовать `lg:grid-cols-3` с `[&>*:nth-child(4)]:lg:col-start-1 [&>*:nth-child(5)]:lg:col-start-2` или просто адаптивную сетку `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5` для 5 элементов.
- Универсально: добавить `justify-items-center` + `mx-auto` на сами Card, либо переключать колонки по `reasons.length` (4→4col, 5→5col компактных, 6→3col).

Аналогично пройти по `MoleCityPage`/`ServiceLandingUchastkiPage` если используется тот же шаблон.

### 2.3 Расширение текстового контента — УЧАСТКИ (`obrabotka-uchastkov`)

В `src/data/services.ts` для `obrabotka-uchastkov` расширить блоки:

**Новая секция «Препараты и безопасность»** (рендерим в ServicePage если `service.chemistryInfo` есть):
- Список применяемых препаратов: Цифокс, Сипаз-Супер, Медилис-Ципер, Дельта Зона — с краткой характеристикой и сроком действия (1-2 месяца).
- Класс опасности: 4-й (малоопасные для человека и питомцев при соблюдении регламента).
- Безопасность для детей/животных: можно выходить через 30-60 мин, газон поливать через 24ч.
- Сертификаты Роспотребнадзора, СанПиН-соответствие.

**Расширить `description`:** ~600 → ~1500 символов с описанием технологии холодного/горячего тумана, барьерной обработки периметра, расхода (50 мл/м²), кратности (1-3 обработки за сезон).

**FAQ +5 вопросов:** «Какие препараты используете?», «Безопасно ли для пчёл?», «Когда можно гулять с собакой?», «Через сколько действие препарата?», «Нужно ли уезжать с участка?».

### 2.4 Расширение контента — КРОТЫ (`borba-s-krotami`)

**Новая секция «Технология фумигации и вскрытия кротовин»**:
- **Этап 1 — Диагностика:** обход участка, картирование активных тоннелей (свежий грунт, проседание).
- **Этап 2 — Аккуратное вскрытие кротовин:** надрез 5-7 см над активным ходом без разрушения тоннеля, сохранение грунта рядом для обратной засыпки.
- **Этап 3 — Фумигация:** введение фосфида алюминия / газовой смеси через специальный зонд, газ проникает на 30-50 м по системе ходов.
- **Этап 4 — Закладывание тоннелей:** аккуратное возвращение грунта, маскировка вскрытий, газон не страдает.
- **Этап 5 — Барьерная защита:** установка ультразвуковых отпугивателей по периметру + сетка-барьер от соседских кротов.
- **Результат:** 100% уничтожение колонии за 1 выезд, газон восстанавливается за 7-10 дней.

**Расширить `description`** (текущий ~400 → ~1400 символов): рассказ почему ловушки и народные методы не работают, отличие фумигации от отравленных приманок, сезонность (апрель-октябрь — пик).

**FAQ +5 вопросов:** «Безопасна ли фумигация для домашних животных?», «Останутся ли следы на газоне?», «Что если кроты вернутся?», «Сколько кротовин обычно вскрываете?», «Работаете ли с глинистой почвой?».

### 2.5 Рендеринг новых блоков
В `ServicePage.tsx` добавить условные секции после блока «О услуге»:
- `{service.chemistryInfo && <ChemistrySection data={service.chemistryInfo} />}` — карточки препаратов + класс опасности + safety-чеклист.
- `{service.detailedProcess && <DetailedProcessSection steps={service.detailedProcess} />}` — таймлайн с иконками этапов.

Создать 2 новых компонента: `src/components/service/ChemistrySection.tsx`, `src/components/service/DetailedProcessSection.tsx`.

### 2.6 Расширить тип `ServicePage` в `src/data/services.ts`
```ts
chemistryInfo?: {
  preparations: { name: string; type: string; duration: string }[];
  safetyClass: string;
  safetyFacts: string[];
};
detailedProcess?: { step: number; title: string; description: string; iconKey: string }[];
```

---

## Технические детали (для разработчика)

**Файлы на изменение:**
- `src/components/Hero.tsx` — overlay строка 105
- `src/pages/ServicePage.tsx` — overlay 210-229, центровка grid 385-399, рендер новых секций после ~432
- `src/pages/ServicePestPage.tsx` — мобильный rework hero 189-282, новый блок real-photos для klopy
- `src/data/services.ts` — расширить `borba-s-krotami` и `obrabotka-uchastkov` (description, faq, chemistryInfo, detailedProcess)
- `src/data/pests.ts` — добавить `realPhotos` массив для klopy с путями
- Новые: `src/components/service/ChemistrySection.tsx`, `DetailedProcessSection.tsx`, `MobileRealHeroVisual.tsx`

**Ассеты:**
- `public/images/pests/real/bedbug-mattress-real.jpg` (~150 KB после оптимизации)
- `public/images/pests/real/bedbug-treatment-real.jpg` (~150 KB)
- `public/images/pests/real/bedbug-mattress-real.webp` + `.webp` для второго
- `public/videos/bedbug-process.mp4` (CRF 26, 720p, без аудио, ≤3 MB)
- `public/videos/bedbug-process-poster.jpg`

**SSG валидация:** убедиться что `scripts/verify-build.js` не падает после изменений (новые секции, видео-теги).

**Проверка после реализации:**
- Лайтхаус мобила: LCP не должен вырасти из-за нового видео (preload=metadata, не autoplay до viewport).
- Снять скрины hero на /, /uslugi/borba-s-krotami, /uslugi/obrabotka-uchastkov, /uslugi/dezinsekciya/klopy, /uslugi/dezinsekciya/tarakany — сравнить «до/после».
