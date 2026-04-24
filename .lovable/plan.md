

# Финальный фикс: hydration mismatch на админке + другие admin-роуты

## Корень проблемы (точный диагноз)

1. `nginx.conf` строка 131-135: **все запросы к `/admin/*` фоллбекаются на `/index.html`** (это правильно, нужно для SPA-маршрутов).
2. Но `/index.html` в проде — это **полностью пре-рендеренная главная страница** (116 KB HTML), потому что SSG plugin переписывает шаблон-`index.html` контентом главной.
3. На клиенте `main.tsx` смотрит "есть ли SSG-контент в #root" → **есть** → вызывает `hydrateRoot(<App />)`.
4. React пытается гидратировать `<AdminLogin />` поверх HTML главной → **#418 hydration mismatch** → recovery render → форма залипает в `setIsLoading(true)`, замыкание `handleSubmit` теряет связь, `signInWithPassword` не дозовётся / promise теряется.

Доказательство: я только что подтвердил в браузерных логах что **именно на `/admin/login` всё ещё валится `Minified React error #418`**, несмотря на pre-hydration theme script (он ничего не решает в этом конкретном случае).

База нормальная: юзер `dpd.tuva@mail.ru` существует, email подтверждён, роль `admin` есть, последний успешный вход был 23 апреля. То есть пароль валиден и RLS на user_roles тоже корректен.

## Что сделаю

### Шаг 1 — Отдельный SPA-shell для `/admin/*` (главная правка)

Создам файл `dist/admin.html` (через SSG-плагин), который содержит **минимальный HTML без пре-рендеренного контента главной** — только `<div id="root"></div>`. nginx будет отдавать этот shell для `/admin/*`.

Конкретно:

**1.1.** В `vite-plugin-ssg.ts` (в `closeBundle()`) после генерации обычного `dist/index.html` добавлю:
```ts
// Generate clean SPA shell for admin routes (no SSG content → clean CSR hydration)
const adminShell = templateHtml
  .replace('<!--app-html-->', '')      // empty root content
  .replace(/<title[^>]*>.*?<\/title>/i, '<title>Админ-панель</title>')
  // strip helmet-injected meta from main page if any
  .replace(/<meta[^>]+data-rh="true"[^>]*>/g, '')
  .replace(/<link[^>]+data-rh="true"[^>]*>/g, '');
writeFileSync(resolve(distDir, 'admin.html'), adminShell);
```

**1.2.** В `nginx.conf` (строка 131-135) изменю fallback для `/admin/`:
```nginx
location ^~ /admin/ {
    try_files $uri $uri/ /admin.html;   # ← было /index.html
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header Cache-Control "no-cache, no-store, must-revalidate" always;
}
```

Теперь при заходе на `/admin/login` nginx отдаст **чистый shell** с пустым `<div id="root"></div>`. На клиенте `main.tsx` увидит что SSG-контента нет → пойдёт по ветке `createRoot(rootElement).render(<App />)` → **гидратация не выполняется, mismatch невозможен**.

### Шаг 2 — Подтверждение: AdminDashboard checkAuth уже корректен

`Dashboard.tsx` правильно делает `getSession()` + проверку роли. RLS-политика `Users can read own roles` (миграция 20251225...) уже разрешает аутентифицированному юзеру читать **свою** роль — без её проверки страница бы не открылась (а у нас была `single()` запрос с `eq('user_id', session.user.id)`).

### Шаг 3 — Обновить ссылку «Забыли пароль?» в Login.tsx

Сейчас она ведёт на `/admin/setup` — это правильно, там есть mode "Сбросить пароль". Юзер на скриншоте может вместо ожидания "Вход..." нажать "Забыли пароль?" и сбросить через секретный код. Не трогаем, оставляем как есть.

## Что НЕ трогаю

- **Бэкенд / RLS / БД / edge functions** — всё корректно. Юзер существует, роль есть, signInWithPassword отвечает.
- **`/admin/login`-компонент** — он рабочий, проблема ИСКЛЮЧИТЕЛЬНО в гидратации.
- **Главная страница, формы заявок, push** — те фиксы уже работают.
- **SSG для всех публичных страниц** — без изменений (главная/услуги/блог продолжают идти из своих pre-rendered файлов).

## Ожидаемый результат

После деплоя:
1. Открываете `https://goruslugimsk.ru/admin/login` → **в консоли НЕТ React error #418**.
2. Вводите email/пароль → жмёте «Войти» → **через 1-2 секунды редирект в `/admin`** (или тост «Неверный email/пароль» если пароль не тот).
3. То же самое работает для `/admin`, `/admin/setup`, `/admin/leads`, `/admin/settings` и т.д.
4. PWA на iPhone тоже начинает входить (там тот же баг гидратации).

## Файлы которые буду менять

- `vite-plugin-ssg.ts` — добавить генерацию `dist/admin.html` в `closeBundle()`. ~10 строк.
- `nginx.conf` — заменить `/index.html` на `/admin.html` в location `/admin/`. 1 строка.

Никаких изменений в SSG-маршрутах, валидации, frontend-логике или схеме БД.

## После моего деплоя

На сервере: дождаться автодеплоя через GitHub Actions (workflow `Deploy to Server` запустится после `Build and Push Docker Image`, ~5 минут). Либо вручную: `/root/deploy.sh`.

Затем — **жёсткий рефреш страницы /admin/login** (Cmd+Shift+R или в новом вкладе) чтобы сбросить кеш SW. И всё должно работать.

