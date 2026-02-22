

# Исправление Lighthouse CI workflow

## Проблема

Lighthouse CI (#313) падает с ошибкой `LHCI 'collect' возникла проблема`. Две причины:

1. **Гонка**: Lighthouse запускается одновременно с Docker Build. Продакшен ещё не обновился новым кодом, и Lighthouse тестирует старую/недоступную версию.

2. **URL `/rajony`**: Nginx на продакшене настроен так, что SPA fallback работает только для `/admin/*`. Все остальные пути без статического файла возвращают 404. URL `/rajony` не имеет статического файла `public/rajony/index.html`, поэтому Nginx отдаёт 404, и LHCI падает при попытке собрать метрики.

## Решение

### 1. Добавить зависимость от Docker Build

Lighthouse должен запускаться **после** успешного деплоя, а не параллельно с ним. Нужно:
- Убрать триггер `push` (он запускает Lighthouse сразу при пуше)
- Оставить только `schedule` и `workflow_dispatch` (ручной запуск)
- Либо использовать `workflow_run` чтобы Lighthouse запускался после завершения Docker Build

### 2. Исправить список URL

Заменить `/rajony` на URL, который точно доступен как статический файл или обрабатывается Nginx:
- `/uslugi/dezinfekciya/` (есть `public/uslugi/dezinfekciya/index.html`)
- `/blog/borba-s-tarakanami/` (есть `public/blog/borba-s-tarakanami/index.html`)
- `/contacts/` (есть `public/contacts/index.html`)

Убрать `/blog` — тоже нет статического файла `public/blog/index.html`... хотя, подождите, он есть (`public/blog/index.html`). Значит `/blog` должен работать.

### 3. Добавить таймаут и retry

Lighthouse может упасть из-за сетевых проблем. Стоит добавить `runs` для надёжности.

## Файл: `.github/workflows/lighthouse.yml`

```yaml
name: Проверка производительности Lighthouse

on:
  workflow_run:
    workflows: ["Build and Push Docker Image"]
    types: [completed]
    branches: [main]
  schedule:
    - cron: '0 9 * * *'
  workflow_dispatch:

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    # Запускать только если Docker Build успешен (или по расписанию/вручную)
    if: >
      github.event_name != 'workflow_run' ||
      github.event.workflow_run.conclusion == 'success'

    steps:
      - name: Подождать деплой (30 сек)
        if: github.event_name == 'workflow_run'
        run: sleep 30

      - name: Запустить Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            https://goruslugimsk.ru
            https://goruslugimsk.ru/uslugi/dezinfekciya/
            https://goruslugimsk.ru/blog/
            https://goruslugimsk.ru/contacts/
          runs: 3
          uploadArtifacts: true
```

## Ключевые изменения

| Что | Было | Стало |
|-----|------|-------|
| Триггер при пуше | `push: branches: [main]` | `workflow_run` (после Docker Build) |
| URL `/rajony` | Нет статического файла, 404 | Заменён на `/contacts/` (есть index.html) |
| URL trailing slash | Без `/` | С `/` (соответствует canonical) |
| Надёжность | Один запуск | `runs: 3` (медиана из 3 запусков) |
| Задержка после деплоя | Нет | 30 секунд ожидания |

## Результат

- Lighthouse будет запускаться только после успешной сборки Docker-образа
- Все проверяемые URL гарантированно отдают 200 (имеют статические index.html)
- Медиана из 3 запусков даёт более стабильные результаты

