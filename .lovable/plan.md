

## Почему Lighthouse постоянно красный

**Проблема**: В workflow `lighthouse.yml` отсутствует шаг `actions/checkout@v4`. Экшен `treosh/lighthouse-ci-action@v11` требует checkout для корректной работы с workspace — без него он крашится ещё до запуска проверок. Также нет явных порогов (assertions) — при дефолтном поведении экшен может падать если не может записать результаты.

**Решение**: Добавить `checkout` и настроить разумные пороги, чтобы workflow был зелёным при нормальных показателях и предупреждал только о реальных проблемах.

### Изменения в `.github/workflows/lighthouse.yml`

1. **Добавить `actions/checkout@v4`** перед Lighthouse — это стандартное требование экшена
2. **Добавить `temporaryPublicStorage: true`** — надёжное хранение результатов без внешних сервисов
3. **Добавить `configPath`** с файлом конфигурации, задающим минимальные пороги

### Создать `.lighthouserc.json` в корне проекта

Файл с реалистичными порогами для production-сайта на SPA/SSG:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.5 }],
        "categories:accessibility": ["error", { "minScore": 0.7 }],
        "categories:best-practices": ["error", { "minScore": 0.7 }],
        "categories:seo": ["error", { "minScore": 0.85 }]
      }
    }
  }
}
```

- Performance на `warn` (не fail) с порогом 0.5 — SPA с большим JS бандлом редко набирает 90+
- SEO на `error` 0.85 — это критично для бизнеса, должен быть высоким
- Accessibility и Best Practices на `error` 0.7 — разумный минимум

### Итоговый workflow

```yaml
steps:
  - uses: actions/checkout@v4          # ← ДОБАВИТЬ
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
      configPath: ./.lighthouserc.json   # ← ДОБАВИТЬ
      temporaryPublicStorage: true       # ← ДОБАВИТЬ
      uploadArtifacts: true
```

### Что НЕ трогаем
- Никакие компоненты, маршруты, стили
- Docker build, SSG, Supabase — всё остаётся как есть
- Это только CI-конфигурация

