

# Усиление внутренней перелинковки на сайте

## Анализ текущего состояния

### Где InternalLinks уже стоит (10 страниц):
NchPage, MoscowRegionCityPage, MoscowRegionServicePage, MoleCityPage, ServiceDistrictPage, ServiceObjectPage, DistrictPage, BlogPost, NeighborhoodPage, ServicePestPage

### Где InternalLinks НЕТ (8 коммерческих страниц):
| Страница | Тип | Проблема |
|----------|-----|----------|
| **ServicePage.tsx** | Главные услуги (8 шт) | 0 ссылок на смежные |
| **ServiceSubpage.tsx** | Методы (17 шт) | 0 ссылок |
| **ServiceLandingUchastkiPage.tsx** | Обработка участков | 0 ссылок |
| **ServiceSESPage.tsx** | Служба дезинсекции | 0 ссылок |
| **DistrictsOverview.tsx** | Обзор округов | 0 ссылок на блог/районы |
| **MoscowRegionOverview.tsx** | Обзор МО | 0 ссылок |
| **NeighborhoodsOverview.tsx** | Обзор районов | 0 ссылок |
| **Blog.tsx** | Листинг блога | 0 ссылок на услуги |

### Проблемы в самом InternalLinks:
1. **Пустой MoleCityPage** — `<InternalLinks />` без пропсов, генерит только 2 ссылки на главные услуги
2. **Только dezinsekciya/deratizaciya** — вредители dezinfekciya, borba-s-krotami, obrabotka-uchastkov не участвуют
3. **Нет ссылок на блог** — компонент не знает про статьи
4. **Нет ссылок на /otzyvy, /rajony, /moscow-oblast** — обзорные хабы без входящих ссылок из перелинковки
5. **Города МО — только первые 2** — всегда Химки и Мытищи, остальные 12+ городов — 0 входящих

### Итого: ~1700+ страниц, из них ~200+ коммерческих без блока перелинковки

---

## План усиления (2 части)

### Часть 1: Расширить компонент InternalLinks

**Новые типы ссылок:**
- `blog` — 1-2 релевантные статьи блога (по тегам/категории)
- `hub` — ссылки на обзорные хабы (/rajony, /moscow-oblast, /otzyvy)
- `moleCity` — города кротов (для borba-s-krotami страниц)

**Исправления:**
- Добавить пропс `currentMoleCity` для MoleCityPage
- Рандомизировать города МО (не всегда первые 2, а по близости/релевантности)
- Добавить borba-s-krotami и obrabotka-uchastkov в пул вредителей/услуг
- Увеличить `maxLinks` по умолчанию до 16

### Часть 2: Добавить InternalLinks на 8 страниц

| # | Файл | Пропсы |
|---|------|--------|
| 1 | `ServicePage.tsx` | `currentService={service.slug}` |
| 2 | `ServiceSubpage.tsx` | `currentService={parentService}` |
| 3 | `ServiceLandingUchastkiPage.tsx` | `currentService="obrabotka-uchastkov"` |
| 4 | `ServiceSESPage.tsx` | `currentService="dezinsekciya"` |
| 5 | `DistrictsOverview.tsx` | ссылки на блог + МО + услуги |
| 6 | `MoscowRegionOverview.tsx` | ссылки на блог + округа + услуги |
| 7 | `NeighborhoodsOverview.tsx` | ссылки на услуги + блог |
| 8 | `Blog.tsx` | ссылки на услуги + районы |
| 9 | `MoleCityPage.tsx` | FIX: передать `currentService="borba-s-krotami" currentCity={city.slug}` |

### Часть 3: Контекстные блог-ссылки в InternalLinks

Добавить в компонент логику подбора 1-2 статей блога по ключевым словам:
- Страница дезинсекции → статья «Клопы в квартире», «Борьба с тараканами»
- Страница дератизации → статья «Грызуны в доме»
- Страница обработки участков → статья «Борщевик закон 2026»
- Кроты → статьи mole-geo

---

## Файлы (10 файлов)

| # | Файл | Правки |
|---|------|--------|
| 1 | `src/components/InternalLinks.tsx` | Расширить: +blog, +hub, +moleCity типы; рандомизация городов МО; borba-s-krotami/obrabotka в пул; maxLinks=16 |
| 2 | `src/pages/ServicePage.tsx` | Добавить `<InternalLinks currentService={service.slug} />` перед Footer |
| 3 | `src/pages/ServiceSubpage.tsx` | Добавить `<InternalLinks currentService={parentSlug} />` |
| 4 | `src/pages/ServiceLandingUchastkiPage.tsx` | Добавить `<InternalLinks currentService="obrabotka-uchastkov" />` |
| 5 | `src/pages/ServiceSESPage.tsx` | Добавить `<InternalLinks currentService="dezinsekciya" />` |
| 6 | `src/pages/DistrictsOverview.tsx` | Добавить `<InternalLinks />` с ссылками на блог и МО |
| 7 | `src/pages/MoscowRegionOverview.tsx` | Добавить `<InternalLinks />` |
| 8 | `src/pages/NeighborhoodsOverview.tsx` | Добавить `<InternalLinks />` |
| 9 | `src/pages/Blog.tsx` | Добавить `<InternalLinks />` с ссылками на услуги |
| 10 | `src/pages/MoleCityPage.tsx` | Исправить пустые пропсы → `currentService="borba-s-krotami" currentCity={city.slug}` |

## Ожидаемый результат

- ~200 страниц получат 12-16 контекстных внутренних ссылок
- Блог-статьи начнут получать входящие ссылки с коммерческих страниц
- Обзорные хабы (/rajony, /moscow-oblast, /otzyvy) получат массу входящих
- Города МО распределятся равномерно вместо перекоса на Химки/Мытищи
- Страницы кротов будут перелинкованы между собой

