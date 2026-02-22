

# Расширение семантики блога + Аналитика AI-трафика

## Обзор

Создание 3 новых файлов с 15 статьями, расширение b2b-articles.ts на 5 статей, обновление семантического ядра и добавление трекинга AI-трафика.

---

## Часть 1: Новые кластеры контента

### 1.1 Создать `src/data/blog/diy-failures-articles.ts`

5 статей (ID 6001-6005), кластер "Почему не работает?":

| ID | Slug | Intent |
|----|------|--------|
| 6001 | pochemu-dihlofos-ne-beret-klopov | guide |
| 6002 | rezistentnost-tarakanov-k-bornoj-kislote | guide |
| 6003 | oshibki-samodeyatelnoj-obrabotki | guide |
| 6004 | pochemu-tarakany-vozvrashchayutsya-posle-obrabotki | symptoms |
| 6005 | aerozoli-ot-klopov-ne-rabotayut | guide |

- Автор: Максим Гусев (gusev-m)
- Category: `'Советы'` или `'Препараты'`
- `promoLevel: 1`, `tldr` 3-5 буллетов, `faq` 2-3 вопроса
- H2 в формате вопросов, прямые ответы, без промо
- sources: ссылки на rospotrebnadzor.ru, docs.cntd.ru (паспорта безопасности)

### 1.2 Расширить `src/data/blog/b2b-articles.ts`

Добавить 5 статей (ID 5006-5010) в существующий массив `allB2BArticles`:

| ID | Slug | Intent |
|----|------|--------|
| 5006 | pest-kontrol-pvz-marketplejs | docs |
| 5007 | sanpin-dezinfekciya-kliniki | laws |
| 5008 | haccp-audit-pekarnaya | docs |
| 5009 | obyazannosti-uk-deratizaciya-podvalov | laws |
| 5010 | kuda-zhalovatsya-na-krys-v-podezde | howto |

- `promoLevel: 0`, sources >= 3, tldr 3-5 буллетов
- Автор: vasiliev для laws/docs, uchaev для howto

### 1.3 Создать `src/data/blog/safety-articles.ts`

5 статей (ID 7001-7005), кластер "Безопасность":

| ID | Slug | Intent |
|----|------|--------|
| 7001 | cherez-skolko-puskat-koshku-posle-tumana | health-risk |
| 7002 | goryachij-tuman-i-akvarium | health-risk |
| 7003 | dezinsekciya-s-grudnym-rebenkom | health-risk |
| 7004 | bezopasnost-obrabotki-dlya-beremennyh | health-risk |
| 7005 | allergiya-na-preparaty-dezinsekcii | health-risk |

- Автор: Владимир Гусев (gusev-v)
- Category: `'Советы'`
- `promoLevel: 1`, sources >= 3 (паспорта безопасности, СанПиН)

### 1.4 Интеграция в `src/data/blog/index.ts`

- Импортировать `diyFailureArticles` и `safetyArticles`
- Добавить в `allArticlesRaw` после b2b, до pests:

```text
allLegalArticles -> allB2BArticles -> safetyArticles -> diyFailureArticles -> allPestsArticles -> ...
```

- Обновить `blogStats` с полями `diyFailures` и `safety`
- Экспортировать новые массивы

### 1.5 Обновить `src/data/semanticCore.ts`

Добавить 15 записей в `blogEntries` (intent: informational, cluster: blog):

- 5 записей для DIY-провалов (priority: 2-3)
- 5 записей для микро-B2B (priority: 3)
- 5 записей для безопасности (priority: 2)

---

## Часть 2: Аналитика AI-трафика

### 2.1 Обновить `src/lib/analytics.ts`

Добавить функцию `trackAIReferral()`:
- Проверяет `document.referrer` на домены: perplexity.ai, chatgpt.com, poe.com, claude.ai, you.com
- Проверяет UTM-параметры на ai-источники
- Отправляет цель `ai_referral` в Яндекс.Метрику (ID 105828040 -- уже определен в файле)

Добавить функцию `detectDarkAITraffic()`:
- Эвристика: Direct-трафик на глубокие /blog/ статьи без реферера
- Помечает `suspected_ai: true` в Метрике

### 2.2 Обновить `src/pages/BlogPost.tsx`

- Импортировать `trackAIReferral` из `@/lib/analytics`
- Вызвать в существующем `useEffect` при маунте

### 2.3 Создать `scripts/ai-crawler-monitor.py`

Python-скрипт для парсинга access.log Nginx:
- User-Agent фильтры: PerplexityBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, anthropic-ai, GoogleOther, Google-Extended, Applebot-Extended
- Группировка по боту и URL, фильтр по /blog/
- Отчет: топ-10 URL по частоте обхода
- Опциональная отправка в Telegram

---

## Порядок реализации

1. Создать `diy-failures-articles.ts` (5 статей)
2. Расширить `b2b-articles.ts` (+5 статей)
3. Создать `safety-articles.ts` (5 статей)
4. Обновить `index.ts` -- импорт, интеграция, stats, экспорт
5. Обновить `semanticCore.ts` -- 15 новых записей
6. Обновить `analytics.ts` -- trackAIReferral + detectDarkAITraffic
7. Обновить `BlogPost.tsx` -- вызов trackAIReferral
8. Создать `ai-crawler-monitor.py`

## Технические детали

### Совместимость с линтером

Все 15 новых статей пройдут `validate-ai-ready.ts`:
- `id >= 500` -- значит `isGenerator = true`, проверки как error
- tldr: 3-5 пунктов
- sources >= 3 для laws/docs (обязательно из whitelist)
- Нет промо в первых 5 абзацах
- FAQ без CTA
- updatedAt заполнен
- legal-markers в H2/H3 для laws/docs статей

### Типы

`BlogArticleIntent` уже включает `'health-risk'` (types.ts строка 78) -- доп. изменений не нужно.

### trackAIReferral логика

Использует существующий `YANDEX_COUNTER_ID = 105828040` и `window.ym` из analytics.ts. Функция `trackGoal` уже есть -- trackAIReferral будет её вызывать.

