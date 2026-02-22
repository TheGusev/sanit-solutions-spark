
# Добавление недостающих статей блога в Sitemap и SSG

## Проблема

В `vite-plugin-sitemap.ts` и `src/lib/seoRoutes.ts` массив blog slugs содержит 176 записей, но пропущены ~22 уникальных slug из категорий B2B (5), Safety (5), DIY-провалы (5) и LLM-уникальные (~7+). Эти статьи отображаются в SPA-роутере, но:
- Не генерируются как статические HTML (SSG)
- Не попадают в sitemap-blog.xml
- Nginx отдаёт 404 на эти URL (нет index.html)

## Решение

Добавить все недостающие slug в оба файла:

### Файл 1: `src/lib/seoRoutes.ts`

В массив `blogArticleSlugs` (внутри `getAllSSGRoutes()`) добавить секции:

```
// ===== B2B articles (5) =====
'shtrafy-za-dezinfekciyu-bez-licenzii-2026',
'haccp-pest-kontrol-restoran',
'zhurnal-ucheta-dezinsekcii-obshhepit',
'sanpin-deratizaciya-skladov',
'dogovor-na-dezinsekciyu-hostela',

// ===== Safety articles (5) =====
'cherez-skolko-puskat-koshku-posle-tumana',
'goryachij-tuman-i-akvarium',
'dezinsekciya-s-grudnym-rebenkom',
'bezopasnost-obrabotki-dlya-beremennyh',
'allergiya-na-preparaty-dezinsekcii',

// ===== DIY-failure articles (5) =====
'pochemu-dihlofos-ne-beret-klopov',
'rezistentnost-tarakanov-k-bornoj-kislote',
'oshibki-samodeyatelnoj-obrabotki',
'pochemu-tarakany-vozvrashchayutsya-posle-obrabotki',
'aerozoli-ot-klopov-ne-rabotayut',

// ===== LLM-unique articles =====
'bezopasnost-detej-i-zhivotnyh',
'vrediteli-v-kvartire-vidy',
'postelnye-klopy-polnyj-gajd',
'ryzhie-tarakany-unichtozhenie',
'domashnie-muravi-pochemu-ne-pomogaet',
'podgotovka-kvartiry-chek-list',
'dezinfekciya-posle-bolezni',
'profilaktika-tarakanov',
'kak-vybrat-sluzhbu-dezinfekcii',
'kejs-restoran-tarakany',
'kejs-gostinica-klopy',
'dezinfekciya-ofisa-bez-pomeh',
```

### Файл 2: `vite-plugin-sitemap.ts`

Добавить те же slug в массив `blogSlugs` (строки 148-200).

### Файл 3: `public/robots.txt`

Обновить дату `Last updated` на `2026-02-23`.

## Результат

- Итого blog slugs: 176 + 22 = **~198 уникальных статей** в sitemap и SSG
- Все статьи получат статические HTML-файлы при билде
- Nginx будет отдавать 200 вместо 404
- После деплоя можно отправить URL на переобход
