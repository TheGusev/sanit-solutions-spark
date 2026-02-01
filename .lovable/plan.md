
# План: Исправление парсинга Markdown и удаление AI-паттернов

## Диагноз проблемы

На скриншоте видно, что markdown-разметка **не парсится** и отображается как есть:
- `**Примеры:**` вместо **Примеры:**
- `**Инфекционные заболевания**` вместо **Инфекционные заболевания**

### Причина

Функция `generateContentWithIds` в `TableOfContents.tsx` обрабатывает только:
- Блочные элементы (заголовки, списки, таблицы, blockquotes)
- Строки, **целиком** состоящие из `**text**`

НО не обрабатывает **inline-markdown** внутри параграфов и элементов списков.

---

## Решение

### Шаг 1: Создать функцию обработки inline-markdown

**Файл:** `src/components/TableOfContents.tsx`

Добавить функцию `processInlineMarkdown`:

```typescript
// Обработка inline markdown (bold, italic, links)
const processInlineMarkdown = (text: string): string => {
  return text
    // Bold: **text** → <strong>text</strong>
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* → <em>text</em> (но не внутри bold)
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
    // Links: [text](url) → <a href="url">text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    // Inline code: `text` → <code>text</code>
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
};
```

### Шаг 2: Применить к каждому выходному элементу

Обновить `generateContentWithIds` для применения `processInlineMarkdown` ко всем текстовым выводам:

```typescript
// Вместо:
result += `<p>${line}</p>`;

// Должно быть:
result += `<p>${processInlineMarkdown(line)}</p>`;
```

Аналогично для:
- Элементов списков (`<li>`)
- Ячеек таблиц (`<td>`)
- Заголовков (`<h2>`, `<h3>`)
- Blockquotes
- Callouts

---

## Файл для изменения

| Файл | Изменения |
|------|-----------|
| `src/components/TableOfContents.tsx` | Добавить `processInlineMarkdown`, применить ко всем текстовым элементам |

---

## Проверочный тест

После изменений:

**БЫЛО:** `**Примеры:** Ксулат Микро, Дельта Зона`

**СТАНЕТ:** **Примеры:** Ксулат Микро, Дельта Зона (жирный текст)

---

## Места применения processInlineMarkdown

| Элемент | Строки в коде | Применить |
|---------|---------------|-----------|
| Заголовки H2 | `result += \`<h2...\`` | title → processInlineMarkdown(title) |
| Заголовки H3 | `result += \`<h3...\`` | title → processInlineMarkdown(title) |
| Параграфы | `result += \`<p>\${line}</p>\`` | line → processInlineMarkdown(line) |
| Списки | `result += \`<li>\${line.replace...}</li>\`` | Применить к содержимому |
| Таблицы | `${cell}` в processTable | cell → processInlineMarkdown(cell) |
| Blockquotes | blockquoteLines.join | Применить к каждой строке |
| Callouts | calloutLines.join | Применить к каждой строке |

---

## Ожидаемый результат

После изменений:
- Весь inline-markdown (`**bold**`, `*italic*`, `[links](url)`, `` `code` ``) корректно отображается как HTML
- Статьи выглядят профессионально без сырой markdown-разметки
- Улучшается читаемость и восприятие контента
