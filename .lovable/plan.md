

# Исправление GitHub Actions: npm ci → bun install

## Проблема

Workflow `daily-indexnow.yml` использует `npm ci`, который строго проверяет peer dependencies. Пакет `next-themes@0.3.0` требует React 16/17/18, а в проекте React 19 — конфликт, сборка падает.

Проект использует **bun** (есть `bun.lock` и `bun.lockb`), поэтому нужно переключить workflow на bun.

## Изменение

**Файл:** `.github/workflows/daily-indexnow.yml`

Заменить setup-node + npm ci на setup-bun + bun install:

```yaml
name: Daily IndexNow Submission

on:
  schedule:
    - cron: '0 3 * * *'
  workflow_dispatch:

jobs:
  submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install --frozen-lockfile

      - run: bun run build

      - name: Send IndexNow batch
        run: node scripts/send-indexnow-stateless.mjs
```

Bun не блокирует на peer dependency конфликтах, плюс это родной менеджер пакетов проекта.

