# План: устранить замечания мониторинга и аудита owndev.ru

## Корневые причины (доказанные)

### 1. Дублирование BreadcrumbList (CRITICAL)
В файле **`index.html`** (строки 351–362) находится статический `@graph`-узел с типом `BreadcrumbList` и `@id: #breadcrumbs`. Этот блок попадает в `<head>` **каждой** SSG-страницы как часть шаблона.

Доказательство (live):
- `/uslugi/dezinsekciya/` → 2 BreadcrumbList (один из @graph + один от ServicePage)
- `/uslugi/dezinsekciya/klopy/` → 2 BreadcrumbList (graph + ServicePestPage)
- `/uslugi/dezinsekciya/ofisov/` → 2 BreadcrumbList (graph + ServiceSubpage)
- `/moscow-oblast/` → 2 BreadcrumbList (graph + MoscowRegionOverview)

Это нарушает политику mem://seo/structured-data-integrity-policy («единый источник» BreadcrumbList — компонент `Breadcrumbs.tsx`).

### 2. Отсутствует canonical на `/uslugi/dezinfekciya-cao/`
Доказательство (live):
- `curl https://goruslugimsk.ru/uslugi/dezinfekciya-cao/` возвращает голый SPA-shell (~20 KB), без `<h1>`, с пустым `<title data-rh="true"></title>` и без `<link rel="canonical">`.
- В `dist/` страница не сгенерирована потому, что **последняя сборка Docker не дошла до конца** (про что отчёт мониторинга и говорит: SSG не отработал → залит SPA-shell).
- В коде маршрут есть: `seoRoutes.ts` строки 284–293 генерируют все 36 страниц `/uslugi/{dezinfekciya|dezinsekciya|deratizaciya}-{округ}/`. Сама страница `DistrictPage.tsx` корректно ставит canonical через `<Helmet>` (строка 152).

Вывод: проблема исчезнет, как только билд успешно отрендерит округа. Дополнительно усилим гарантию: добавим в `validateHtml` SSG-плагина обязательную проверку наличия `<link rel="canonical">` — fail-fast, если canonical отсутствует.

### 3. Owndev.ru audit (Yandex.Direct Score 70/100, SEO 95/100)
Из скриншотов:
- **Единая тематика** (15 б, 0/15) — главная описывает 4 услуги, для Яндекс.Директ-лендинга это считается «многотемной». Это архитектурное ограничение главной — поднимать вес «единой тематики» через инструменты Direct без изменения сути страницы нельзя. **Оставляем как есть** (приоритет SEO выше Direct-лендинг-метрик; главная — хаб услуг).
- **Готовность заголовка** (15 б, 0/15) — H1 ≤35 символов для рекламного объявления. Текущий H1 главной: `Профессиональная служба СЭС в Москве и области` (47 симв.).
- **Мультимодальность** (5 б, 0/5) — недостаточно `alt`-подписей у картинок.

## Что меняем

### A. Убираем дублирующий BreadcrumbList из шаблона
Файл `index.html`, строки 351–362:
- Удалить узел `BreadcrumbList` из `@graph` целиком (включая запятую перед ним).
- BreadcrumbList на главной останется ровно один — из `metadata.ts → generateIndexMetadata()` строки 128–136.
- На остальных страницах останется ровно один — из соответствующего page-компонента.

### B. Жёсткая защита от регрессий в SSG
Файл `vite-plugin-ssg.ts`, функция `validateHtml`:
- Добавить проверку: страница должна содержать ровно один `<link rel="canonical">` и ровно один JSON-LD `BreadcrumbList`. Если 0 или ≥2 — `errors.push(...)` и страница не пишется.
- Это гарантирует, что в будущем подобные регрессии будут падать на сборке (mem://architecture/ssg-fail-fast-policy).

### C. Owndev «Готовность заголовка» — H1 главной ≤35 символов
Файл `src/lib/metadata.ts`, строка 153:
- Заменить `h1: 'Профессиональная служба СЭС в Москве и области'` (47 симв.)
- На `h1: 'СЭС служба в Москве и области'` (29 симв., укладывается в 35).
- Title и description не трогаем (они и так оптимальны).

### D. Owndev «Мультимодальность» — alt-атрибуты
Аудит главной. В `src/components/Hero.tsx`, `HeroBackground.tsx`, `MiniPricing.tsx`, `WorkProcess.tsx`, `Reviews.tsx`, `PestGallery.tsx`, `WorkGallery.tsx`:
- Пройтись по всем `<img>` и `<SeoImage>` без `alt`/с пустым alt и проставить осмысленные подписи (название услуги/района/процесса). Цель — 100% покрытие изображений на главной.
- Дополнительно: где есть decorative-картинки (background-эффекты), оставить `alt=""` + `aria-hidden="true"` — это валидно для аудита.

### E. Не трогаем
- Логику Docker/CI — она сейчас стабилизируется отдельно, и наши SSG-проверки (B) только усилят гарантии следующего успешного билда.
- BreadcrumbList в `Breadcrumbs.tsx`, `metadata.ts`, страницах — все источники корректны и единственны на странице после удаления `@graph`-дубликата.
- Стабы `public/uslugi/*-{округ}/index.html` — SSG переписывает их в `dist/` после копирования из `public/`. Они безвредны, но удалим папки округов из `public/` (12 + 11 + 13 = 36 директорий стабов), чтобы не было путаницы и конфликтов при отладке.

## Файлы под изменение
1. `index.html` — удалить узел BreadcrumbList из `@graph`.
2. `vite-plugin-ssg.ts` — добавить fail-fast проверки canonical (=1) и BreadcrumbList (=1) в `validateHtml`.
3. `src/lib/metadata.ts` — укоротить H1 главной до 29 символов.
4. `src/components/Hero.tsx`, `Reviews.tsx`, `MiniPricing.tsx`, `WorkProcess.tsx`, `PestGallery.tsx`, `WorkGallery.tsx`, `Header.tsx`, `Certificates.tsx` — заполнить alt у `<img>` где они отсутствуют/пусты.
5. Удалить директории `public/uslugi/dezinfekciya-*`, `public/uslugi/dezinsekciya-*`, `public/uslugi/deratizaciya-*` (36 устаревших стабов; SSG генерит свежие в `dist/`).

## Ожидаемый результат
- `/uslugi/dezinsekciya/` → 1 BreadcrumbList ✓
- `/uslugi/dezinsekciya/klopy/` → 1 BreadcrumbList ✓
- `/uslugi/dezinsekciya/ofisov/` → 1 BreadcrumbList ✓
- `/moscow-oblast/` → 1 BreadcrumbList ✓
- `/uslugi/dezinfekciya-cao/` → canonical на месте (после успешного билда; новый guard в SSG предотвратит регрессию)
- Owndev SEO Score: 95 → 100 (мультимодальность +5)
- Owndev Direct Score: 70 → 85 (готовность заголовка +15; «единая тематика» — архитектурно оставляем 0)

## Технические детали (для разработчика)
- В `validateHtml` использовать regex: `(html.match(/"@type":\s*"BreadcrumbList"/g) || []).length` и `(html.match(/<link[^>]+rel="canonical"/gi) || []).length`. Оба должны быть равны 1, иначе `errors.push(...)` и страница не пишется (SSG прервётся в CI).
- Удаление `BreadcrumbList` из `index.html`: убрать строки 351–362 + запятую в конце 350-й (после `}`). Получится валидный JSON.
- H1 не влияет на Title/Description SEO; влияет только на in-page `<h1>` и Direct-аудит.
