
# Фикс багов AI-Citability Blog + Nginx

## Обзор найденных проблем

### Критические
1. **Промо-хвост в premises-articles.ts** (строка 82): `Звоните: +7 (906) 998-98-88` в шаблоне `dezinsekciya`
2. **Дубликат slug `trebovaniya-rospotrebnadzora-2026`**: существует в 3 файлах (blogPosts id:40, newBlogPosts id:23, legal-articles id:4002). Legacy-версия загружается первой и "затеняет" legal-версию с sources/tldr/intent
3. **Дубликат slug `sanpin-dezinfekciya`**: в blogPosts (id:41) конфликтует с `sanpin-trebovaniya-2026` в legal-articles (похожая тема, но slug другой -- фактически не конфликтует)
4. **newBlogPosts.ts не подключён** к `src/data/blog/index.ts` -- 20 статей потеряны
5. **Промо-хвосты во ВСЕХ legacy-статьях** (blogPosts.ts): ~16 строк "Звоните: +7 (906) 998-98-88" по всему файлу
6. **Промо-хвосты в newBlogPosts.ts**: ~16 строк "Звоните: +7 (906) 998-98-88"
7. **Промо-блок в blogPosts id:40** (строки 3172-3179): "Мы поможем / Наша служба..."
8. **updatedAt отсутствует** у legal-статей id:4003-4011
9. **lint:ai не добавлен** в package.json

### Средние
10. Автогенерация tldr из excerpt (функция `generateTldrFromExcerpt`) -- работает, но качество можно улучшить

---

## Этап 1: Устранение дубликатов slug

### 1.1 Удалить legacy-версию `trebovaniya-rospotrebnadzora-2026` из blogPosts.ts
- Удалить статью id:40 (строки 3131-3181) полностью из массива `blogPosts`
- Причина: legal-articles.ts (id:4002) имеет полноценную версию с sources, tldr, intent, updatedAt

### 1.2 Подключить newBlogPosts.ts к index.ts
- Импортировать `newBlogPosts` из `@/data/newBlogPosts`
- Конвертировать в BlogArticle[] через адаптер (аналогично legacyArticles)
- **Исключить id:23** (`trebovaniya-rospotrebnadzora-2026`) -- дубликат с legal-articles
- Добавить дедупликацию по slug: если slug уже есть в предыдущих массивах, не добавлять
- Порядок приоритетов в allBlogArticles: legacyArticles, newArticles, pestsArticles, premisesArticles, **legalArticles (высший приоритет для legal slug)**, moleGeoArticles
- Или проще: поставить legalArticles раньше legacy в массиве, чтобы legal-версии "выигрывали", и добавить дедупликацию

### 1.3 Изменить порядок в allBlogArticles для корректного приоритета
Новый порядок:
```text
allLegalArticles (приоритет -- с sources/tldr/intent)
allPestsArticles
premisesArticles
moleGeoArticles
newArticles (из newBlogPosts, с фильтрацией дублей)
legacyArticles (из blogPosts, с фильтрацией дублей)
```
Плюс дедупликация: `filter` по уникальным slug, первое вхождение побеждает.

---

## Этап 2: Удаление промо-хвостов из контента

### 2.1 premises-articles.ts (строка 82)
- Удалить строку `Звоните: +7 (906) 998-98-88` из шаблона `dezinsekciya`

### 2.2 blogPosts.ts (~16 строк)
- Удалить все строки вида `Звоните: +7 (906) 998-98-88` и прилегающие промо-фразы из контента всех legacy-статей
- Конкретно: строки 265, 358, 446, 540, 674, 860, 956, 1038, 1132, 1228, 1327, 1423, 1515, 1614, 1703, 1814
- Также удалить промо-блок id:40 (строки 3172-3179) -- но эту статью мы удаляем целиком (п.1.1)

### 2.3 newBlogPosts.ts (~16 строк)
- Удалить все строки вида `Звоните: +7 (906) 998-98-88` и прилегающие промо-фразы
- Конкретно: строки 195, 365, 806, 1117, 1245, 1363, 1504, 1813, 1955, 2123, 2265, 2356, 2467, 2702, 2886, 2890
- Особый случай: статья id:28 (50 вопросов) -- в вопросе 50 упоминается телефон как часть ответа (строка 2886), а также промо-хвост в конце (строка 2890) -- удалить оба

---

## Этап 3: Добавление updatedAt для legal-статей

В legal-articles.ts добавить `updatedAt` для статей без него:
- id:4003 (dokumenty-dlya-obshhepita) -- добавить `updatedAt: generateArticleDate(4103, 'dokumenty-dlya-obshhepita-upd')`
- id:4004 (zhurnal-uchyota-dezinsekcii) -- аналогично
- id:4005 (licenziya-na-dezinfekciyu)
- id:4006 (shtrafy-za-vrediteley)
- id:4007 (haccp-i-dezinsekciya)
- id:4008 (dogovor-na-dezinsekciyu-obrazec)
- id:4009 (proverka-ses-kak-podgotovitsya)
- id:4010 (bezopasnost-preparatov)
- id:4011 (kak-vybrat-kompaniyu)

---

## Этап 4: Улучшение автогенерации tldr

В `src/data/blog/index.ts` обновить функцию `generateTldrFromExcerpt`:
- Разбивать не только по `.!?`, но и по запятым если предложений мало
- Гарантировать минимум 3 буллета
- Если excerpt слишком короткий, использовать первые 2 абзаца из content (без заголовков)

---

## Этап 5: Добавление lint:ai в package.json

Добавить в блок `scripts`:
```json
"lint:ai": "npx tsx scripts/validate-ai-ready.ts"
```

---

## Этап 6: Nginx -- фикс 404 для SPA-маршрутов

В `nginx.conf` изменить глобальный fallback (блок `location /`) для поддержки SPA-роутов:

Текущий (строка последняя):
```
location / {
    try_files $uri $uri/ $uri/index.html =404;
}
```

Это правильно для SSG: если файл не найден, возвращается 404. Но для SPA-маршрутов (районы, 3-сегментные URL без пререндера) нужен fallback на index.html.

Решение: обновить правила для 3-сегментных URL и районов, чтобы они делали fallback на `/index.html` (SPA) вместо `=404`:

```
location ~ ^/uslugi/[^/]+/[^/]+/[^/]+/$ {
    try_files $uri $uri/index.html /index.html;
}

location ~ ^/rajony/[^/]+/$ {
    try_files $uri $uri/index.html /index.html;
}

location ~ ^/moscow-oblast/[^/]+/[^/]+/$ {
    try_files $uri $uri/index.html /index.html;
}
```

Важно: это нужно только если эти страницы НЕ пререндерятся через SSG. Если SSG генерирует index.html для всех маршрутов, текущий `=404` корректен. Нужно проверить, какие маршруты покрыты SSG.

---

## Порядок реализации

1. Удалить промо-хвосты из blogPosts.ts, newBlogPosts.ts, premises-articles.ts
2. Удалить дубликат id:40 из blogPosts.ts
3. Подключить newBlogPosts.ts к index.ts с дедупликацией
4. Изменить приоритет загрузки (legal первыми)
5. Добавить updatedAt для legal id:4003-4011
6. Улучшить generateTldrFromExcerpt
7. Добавить lint:ai в package.json
8. Обновить nginx.conf для SPA fallback

## Технические детали

### Дедупликация в index.ts

```typescript
// Собираем все статьи с приоритетом
const allArticlesRaw: BlogArticle[] = [
  ...allLegalArticles,    // Приоритет 1: legal с sources/intent
  ...allPestsArticles,
  ...premisesArticles,
  ...moleGeoArticles,
  ...newArticles,          // Из newBlogPosts, конвертированные
  ...legacyArticles,       // Приоритет последний
];

// Дедупликация по slug (первое вхождение побеждает)
const seen = new Set<string>();
export const allBlogArticles: BlogArticle[] = allArticlesRaw.filter(a => {
  if (seen.has(a.slug)) return false;
  seen.add(a.slug);
  return true;
});
```

### Адаптер для newBlogPosts

```typescript
import { newBlogPosts } from '@/data/newBlogPosts';

const newArticles: BlogArticle[] = newBlogPosts.map(post => ({
  ...post,
  wordCount: post.content.split(/\s+/).length,
  tldr: generateTldrFromExcerpt(post.excerpt),
}));
```
