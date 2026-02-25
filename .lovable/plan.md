

# Исправление 404 на /moscow-oblast/khimki/

## Диагностика

Страница `/moscow-oblast/khimki/` работает в SPA-режиме (проверено в превью). Проблема — на продакшене (goruslugimsk.ru), где сайт отдаётся через nginx как статический HTML, сгенерированный SSG.

Обнаружена рассинхронизация между данными городов и SSG-конфигурацией:

| Источник | Города |
|---|---|
| `src/data/moscowRegion.ts` | mytishchi, khimki, lyubertsy, balashikha, korolev, odintsovo, krasnogorsk, podolsk, **shchyolkovo**, **dolgoprudny** |
| `vite-plugin-ssg.ts` (строка 61) | khimki, mytishchi, balashikha, podolsk, korolev, lyubertsy, krasnogorsk, odintsovo, **domodedovo** |

Проблемы:
1. **`domodedovo`** есть в SSG, но отсутствует в данных → SSG пытается отрендерить несуществующую страницу → `NotFound` → может ломать весь SSG-процесс
2. **`shchyolkovo`** и **`dolgoprudny`** есть в данных, но отсутствуют в SSG → не генерируются статические HTML
3. Если SSG падает из-за domodedovo, то ВСЕ страницы moscow-oblast не генерируются, включая khimki

## Решение

Синхронизировать список городов в SSG с данными:

| Файл | Изменение |
|---|---|
| `vite-plugin-ssg.ts` (строка 61) | Заменить список на: `khimki, mytishchi, balashikha, podolsk, korolev, lyubertsy, krasnogorsk, odintsovo, shchyolkovo, dolgoprudny` — убрать `domodedovo`, добавить `shchyolkovo` и `dolgoprudny` |

Одно изменение в одном файле. После пересборки SSG сгенерирует корректные HTML для всех 10 городов, включая khimki.

