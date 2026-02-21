

# Перелинковка по географической близости

## Текущая проблема

Сейчас "соседние районы" выбираются по позиции в массиве `neighborhoodSlugs`:

```text
currentIndex - 2, currentIndex - 1, currentIndex + 1, currentIndex + 2
```

Это означает что "соседями" Арбата будут два предыдущих и два следующих элемента массива, которые могут быть в совершенно другом округе на другом конце Москвы.

## Решение

Использовать координаты `center: [lat, lng]` каждого района для вычисления реального расстояния и выбирать ближайшие районы.

### Алгоритм

1. Найти текущий район в массиве `neighborhoods` по slug
2. Вычислить расстояние до всех остальных районов из `topNeighborhoods` по формуле Haversine (или упрощённо -- евклидово расстояние по координатам, достаточно для масштаба Москвы)
3. Отсортировать по расстоянию, взять 4 ближайших
4. Дополнительно: приоритет районам из того же `districtId` (округа)

### Изменения в файле

**`src/components/InternalLinks.tsx`** -- единственный файл:

Заменить блоки выбора соседних районов (строки 70-111) на новую логику:

```text
// Вспомогательная функция расчёта расстояния
function getDistance(a: [number, number], b: [number, number]): number {
  const dlat = a[0] - b[0];
  const dlng = a[1] - b[1];
  return Math.sqrt(dlat * dlat + dlng * dlng);
}

// Находим текущий район
const currentNb = neighborhoods.find(n => n.slug === currentNeighborhood);

// Находим ближайшие районы из topNeighborhoods
const nearby = neighborhoods
  .filter(n => n.slug !== currentNeighborhood && topNeighborhoods.includes(n.slug))
  .map(n => ({
    ...n,
    distance: currentNb ? getDistance(currentNb.center, n.center) : Infinity,
    sameDistrict: currentNb ? n.districtId === currentNb.districtId : false
  }))
  .sort((a, b) => {
    // Сначала районы того же округа, потом по расстоянию
    if (a.sameDistrict && !b.sameDistrict) return -1;
    if (!a.sameDistrict && b.sameDistrict) return 1;
    return a.distance - b.distance;
  })
  .slice(0, 4);
```

Это заменит оба блока (строки 71-90 для НЧ-страниц и 91-111 для страниц районов).

### Результат

| До | После |
|---|---|
| Арбат -> соседи по массиву (случайные районы) | Арбат -> Хамовники, Пресненский, Якиманка, Тверской |
| Измайлово -> соседи по массиву | Измайлово -> Перово, Соколиная Гора, Богородское, Преображенское |
| Не учитывает округ | Приоритет районам того же округа |

