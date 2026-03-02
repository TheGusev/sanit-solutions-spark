
- Быстрая диагностика (что уже проверено):
  - `.github/workflows/docker-build.yml` не содержит отдельного шага `node scripts/verify-build.js`, `npm run verify` или `npm run build`.
  - CI падает не из-за отдельного шага verify, а из-за Dockerfile (`RUN npm run build`) + `package.json`, где `build` = `vite build && node scripts/verify-build.js`.
  - Поэтому verify запускается внутри docker build и валит workflow.

- Что сделать:
  1) `package.json`
     - Изменить:
       - `"build": "vite build && node scripts/verify-build.js"` → `"build": "vite build"`
     - Оставить:
       - `"verify": "node scripts/verify-build.js"` (отдельный ручной запуск).
  2) `.github/workflows/docker-build.yml`
     - Отдельного verify-step там нет, удалять/смягчать нечего.
     - Файл оставить без функциональных изменений (не добавлять `continue-on-error` на `build-and-push`, чтобы не маскировать реальные ошибки сборки).
  3) Publish
     - Опубликовать изменения (Publish), чтобы GitHub Actions стартовал новый run.

- Проверка после Publish:
  - В Actions у `Build and Push Docker Image` должен быть green статус.
  - В логах job больше не должно быть запуска `node scripts/verify-build.js` в процессе `npm run build`.
  - На сервере после `/root/deploy.sh`:
    - `curl .../uslugi/dezinsekciya/klopy/` → `200`
    - `curl .../uslugi/dezinsekciya/blohi/` → `200`
    - `curl .../otzyvy/` → `200`

- Важная техремарка на следующий шаг:
  - `scripts/verify-build.js` написан в CommonJS (`require`) при `"type": "module"` в `package.json`.
  - После отвязки от `build` CI перестанет падать, но `npm run verify` может оставаться сломанным.
  - Следующим отдельным фикс-пакетом: перевести `verify-build.js` в ESM (`import ... from 'node:...'`) или переименовать файл в `.cjs`.
