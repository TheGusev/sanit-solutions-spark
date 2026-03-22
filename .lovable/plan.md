

# Серверные 301-редиректы для районных URL

## Проблема

Сейчас `/uslugi/dezinfekciya/basmannyy/` и подобные URL отдают HTTP 200 + клиентский редирект через React `<Navigate>`. Яндекс видит 200, а не 301 — поисковый вес не передаётся на `/rajony/`.

## Решение

Добавить в `public/_redirects` явные 301-правила для каждого из ~130 районов × 3 услуги (dezinsekciya, dezinfekciya, deratizaciya) = ~390 строк. Также добавить аналогичные правила для 5 дополнительных услуг (dezodoraciya, ozonirovanie, sertifikaciya, fumigaciya, demerkurizaciya) где возможны утечки.

Wildcard-правила вида `/uslugi/:service/:slug` запрещены — они сломают рабочие pest/object маршруты (`/uslugi/dezinsekciya/tarakany/`). Поэтому только явные slugи.

## Файлы

| Файл | Действие |
|------|----------|
| `public/_redirects` | +~390 строк 301-редиректов для 3 основных услуг × ~130 районов |

## Формат каждой строки

```
/uslugi/dezinsekciya/arbat/    /rajony/arbat/    301
/uslugi/dezinfekciya/arbat/    /rajony/arbat/    301
/uslugi/deratizaciya/arbat/    /rajony/arbat/    301
```

Размещение: после блока "Anti-cannibalization" и перед блоком "renamed blog articles", чтобы правила срабатывали до SPA fallback.

## Полный список районов (130 шт.)

CAO (10): arbat, tverskoy, zamoskvorechye, khamovniki, presnensky, basmannyy, krasnoselsky, meshchansky, tagansky, yakimanka

SAO (16): aeroport, begovoy, sokol, voykovskiy, golovinsky, koptevo, timiryazevsky, khovrino, savelovsky, levoberezhny, dmitrovsky, zapadnoe-degunino, vostochnoe-degunino, beskudnikovsky, molzhaninovsky, khoroshevsky

SVAO (17): altufyevsky, babushkinsky, bibirevo, butyrsky, lianozovo, losinoostrovskiy, marfino, ostankinsky, otradnoe, rostokino, sviblovo, severny, severnoe-medvedkovo, yuzhnoe-medvedkovo, yaroslavsky, severny-rayon + ещё

ВАО (16): bogorodskoe, veshnyaki, vostochnoe-izmaylovo, vostochny, golyanovo, ivanovskoe, izmaylovo, kosino-ukhtomsky, metrogorodok, novogireevo, novokosino, perovo, preobrazhenskoe, severnoe-izmaylovo, sokolinaya-gora, sokolniki

ЮВАО (12): vykhino-zhulebino, kapotnya, kuzminki, lefortovo, lyublino, maryino, nekrasovka, nizhegorodsky, pechatniki, ryazansky, tekstilshchiki, yuzhnoport

ЮАО (16): biryulyovo-vostochnoe, biryulyovo-zapadnoe, brateevo, danilovsky, donskoy, zyablikovo, moskvorechye-saburovo, nagatino-sadovniki, nagatinsky-zaton, nagorny, orekhovo-borisovo-severnoe, orekhovo-borisovo-yuzhnoe, tsaritsyno, chertanovo-severnoe, chertanovo-tsentralnoe, chertanovo-yuzhnoe

ЮЗАО (12): akademichesky, gagarin, zyuzino, konkovo, kotlovka, lomonosovsky, obruchevsky, severnoe-butovo, tyoply-stan, cheryomushki, yuzhnoe-butovo, yasenevo

ЗАО (13): vnukovo, dorogomilovo, krylatskoe, kuntsevo, mozhaysky, novo-peredelkino, ochakovo-matveevskoe, prospekt-vernadskogo, ramenki, solntsevo, troparyovo-nikulino, filyovsky-park, fili-davydkovo

СЗАО (8): kurkino, mitino, pokrovskoe-streshnevo, severnoe-tushino, strogino, khoroshevo-mnevniki, shchukino, yuzhnoe-tushino

НАО+ТАО+ЗелАО (10): sosenskoe, vnukovskoe, troitsk, shcherbinka, moskovsky, zelenograd-1..5

Итого ~130 × 3 = ~390 строк. Файл вырастет, но это стандартная практика для серверных редиректов.

