
# Полный аудит и план LLM-оптимизации блога

## Текущее состояние

### Уже LLM-оптимизировано: 21 статья

| Файл | Кол-во | IDs |
|------|--------|-----|
| `llm/pests.ts` | 12 | 9001 (klopy-v-kvartire), 9003 (sezonnost), 9004 (aerozoli), 9007 (borba-s-tarakanami), 9008 (gryzuny-v-dome), 9013 (sezonnost-kalendar), 9016 (postelnye-klopy-gajd), 9017 (ryzhie-tarakany), 9018 (domashnie-muravi), 9019 (krysy-v-dome), 9020 (blohi), 9021 (komary) |
| `llm/methods.ts` | 5 | 9002 (vrediteli-vidy), 9005 (preparaty-ot-gryzunov), 9010 (podgotovit-pomeshchenie), 9011 (vidy-dezinfekcii), 9012 (ozonirovaniye) |
| `llm/legal-commercial.ts` | 4 | 9006 (dokumenty-rospotrebnadzor), 9009 (dezinfekciya-ofisa), 9014 (kejs-restoran), 9015 (kejs-gostinica) |

### Ещё НЕ оптимизировано: 44 статьи

**Группа A: newBlogPosts (8 статей)**

| # | ID | slug | Тема | Целевой файл |
|---|----|------|------|-------------|
| 22 | 15 | mol-v-kvartire-vidy | Моль | pests.ts |
| 23 | 16 | podgotovka-kvartiry-chek-list | Подготовка | methods.ts |
| 24 | 17 | dezinfekciya-posle-bolezni | Дезинфекция | methods.ts |
| 25 | 18 | 5-priznakov-klopov | Признаки клопов | pests.ts |
| 26 | 19 | profilaktika-tarakanov | Профилактика | methods.ts |
| 27 | 20 | kak-vybrat-sluzhbu-dezinfekcii | Выбор службы | methods.ts |
| 28 | 21 | bezopasnost-detej-i-zhivotnyh | Безопасность | safety-tips.ts (новый) |
| 29 | 22 | dezinfekciya-ofisa-bez-pomeh | Офис без помех | legal-commercial.ts |

(ID 23-25 и 26-28 из newBlogPosts уже перекрыты llm-статьями 9006/9014/9015 по slug)

**Группа B: DIY-провалы (5 статей)**

| # | ID | slug | Целевой файл |
|---|-----|------|-------------|
| 30 | 6001 | pochemu-dihlofos-ne-beret-klopov | methods.ts |
| 31 | 6002 | rezistentnost-tarakanov-k-bornoj-kislote | methods.ts |
| 32 | 6003 | oshibki-samodeyatelnoj-obrabotki | methods.ts |
| 33 | 6004 | pochemu-tarakany-vozvrashchayutsya | methods.ts |
| 34 | 6005 | aerozoli-ot-klopov-ne-rabotayut | methods.ts |

**Группа C: Безопасность (5 статей)**

| # | ID | slug | Целевой файл |
|---|-----|------|-------------|
| 35 | 7001 | cherez-skolko-puskat-koshku | safety-tips.ts |
| 36 | 7002 | goryachij-tuman-i-akvarium | safety-tips.ts |
| 37 | 7003 | dezinsekciya-s-grudnym-rebenkom | safety-tips.ts |
| 38 | 7004 | bezopasnost-obrabotki-dlya-beremennyh | safety-tips.ts |
| 39 | 7005 | allergiya-na-preparaty | safety-tips.ts |

**Группа D: B2B (5 статей)**

| # | ID | slug | Целевой файл |
|---|-----|------|-------------|
| 40 | 5001 | shtrafy-bez-licenzii-2026 | legal-commercial.ts |
| 41 | 5002 | haccp-pest-kontrol-restoran | legal-commercial.ts |
| 42 | 5003 | zhurnal-ucheta-dezinsekcii | legal-commercial.ts |
| 43 | 5004 | sanpin-deratizaciya-skladov | legal-commercial.ts |
| 44 | 5005 | dogovor-na-dezinsekciyu-hostela | legal-commercial.ts |

**Группа E: Юридические (21 статья) -- приоритет ниже, уже с sources/intent**

Статьи из legal-articles.ts (id 4001-4021) уже имеют структурированные `tldr`, `sources`, `intent`. Их можно оптимизировать позже -- они и так занимают высокий приоритет в системе.

**Группа F: Legacy blogPosts (~20 статей)**

Уже перекрыты LLM-версиями по slug (klopy-v-kvartire, borba-s-tarakanami, gryzuny-v-dome и т.д.). Оставшиеся legacy-статьи (narodnye-sredstva-ot-tarakanov, otkuda-berutsya-klopy и др.) -- самый низкий приоритет.

---

## Рекомендуемый порядок работы

### Фаза 5: Оставшиеся newBlogPosts (8 статей = 3 батча)
- Батч 8: mol-v-kvartire-vidy + 5-priznakov-klopov + podgotovka-kvartiry-chek-list
- Батч 9: dezinfekciya-posle-bolezni + profilaktika-tarakanov + kak-vybrat-sluzhbu
- Батч 10: bezopasnost-detej + dezinfekciya-ofisa-bez-pomeh (2 статьи)

### Фаза 6: DIY-провалы (5 статей = 2 батча)
- Батч 11: dihlofos-ne-beret-klopov + rezistentnost-bornoj-kislote + oshibki-samodeyatelnoj
- Батч 12: tarakany-vozvrashchayutsya + aerozoli-ot-klopov (2 статьи)

### Фаза 7: Безопасность (5 статей = 2 батча)
- Батч 13: koshku-posle-tumana + akvarium + grudnyj-rebenok
- Батч 14: beremennyh + allergiya (2 статьи)

### Фаза 8: B2B (5 статей = 2 батча)
- Батч 15: shtrafy-licenziya + haccp-restoran + zhurnal-dezinsekcii
- Батч 16: sanpin-sklady + dogovor-hostel (2 статьи)

### Фаза 9: Яндекс TOP-100 доработка (после всех статей)
1. Мета-теги: Title/Description с LLM-запросами для каждой статьи
2. BreadcrumbList JSON-LD на всех страницах блога
3. "Neuro-snippet" -- первые 100 слов после H1 = самодостаточный ответ
4. Расширение FAQ до 6-8 вопросов в каждой статье
5. Внутренняя перелинковка через RelatedQueries
6. Coverage Report: какие из топ-100 запросов покрыты, какие -- нет
7. Генерация списка URL для переобхода в Яндекс Вебмастере

---

## Итого

| Метрика | Значение |
|---------|----------|
| Всего LLM-статей (текущих) | 21 |
| Осталось оптимизировать (приоритетные) | 23 статьи |
| Осталось оптимизировать (низкий приоритет, legal) | 21 статья |
| Батчей до завершения приоритетных | 9 батчей |
| Новые файлы | `llm/safety-tips.ts` |

### Технические детали

- Группы B, C, D перезапишут существующие статьи из diy-failures, safety, b2b по slug (система приоритетов в index.ts)
- Новый файл `llm/safety-tips.ts` для статей про безопасность (до 20 статей)
- `llm/index.ts` нужно обновить, добавив импорт safety-tips
- Каждая статья: LLMSummary + AuthorBadge + ComparisonTable/WarningBlock + FAQSection (4-8 вопросов)
- Юридические статьи (legal-articles.ts, 21 шт.) уже имеют хорошую структуру и можно отложить на фазу 10
