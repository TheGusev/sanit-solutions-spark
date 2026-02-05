
# План: Увеличение видимости фоновых изображений на 50%

## Текущая ситуация

На сайте используются фоновые изображения с низкой прозрачностью, которые еле видны. Нужно увеличить их opacity на 50% от текущих значений.

## Места с фоновыми изображениями и новые значения

| Файл | Тип фона | Было (Desktop) | Станет | Было (Mobile) | Станет |
|------|----------|----------------|--------|---------------|--------|
| `HeroBackground.tsx` | Дефолт | 0.30 | **0.45** | +0.15 авто | +0.15 авто |
| `Blog.tsx` | Блог | 0.25 | **0.38** | ~0.40 | ~0.53 |
| `BlogPost.tsx` | Статья | 0.20 | **0.30** | ~0.35 | ~0.45 |
| `DistrictHero.tsx` | Округа | 0.35 | **0.52** | ~0.50 | ~0.67 |
| `ServicePestPage.tsx` | Вредители | Desktop 0.35, Mobile 0.50 | **0.52**, **0.75** | — | — |
| `NchPage.tsx` (слой 1) | Вредитель | Desktop 0.30, Mobile 0.45 | **0.45**, **0.68** | — | — |
| `NchPage.tsx` (слой 2) | Район | 0.15 | **0.23** | — | — |
| `NeighborhoodPage.tsx` | Район | 0.30 | **0.45** | нет отдельного | добавить |

## Изменения по файлам

### 1. `src/components/HeroBackground.tsx`
Увеличить дефолтные значения:
- `opacity = 0.30` → `opacity = 0.45`
- Автоматически mobileOpacity увеличится пропорционально

### 2. `src/pages/Blog.tsx`
```tsx
<HeroBackground 
  image="/images/neighborhoods/interior-park.png"
  blur={10}
  opacity={0.38}  // было 0.25
  overlay="gradient"
/>
```

### 3. `src/pages/BlogPost.tsx`
```tsx
<HeroBackground 
  image={getBlogCategoryImage(post.category)}
  blur={12}
  opacity={0.30}  // было 0.20
  overlay="gradient"
/>
```

### 4. `src/components/district/DistrictHero.tsx`
```tsx
<HeroBackground 
  image={heroImage}
  blur={8}
  opacity={0.52}  // было 0.35
  overlay="none"
/>
```

### 5. `src/pages/ServicePestPage.tsx`
Обновить два слоя:
- Мобильная версия: `opacity: 0.50` → `opacity: 0.75`
- Desktop версия: `opacity: 0.35` → `opacity: 0.52`

### 6. `src/pages/NchPage.tsx`
Обновить все три слоя:
- Слой 1 mobile: `opacity: 0.45` → `opacity: 0.68`
- Слой 1 desktop: `opacity: 0.30` → `opacity: 0.45`
- Слой 2 (район): `opacity: 0.15` → `opacity: 0.23`

### 7. `src/pages/NeighborhoodPage.tsx`
Текущий код имеет только один слой для обоих версий:
- Добавить отдельную мобильную версию
- Desktop: `opacity: 0.30` → `opacity: 0.45`
- Mobile: добавить новый слой с `opacity: 0.60`

## Также уменьшить overlay-градиенты

Чтобы изображения стали ещё заметнее, слегка снизить плотность градиентов поверх:

### `src/components/HeroBackground.tsx`
```css
/* Было */
from-background/70 via-background/50 to-background/40
from-background/30 via-transparent to-background/60

/* Станет */
from-background/60 via-background/40 to-background/30
from-background/20 via-transparent to-background/50
```

## Итоговый результат

После изменений фоновые изображения станут на ~50% заметнее:
- Блог: было едва видно → теперь отчётливо видно
- Районы: было размыто → теперь хорошо различимо
- Вредители: было слабо → теперь ярко (особенно на мобильных)

Текст останется читаемым благодаря сохранённым градиентным overlay'ам.
