
# План: Полная переработка блога — авторы, даты и удаление AI-паттернов

## Исправленные данные специалистов

| Специалист | Должность | Стаж | Стиль | Специализация |
|------------|-----------|------|-------|---------------|
| Максим Гусев | Ведущий дезинфектор | **8 лет** | Практичный | Тараканы, клопы, квартиры |
| Александр Афанасьев | Специалист по дератизации | **5 лет** | Экспертный | Грызуны, крысы, мыши |
| Владимир Гусев | Технолог-дезинфектолог | **7 лет** | Технический | Препараты, технологии, озонирование |
| Андрей Иванов | Мастер-дезинсектор | 10 лет | Дружелюбный | Муравьи, блохи, моль |
| Эдуард Васильев | Эксперт по санитарии | **12 лет** | Формальный | Законы, СанПиН, документация |
| Владимир Учаев | Специалист по коммерческим объектам | 7 лет | Лаконичный | Офисы, рестораны, склады |

---

## Этап 1: Расширение типов

**Файл:** `src/data/blog/types.ts`

Добавить интерфейс Author и массив blogAuthors с исправленным стажем:

```typescript
export interface Author {
  id: string;
  name: string;
  role: string;
  experience: string;
  style: 'formal' | 'practical' | 'technical' | 'friendly' | 'expert' | 'concise';
  specialization: string[];
}

export const blogAuthors: Author[] = [
  {
    id: 'gusev-m',
    name: 'Максим Гусев',
    role: 'Ведущий дезинфектор',
    experience: '8 лет',
    style: 'practical',
    specialization: ['тараканы', 'клопы', 'квартиры']
  },
  {
    id: 'afanasiev',
    name: 'Александр Афанасьев',
    role: 'Специалист по дератизации',
    experience: '5 лет',
    style: 'expert',
    specialization: ['грызуны', 'крысы', 'мыши', 'склады']
  },
  // ... остальные авторы
];
```

Расширить BlogArticle:
```typescript
export interface BlogArticle {
  // ... существующие поля
  author?: string;
  authorRole?: string;
}
```

---

## Этап 2: Система назначения авторов и генерации дат

**Файл:** `src/lib/blogContentGenerator.ts` (расширение)

Добавить функции:

```typescript
// Генератор дат (ноябрь 2025 — февраль 2026)
export function generateArticleDate(articleId: number, slug: string): string {
  const startDate = new Date('2025-11-01');
  const totalDays = 93; // до 01.02.2026
  const hash = simpleHash(slug);
  const dayOffset = Math.abs(hash) % totalDays;
  
  const articleDate = new Date(startDate);
  articleDate.setDate(articleDate.getDate() + dayOffset);
  return articleDate.toISOString().split('T')[0];
}

// Назначение автора по специализации
export function assignAuthor(article: { category: string; tags: string[]; pest?: string }): Author {
  // Логика сопоставления...
}
```

---

## Этап 3: Расширенная очистка AI-паттернов

**Файл:** `src/components/TableOfContents.tsx`

Расширить функцию `cleanAIContent`:

```typescript
const cleanAIContent = (text: string): string => {
  return text
    // Эмодзи в начале строк
    .replace(/^[✅❌⚠️📍🔴🟢🟡🎯💡📌🔒✨🛡️⭐🏆]\s*/gm, '')
    
    // AI-вводные фразы
    .replace(/^(Важно|Следует|Необходимо|Обратите внимание|Примечание|Стоит отметить|Нельзя не упомянуть):\s*/gim, '')
    .replace(/^(Рассмотрим подробнее|Давайте разберём|Итак|В данной статье|В этой статье|Начнём с того)[,:.]?\s*/gim, '')
    .replace(/^(Как уже упоминалось|Как было сказано|Как мы видим|Очевидно, что)[,:.]?\s*/gim, '')
    
    // Переходные фразы AI
    .replace(/(Таким образом|Подводя итог|В заключение|Резюмируя|Исходя из вышесказанного)[,:.]?\s*/gi, '')
    .replace(/(Безусловно|Несомненно|Очевидно|Конечно же)[,:.]?\s*/gi, '')
    
    // Избыточные усилители
    .replace(/\bочень\s+/gi, '')
    .replace(/\bдостаточно\s+(легко|просто|быстро)\b/gi, '$1')
    .replace(/\bабсолютно\s+(необходимо|важно)\b/gi, 'необходимо')
    
    // Формальные конструкции
    .replace(/представляется возможным/gi, 'можно')
    .replace(/является\s+(\w+)\s+решением/gi, '— $1 решение')
    .replace(/данн(ый|ая|ое|ые)\s+/gi, '')
    
    // Двойные пробелы
    .replace(/  +/g, ' ')
    .trim();
};
```

---

## Этап 4: Обновление генераторов статей

**Файлы:** `pests-articles.ts`, `premises-articles.ts`, `legal-articles.ts`

Для каждой статьи добавить:
- `author` — имя автора
- `authorRole` — должность
- `date` — сгенерированная дата

Пример:
```typescript
const author = assignAuthor({ category: template.category, tags: [...], pest: pest.id });

return {
  // ... существующие поля
  author: author.name,
  authorRole: author.role,
  date: generateArticleDate(id, slug),
};
```

---

## Этап 5: Отображение автора в BlogPost

**Файл:** `src/pages/BlogPost.tsx`

Добавить импорт иконки User и блок автора в шапку статьи:

```tsx
import { User } from "lucide-react";

// В шапке статьи после даты и времени чтения:
{post.author && (
  <div className="flex items-center justify-center gap-3 mt-4">
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
      <User className="w-5 h-5 text-primary" />
    </div>
    <div className="text-left">
      <p className="font-medium text-foreground">{post.author}</p>
      <p className="text-sm text-muted-foreground">{post.authorRole}</p>
    </div>
  </div>
)}
```

---

## Распределение авторов

| Автор | Логика назначения | Ориентировочно статей |
|-------|-------------------|----------------------|
| Эдуард Васильев | Категория "Законы", теги с "СанПиН" | ~25 |
| Александр Афанасьев | Категория "Дератизация", теги с "грызуны" | ~15 |
| Владимир Гусев | Теги "озонирование", "технологии", "препараты" | ~20 |
| Владимир Учаев | Теги "офис", "ресторан", "склад" | ~25 |
| Андрей Иванов | Вредители: муравьи, блохи, моль | ~20 |
| Максим Гусев | Тараканы, клопы, квартиры (по умолчанию) | ~50 |

---

## Распределение дат

Статьи будут равномерно распределены с **1 ноября 2025** по **1 февраля 2026**:

| Месяц | Примерно статей |
|-------|-----------------|
| Ноябрь 2025 | ~40 |
| Декабрь 2025 | ~50 |
| Январь 2026 | ~50 |
| Февраль 2026 | ~18 |

---

## Файлы для изменения

| Файл | Изменения |
|------|-----------|
| `src/data/blog/types.ts` | Добавить Author, blogAuthors, расширить BlogArticle |
| `src/lib/blogContentGenerator.ts` | Добавить generateArticleDate, assignAuthor |
| `src/components/TableOfContents.tsx` | Расширить cleanAIContent |
| `src/data/blog/pests-articles.ts` | Интегрировать авторов и даты |
| `src/data/blog/premises-articles.ts` | Интегрировать авторов и даты |
| `src/data/blog/legal-articles.ts` | Добавить авторов и обновить даты |
| `src/data/blogPosts.ts` | Добавить авторов к legacy-статьям |
| `src/pages/BlogPost.tsx` | Отображение автора |

---

## Ожидаемый результат

После изменений:
- Все 158 статей имеют уникального автора с должностью и стажем
- Даты распределены с ноября 2025 по февраль 2026
- AI-паттерны удалены из отображаемого контента
- Каждый автор имеет узнаваемый стиль
- Статьи выглядят как написанные реальными специалистами
- Schema.org разметка включает информацию об авторе
