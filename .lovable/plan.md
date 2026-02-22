
# Глобальные правки: убрать WhatsApp + заменить телефон

## Задача 1: Убрать WhatsApp (14 файлов)

### Компоненты -- удалить кнопку WhatsApp целиком

| Файл | Что удалить |
|------|-------------|
| `src/components/FloatingButtons.tsx` | `handleWhatsAppClick` + WhatsApp кнопка (SVG, div) |
| `src/components/MobileQuickCTA.tsx` | `handleWhatsApp` + кнопка WhatsApp, убрать импорт `MessageCircle` |
| `src/components/FinalCTA.tsx` | `handleWhatsApp` + кнопка WhatsApp, убрать импорт `MessageCircle` |
| `src/components/DesktopStickySidebar.tsx` | `handleWhatsApp` + кнопка WhatsApp в сетке (оставить только Telegram) |
| `src/components/LeadFormModal.tsx` | `handleWhatsApp` + кнопка "Написать в WhatsApp" |
| `src/components/CompactRequestModal.tsx` | `handleWhatsApp` + кнопка "Написать в WhatsApp", убрать `MessageSquare` |
| `src/components/QuickCallForm.tsx` | `handleWhatsApp` + кнопка "Написать в WhatsApp" |
| `src/components/Calculator.tsx` | WhatsApp URL/логика в `handleWhatsApp` |
| `src/components/Footer.tsx` | Ссылка WhatsApp (wa.me), убрать `MessageCircle` если больше не нужна |
| `src/components/TermsContent.tsx` | Строка с WhatsApp-ссылкой в контактах |
| `src/components/PrivacyPolicyContent.tsx` | Строка с WhatsApp-ссылкой |
| `src/components/district/DistrictCTA.tsx` | Кнопка "Написать в WhatsApp" (wa.me) |
| `src/pages/Contacts.tsx` | `handleWhatsAppClick` + кнопка WhatsApp + WhatsApp из sameAs JSON-LD + текст |
| `src/lib/analytics.ts` | Строку `'whatsapp_click': 'contact'` из маппингов (2 места) |

---

## Задача 2: Заменить телефон (30+ файлов)

### Новый номер
- Отображение: `8-495-018-18-17`
- Ссылка: `tel:84950181817`

### Центральный конфиг -- одно изменение покроет ~15 файлов

**`src/lib/seo.ts`** (строки 9-10):
```
phone: '8-495-018-18-17',
phoneClean: '84950181817',
```
Все файлы, использующие `SEO_CONFIG.phone` / `SEO_CONFIG.phoneClean`, обновятся автоматически.

### Файлы с хардкодом номера (нужна ручная замена)

| Файл | Замена |
|------|--------|
| `src/components/FloatingButtons.tsx` | `tel:+79069989888` -> `tel:84950181817` |
| `src/components/Header.tsx` | `tel:+79069989888` -> `tel:84950181817`, текст `+7 (906) 998-98-88` -> `8-495-018-18-17` |
| `src/components/Footer.tsx` | `tel:+79069989888` -> `tel:84950181817` |
| `src/components/HeroCallbackForm.tsx` | `+7 (906) 998-98-88` -> `8-495-018-18-17` |
| `src/components/LeadFormModal.tsx` | `tel:+79069989888`, текст `+7 (906) 998-98-88` -> новые |
| `src/components/PrivacyPolicyContent.tsx` | `tel:+79069989888`, текст -> новые |
| `src/components/TermsContent.tsx` | `tel:+79069989888`, текст -> новые |
| `src/components/StickyCTA.tsx` | `tel:+79069989888` -> `tel:84950181817` |
| `src/components/ServiceAreaMap.tsx` | `tel:+79069989888` -> `tel:84950181817` |
| `src/components/blog/ServiceCTA.tsx` | `tel:+79069989888` -> `tel:84950181817` |
| `src/components/StructuredData.tsx` | `+7 (906) 998-98-88` -> `8-495-018-18-17` |
| `src/components/district/DistrictHero.tsx` | `tel:+79069989888` -> `tel:84950181817` |
| `src/components/district/DistrictCTA.tsx` | `tel:+79069989888` -> `tel:84950181817` |
| `src/pages/ServicePage.tsx` | `tel:+79069989888`, `+7-906-998-98-88`, текст -> новые |
| `src/pages/ServiceSubpage.tsx` | `tel:+79069989888`, `+7-906-998-98-88`, текст -> новые |
| `src/pages/Contacts.tsx` | `tel:+79069989888`, текст, JSON-LD telephone -> новые |
| `src/pages/NotFound.tsx` | `tel:+79069989888`, текст `8 (906) 998-98-88` -> новые |
| `src/pages/DistrictsOverview.tsx` | `tel:+79069989888`, текст -> новые |

### Данные и метаописания

| Файл | Кол-во замен |
|------|--------------|
| `src/data/services.ts` | ~15 (metaDescription + FAQ-ответы) |
| `src/data/serviceSubpages.ts` | ~8 (metaDescription) |
| `src/lib/contentGenerator.ts` | 4 (description шаблоны) |
| `src/lib/metadata.ts` | 5 (description шаблоны) |

### Статические HTML файлы (public/)

27 HTML-файлов в `public/` содержат старый номер в JSON-LD и `<noscript>`. Все `+7 (906) 998-98-88`, `+7-906-998-98-88`, `tel:+79069989888` заменить на новые.

---

## Задача 3: Проверка

После всех правок -- пройти browser-проверку:
1. `/` -- шапка, подвал, floating buttons, нет WhatsApp
2. `/uslugi/dezinsekciya` -- CTA, тарифы, нет WhatsApp, новый номер
3. `/uslugi/dezinsekciya/tarakany` -- аналогично
4. `/contacts` -- только Telegram + телефон, нет WhatsApp
5. `/blog/borba-s-tarakanami` -- ServiceCTA с новым номером

---

## Порядок реализации

1. `src/lib/seo.ts` -- центральный конфиг (покрывает 15+ файлов автоматически)
2. Компоненты с WhatsApp (удалить) + заменить хардкод номера -- параллельно
3. Данные (`services.ts`, `serviceSubpages.ts`, `contentGenerator.ts`, `metadata.ts`)
4. Страницы (`Contacts.tsx`, `ServicePage.tsx`, `ServiceSubpage.tsx` и др.)
5. Статические HTML (`public/`)
6. `analytics.ts` -- убрать whatsapp_click
7. E2E проверка через browser
