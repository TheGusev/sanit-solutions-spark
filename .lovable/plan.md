

## Проверка завершена: оба файла уже исправлены

Я проверил текущее состояние обоих файлов — **все правки из предыдущего сообщения уже применены**.

### `src/AppSSR.tsx` — все роуты на месте

Текущий файл содержит **все 19 публичных роутов** из `App.tsx`:

| Роут | Компонент | Статус |
|------|-----------|--------|
| `/` | IndexSSR | ✓ |
| `/blog`, `/blog/:slug` | Blog, BlogPost | ✓ |
| `/privacy`, `/terms` | Privacy, Terms | ✓ |
| `/contacts`, `/team` | Contacts, Team | ✓ |
| `/sluzhba-dezinsekcii` | ServiceSESPage | ✓ |
| `/otzyvy` | ReviewsPage | ✓ |
| `/uslugi/po-okrugam-moskvy` | DistrictsOverview | ✓ |
| `/rajony`, `/rajony/:slug` | NeighborhoodsOverview, NeighborhoodPage | ✓ |
| `/moscow-oblast`, `/:citySlug`, `/:citySlug/:serviceSlug` | MoscowRegion* | ✓ |
| `/uslugi/:service/:segment2/:segment3` | ThreeSegmentRouteResolver | ✓ |
| `/uslugi/obrabotka-uchastkov` | ServiceLandingUchastkiPage | ✓ |
| `/uslugi/:parentSlug/:subSlug` | ServiceRouteResolver | ✓ |
| `/uslugi/:slug` | ServicePage | ✓ |

Порядок корректный — статические перед динамическими.

### `vite-plugin-ssg.ts` — все массивы синхронизированы

| Массив | В seoRoutes | В SSG-плагине | Статус |
|--------|-------------|---------------|--------|
| dezinsekciyaPestSlugs | 11 | 11 | ✓ |
| deratizaciyaPestSlugs | 3 | 3 | ✓ |
| serviceSubpageRoutes | 18 | 18 | ✓ |
| objectSlugs | 11 | 11 | ✓ |
| servicesForObjects | 5 | 5 | ✓ |
| moscowRegionCitySlugs | 14 | 14 | ✓ |
| neighborhoodSlugs | 130 | 130 | ✓ |
| blogSlugs | 227 | 227 | ✓ |
| staticRoutes | 8 (вкл. СЭС, Отзывы, Участки, Terms) | 8 | ✓ |
| Дезинфекция по районам | 130 маршрутов | 130 маршрутов | ✓ |

### Что нужно сделать

**Код уже исправлен. Осталось пересобрать Docker-контейнер:**

```text
docker build -t goruslugimsk .
docker compose up -d
```

После пересборки SSG сгенерирует ~900-1000 HTML-файлов в `dist/`, включая `dist/uslugi/dezinsekciya/klopy/index.html`, и 404 при F5 исчезнет.

Если после пересборки 404 всё ещё появляется — нужно проверить логи билда (`docker build` output) на строки `❌` — это покажет, какие конкретно страницы не прошли валидацию SSG.

