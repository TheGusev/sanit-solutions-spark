
# Исправление меню «Услуги»: сворачивание подпунктов + порядок

## Проблема

1. Подменю Дезинсекции и Дератизации всегда раскрыты — занимают много места в дропдауне
2. «Борьба с кротами» и «Обработка участков» стоят в конце, а нужно сразу после «Дератизация»

## Изменения

### 1. Порядок в `servicesMenu` (строки 89–115)

Новый порядок:
1. Дезинсекция (с subItems)
2. Дератизация (с subItems)
3. Борьба с кротами
4. Обработка участков
5. Дезинфекция
6. Озонирование
7. Дезодорация
8. Демеркуризация

### 2. Подпункты скрыты по умолчанию — раскрываются по hover

Вместо того чтобы всегда показывать `subItems`, добавляем `group` с `hover:` — подпункты появляются при наведении на родительский пункт. Реализация: оборачиваем каждый пункт с subItems в `div` с `group` классом, а блок subItems получает `hidden group-hover:block`. Это работает и в десктопном дропдауне, и не ломает мобильное меню (в мобильном используется Accordion, он не затронут).

### Файл

| Файл | Правка |
|------|--------|
| `src/components/Header.tsx` | Переупорядочить массив `servicesMenu`; обернуть subItems в hover-группу (2 места: строки 171–193 и 230–252) |

### Детали hover-группы (desktop dropdown)

```tsx
<div key={service.href} className="group/sub relative">
  <DropdownMenuItem asChild>
    <Link to={service.href} className="cursor-pointer font-medium flex items-center justify-between">
      {service.title}
      {service.subItems.length > 0 && <ChevronDown className="w-3 h-3 ml-1" />}
    </Link>
  </DropdownMenuItem>
  {service.subItems.length > 0 && (
    <div className="pl-4 border-l-2 border-russia-red/30 ml-2 mb-1 hidden group-hover/sub:block">
      {service.subItems.map(...)}
    </div>
  )}
</div>
```

Мобильное меню (Sheet + Accordion) — остаётся без изменений, там уже работает через AccordionContent.
