
Коротко и честно: ты прав, я ошибся в диагностике несколько раз. Ниже — глубокий разбор по коду и где именно была моя ошибка.

1) Что подтвердил аудит кода (факты)
- Маршрут `/uslugi/dezinsekciya/klopy` реально есть в генераторе SSG:
  - `vite-plugin-ssg.ts` → `dezinsekciyaPestSlugs` содержит `klopy`
  - `outputPath` = `uslugi/dezinsekciya/klopy/index.html`
- SSR-роутинг для этого URL тоже корректный:
  - `AppSSR.tsx` → `/uslugi/:parentSlug/:subSlug` → `ServiceRouteResolver`
  - `ServiceRouteResolver.tsx` → `getPestBySlug('klopy')` → `ServicePestPage`
- Docker copy корректный:
  - `Dockerfile` копирует `/app/dist` в `/usr/share/nginx/html`
- Nginx корректно отдает статические SSG-файлы, если они есть.

2) Почему на сервере есть `/uslugi/dezinsekciya/index.html`, но нет `/uslugi/dezinsekciya/klopy/index.html`
- В `public/uslugi/dezinsekciya/index.html` файл есть изначально (ручной статический файл).
- В `public/uslugi/dezinsekciya/klopy/index.html` файла нет.
- Значит твое наблюдение идеально совпадает со сценарием: в образ попал “базовый public”, а SSG-артефакт `klopy/index.html` не был сгенерен/не попал в итоговый `dist`.

3) Где я допустил ошибку
- Ошибка #1: я слишком долго держался за гипотезу “stale image”, вместо того чтобы сразу признать твой серверный `ls` как более сильное доказательство.
- Ошибка #2: я трактовал smoke-check в GitHub Actions как гарантию качества `latest`. Это неверно по текущему workflow:
  - сначала `build-push-action` уже пушит `latest` и `sha`,
  - и только потом выполняется smoke-check.
  - То есть даже при провале smoke-check “битый” `latest` уже мог быть опубликован.
- Ошибка #3: я не потребовал сразу артефактную проверку уровня `find dist ...` как единственный источник истины для SSG.

4) Наиболее вероятная первопричина сейчас
- Не “Nginx/Docker”, а именно разрыв в цепочке сборки артефактов:
  - либо SSG не завершился в том конкретном билде,
  - либо был использован образ из запуска, где SSG-артефакты не были в `dist`,
  - либо workflow запушил `latest` до прохождения smoke-check и он оказался дефектным.

5) План исправления (конкретный, чтобы закрыть проблему окончательно)
Шаг A. Сделать CI атомарным (чтобы битый `latest` никогда не публиковался)
- Перестроить workflow в 2 фазы:
  1) build без push (локально на runner),
  2) smoke-check по локальному образу,
  3) push в Docker Hub только если smoke-check успешен.

Шаг B. Добавить “жесткое доказательство артефактов” в CI
- После `npm run build` внутри docker build/CI логировать:
  - `find dist -maxdepth 5 -type f -path "*uslugi/dezinsekciya*"`
  - и явный check:
    - `test -f dist/uslugi/dezinsekciya/klopy/index.html`
- При отсутствии файла — fail build.

Шаг C. Добавить пост-push верификацию по digest
- Проверять именно `IMAGE@sha256:...`, а не плавающий `latest`.
- Логировать:
  - `ls /usr/share/nginx/html/uslugi/dezinsekciya/klopy`
  - `find /usr/share/nginx/html/uslugi -maxdepth 4 -name index.html | wc -l`

Шаг D. Убрать маскировку проблемы
- В отчете CI отдельно показывать:
  - “public static files count”
  - “SSG generated files count”
- Чтобы `/public/uslugi/dezinsekciya/index.html` не создавал ложное ощущение, что SSG ок.

6) Технические детали (для прозрачности)
```text
Сейчас pipeline:
[build+push latest] -> [smoke-check]
Проблема: latest уже опубликован до smoke-check

Нужно:
[build local, no push] -> [smoke-check local image] -> [push latest + sha]
Гарантия: в registry попадает только проверенный образ
```

Если одобряешь, следующим шагом я дам точный план правок по `.github/workflows/docker-build.yml` (без воды, с конкретными командами), чтобы это больше никогда не повторялось.
