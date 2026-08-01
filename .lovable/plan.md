# Замена номера телефона на 89069989888

## Задача
Заменить единый номер телефона сайта с `8-495-018-18-17` на `8-906-998-98-88` (мобильный). Оставить `Telegram @one_help` как основной канал текстовой связи (без изменений).

## Проверка текущего состояния
- `index.html` — частично уже обновлён: `+7 (906) 998-98-88` в meta description и `+7-906-998-98-88` в schema.
- `public/.well-known/security.txt` — уже содержит `tel:+79069989888`.
- Остальные файлы (src/components, src/data, src/pages, src/lib, public/*.html, public/llms*.txt) всё ещё используют старый номер.

## Что нужно сделать
1. **Центральный источник истины** — обновить `src/lib/seo.ts`:
   - `phone: '8-906-998-98-88'`
   - `phoneClean: '89069989888'`
2. **Компоненты** — заменить во всех местах, где телефон захардкожен:
   - `src/components/Header.tsx`, `Footer.tsx`, `Hero.tsx`, `MobileQuickCTA.tsx`, `LeadFormModal.tsx`, `HeroCallbackForm.tsx`, `FloatingButtons.tsx`, `DesktopStickySidebar.tsx`, `ExitIntentPopup.tsx`, `ErrorBoundary.tsx`, `FinalCTA.tsx`, `Calculator.tsx`, `CompactRequestModal.tsx`, `TermsContent.tsx`
3. **Страницы** — `Contacts.tsx`, `DistrictsOverview.tsx`, `ServicePage.tsx`, `NotFound.tsx`, `ServiceSubpage.tsx`, `ServiceLandingUchastkiPage.tsx`, `ServiceSESPage.tsx`.
4. **Генераторы и метаданные** — `src/lib/contentGenerator.ts`, `src/lib/metadata.ts`, `src/lib/seo.ts`.
5. **Данные услуг** — `src/data/services.ts`, `src/data/serviceSubpages.ts` (metaDescription и FAQ).
6. **Статические HTML** — `public/uslugi/*/index.html`, `public/blog/index.html`, `public/contacts/index.html`, `public/privacy/index.html`, `public/terms/index.html` и т.д.
7. **LLMS-манифесты** — `public/llms.txt`, `public/llms-full.txt`.
8. **JSON-LD** — `src/pages/Contacts.tsx`, `ServicePage.tsx`, `ServiceSubpage.tsx`, `ServiceSESPage.tsx`, `ServiceLandingUchastkiPage.tsx` привести к формату `+7-906-998-98-88`/`+79069989888`.

## Формат замены
- Визуальный формат: `8-906-998-98-88` (заменяет `8-495-018-18-17`).
- tel-ссылки: `tel:89069989888` (заменяет `tel:84950181817`).
- Schema.org E.164: `+79069989888` (заменяет `+74950181817`).

## Верификация
1. После правок запустить `rg "495-018-18-17|84950181817|74950181817" src/ public/ index.html` — должно быть 0 результатов.
2. Запустить `bun run build` (или аналогичную команду) — сборка должна пройти без ошибок.
3. Проверить `src/lib/seo.ts` и 3–5 случайных файлов вручную.

## Риски
- SEO-мета и schema.org в public HTML не пересоберутся автоматически, если SSG не пересоберёт. Важно запустить полную сборку.
- Старые номера могут остаться в CDN/кэше. После деплоя нужно будет проверить продакшен.
