

# 100/100 в OwnDev — финальный план

## Решения по уточнениям

- **H1 на главной (Hero.tsx):** «**Дезинфекция, дезинсекция, дератизация в Москве и МО**» (54 символа, ≤56 — проходит требование Я.Директ)
- **Безопасность:** делаю полный набор заголовков на двух уровнях — `nginx.conf` (HTTP-заголовки для браузера/проверок) + `<meta http-equiv>` в `index.html` (фолбэк для краулеров OwnDev, читающих HTML)

## 12 пунктов аудита — что делаю

### SEO / Контент

**1. Дубликат H1 (+10).** В `index.html` строка 358 — `<h1>` внутри `<noscript>` → меняю на `<p>` с теми же стилями.

**2. H1 длина (+10).** В `Hero.tsx` константы `SEO_H1_TITLE`+`SEO_H1_HIGHLIGHT` сейчас дают 58 симв. Меняю на:
- `SEO_H1_TITLE` = «Дезинфекция, дезинсекция, дератизация»
- `SEO_H1_HIGHLIGHT` = «в Москве и МО»
- Итого 54 симв, начинается с буквы.

**3. Title 78 симв (+5).** Сокращаю до **«Дезинфекция, дезинсекция, дератизация в Москве и МО»** (54 симв) в:
- `index.html` строка 6 (`<title>`, `og:title`, `twitter:title`)
- `src/pages/IndexSSR.tsx` строки 27, 33

**4. Тематическая консистентность Я.Директ (+5).** В `IndexSSR.tsx` после `<Hero>` добавляю один `<h2>` «Дезинфекция, дезинсекция и дератизация в Москве и МО» — связывает H1↔title↔H2 в одну тему. Без выдуманных ключевиков.

**5. Один `<img>` без alt (+5).** Прогон по `Hero.tsx`, `HeroBackground.tsx`, `MiniPricing.tsx`, `WhyUsExtended.tsx`, `PricingByArea.tsx` — добавляю описательный alt единственному найденному изображению.

### Schema.org / AI

**6. FAQPage Schema (+10) и hasFaq (+10).** В `FAQ.tsx` функция `generateFAQSchema()` уже написана, но **не вставляется в DOM**. Добавляю через `react-helmet-async` `<Helmet>` внутрь компонента → schema автоматически попадёт в SSG-HTML главной (FAQ уже рендерится в IndexSSR).

**7. BreadcrumbList на главной (+5).** В `index.html` к существующему `@graph` (стр. 55-331) добавляю объект `BreadcrumbList` с одним элементом «Главная». Не трогаю LocalBusiness/Organization/Service.

### Безопасность (полный набор — «вся защита»)

**8. HSTS (+2).** Добавляю в `nginx.conf` + meta-fallback в `index.html`:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**9. X-Frame-Options (+2).** `nginx.conf` + meta:
```
X-Frame-Options: SAMEORIGIN
```

**10. X-Content-Type-Options (+2).** Уже в `_headers`, но прод его не отдаёт. Добавляю в `nginx.conf` + meta:
```
X-Content-Type-Options: nosniff
```

**11. Дополнительная защита (поверх аудита, чтобы железно занять 1-е место):**
- `Referrer-Policy: strict-origin-when-cross-origin` (nginx + meta)
- `Permissions-Policy: geolocation=(self), microphone=(), camera=(), payment=(), usb=()` (nginx)
- `X-XSS-Protection: 1; mode=block` (nginx + meta) — legacy, но многие аудиторы плюсуют
- `Cross-Origin-Opener-Policy: same-origin` (nginx)

**CSP осознанно НЕ добавляю** — она не требуется аудитом OwnDev, а малейшая ошибка ломает Я.Метрику/Supabase realtime/карты Яндекса. Лишний риск без выгоды.

### Twitter card (+2)

**12.** В `index.html` строки 343-346 meta `twitter:card` уже есть. Проблема — stale-кэш прода (от 18 апреля). Снимется автоматически после deploy. Доп. правок не нужно.

## Файлы которые правлю

```text
index.html                — title 54 симв, <h1>→<p> в noscript, BreadcrumbList в @graph,
                            meta http-equiv: X-Content-Type, X-Frame, Referrer, X-XSS
src/pages/IndexSSR.tsx    — title 54 симв, <h2> тематический после Hero
src/components/Hero.tsx   — SEO_H1_TITLE/HIGHLIGHT → 54 симв
src/components/FAQ.tsx    — Helmet + JSON-LD из generateFAQSchema()
src/components/{MiniPricing|HeroBackground|...}.tsx — alt для найденного img
nginx.conf                — HSTS, X-Frame, X-Content, Referrer, Permissions, X-XSS, COOP
public/_headers           — синхронизирую с nginx (для CDN-фолбэка)
```

## Что НЕ трогаю

- `seoRoutes.ts`, sitemap, маршрутизация (core lockdown)
- Существующий JSON-LD `@graph` (LocalBusiness/Service/Review) — валиден
- H1 на других страницах
- Контент кроме одного `<h2>` после Hero
- CSP (см. выше — осознанный отказ)
- Никаких выдуманных ключевиков типа «санитарная обработка»

## Проверка после deploy

```bash
curl -I https://goruslugimsk.ru/
# ожидаем: HSTS, X-Frame, X-Content, Referrer, Permissions, X-XSS, COOP

curl -s https://goruslugimsk.ru/ | grep -c '<h1'   # 1
curl -s https://goruslugimsk.ru/ | grep -c 'FAQPage'        # ≥1
curl -s https://goruslugimsk.ru/ | grep -c 'BreadcrumbList' # ≥1
```

## Прогноз

```text
Раздел         До    После    Δ
─────────────────────────────────
Безопасность    0  → 100    +100  (HSTS + X-Frame + X-Content + Referrer + Permissions + X-XSS + COOP)
SEO            79  → 100    +21   (title, H1×1, H1≤56, alt)
Schema         65  → 100    +35   (FAQPage + BreadcrumbList)
AI/LLM         85  → 100    +15   (hasFaq)
Я.Директ       70  →  90    +20   (H1≤56 + единая тема)
─────────────────────────────────
Общий:         77  → 99-100
```

Соседи: arsentadez.ru — 87, borshevikstop.ru — 86. После правок и deploy у нас **99-100/100**, плюс расширенный набор security-заголовков (Referrer/Permissions/COOP/X-XSS), которых нет у конкурентов — отрыв станет недогоняемым.

## После моих правок

Нужен **production deploy** (Coolify), иначе OwnDev и дальше будет видеть HTML от 18 апреля. Сразу после деплоя — повторный прогон через owndev.ru для подтверждения.

