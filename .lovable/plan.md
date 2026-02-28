

# Прогресс-бар прокрутки + SectionHeading на всех страницах

## 1. Прогресс-бар прокрутки в Header

**Файл: `src/components/Header.tsx`**

Добавить состояние `scrollProgress` (0-100) в существующий scroll-обработчик (строки 54-69). Рендерить `<div>` с градиентом `from-primary to-russia-red` высотой 3px сразу после триколор-полоски (строка 135), ширина `${scrollProgress}%`.

## 2. SectionHeading на страницах услуг (ServicePage)

**Файл: `src/pages/ServicePage.tsx`**

Заменить обычные `<h2>` в секциях на `SectionHeading`:
- "Когда нужна..." → label "КОГДА НУЖНО"
- "О услуге..." → label "О УСЛУГЕ"  
- "Методы обработки" → label "МЕТОДЫ"
- "Безопасность препаратов" → label "БЕЗОПАСНОСТЬ"
- "Этапы работы" → label "ЭТАПЫ РАБОТЫ"
- "Стоимость..." → label "СТОИМОСТЬ"
- "Гарантии и документы" → label "ГАРАНТИИ"
- "Часто задаваемые вопросы" → label "ВОПРОСЫ И ОТВЕТЫ"
- "По округам Москвы" → label "ГЕОГРАФИЯ"
- "Полезные статьи" → label "БЛОГ"

## 3. SectionHeading на страницах округов (DistrictPage)

**Файл: `src/pages/DistrictPage.tsx`**

Заменить `<h2>` на `SectionHeading` во всех секциях:
- "Районы в ..." → label "РАЙОНЫ"
- "Услуги дезинфекции в ..." → label "УСЛУГИ"
- "Популярные объекты" → label "ОБЪЕКТЫ"
- "Частые вопросы про ..." → label "ВОПРОСЫ И ОТВЕТЫ"
- "Другие округа Москвы" → label "ОКРУГА"

## 4. SectionHeading на страницах блога

**Файл: `src/pages/Blog.tsx`**
- Hero заголовок: уже есть триколор, оставляем
- CTA секция: добавить триколор

**Файл: `src/pages/BlogPost.tsx`**
- Уже есть триколор-акцент в header, ок

## 5. SectionHeading на странице Контактов

**Файл: `src/pages/Contacts.tsx`**
- Заголовок "Контакты и реквизиты" → SectionHeading с label "КОНТАКТЫ"

## 6. SectionHeading на странице Команда

**Файл: `src/pages/Team.tsx`**
- Заголовок команды → SectionHeading с label "НАША КОМАНДА"

## 7. SectionHeading на странице обзора округов

**Файл: `src/pages/DistrictsOverview.tsx`**
- Hero → SectionHeading с label "ОКРУГА МОСКВЫ"

## 8. SectionHeading на странице района (NeighborhoodPage)

**Файл: `src/pages/NeighborhoodPage.tsx`**
- Секции с h2 → SectionHeading с соответствующими labels

## Итого изменений
- 1 файл Header — добавить прогресс-бар
- ~8 файлов страниц — заменить h2 на SectionHeading с label и триколором

