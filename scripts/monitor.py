#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Расширенный мониторинг goruslugimsk.ru
- Проверка доступности ключевых URL + среднее время отклика
- SSL-сертификат (дни до истечения)
- Контент-статистика (SSG-страницы по типам)
- Индексация Яндекс / Google (с прогресс-баром к цели)
- PageSpeed Desktop / Mobile / LCP / CLS
- Яндекс.Метрика (визиты, посетители, просмотры, отказы, время)
- Задачи (март 2026) + следующий этап (март–апрель 2026)
- Алерты (недоступные URL, SSL < 30 дней)
- Telegram-отправка (HTML, чанки 4000 символов)
- Авто-обновление MONITORING.md
"""

import os
import sys
import ssl
import socket
import requests
from datetime import datetime, timezone, timedelta

# ─── ENV ──────────────────────────────────────────────────────
SITE_URL             = os.getenv("SITE_URL", "https://goruslugimsk.ru")
TELEGRAM_BOT_TOKEN   = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID     = os.getenv("TELEGRAM_CHAT_ID")
YANDEX_METRIKA_TOKEN = os.getenv("YANDEX_METRIKA_TOKEN")
METRIKA_ID           = os.getenv("METRIKA_ID", "105828040")

KEY_URLS = [
    "/",
    "/uslugi/dezinfekciya/",
    "/uslugi/dezinsekciya/",
    "/blog/",
    "/contacts/",
    "/rajony/arbat/",
    "/moscow-oblast/khimki/",
]

# ─── Статические данные (обновлять вручную при изменениях) ────
CONTENT_STATS = {
    "total_ssg": 547,
    "blog":      176,
    "districts": 145,
    "mo_cities":  51,
    "services":   51,
    "nch_pages": 120,
}

INDEXATION = {
    "yandex": 419,
    "google":  23,
    "target": 500,
}

PAGESPEED = {
    "desktop": 95,
    "mobile":  88,
    "lcp":  "0.95 с",
    "cls":  "0.04",
    "date": "05.03.2026",
}

TASKS_MARCH = [
    ("⬜", "Добавить 130 страниц дезинфекция+районы"),
    ("⬜", "Расширить страницы озонирование (объекты+районы)"),
    ("⬜", "Перенести гео-статьи кроты в коммерческие страницы"),
    ("⬜", "Добавить демеркуризация+объекты (квартиры, офисы, школы)"),
    ("⬜", "Внутренняя перелинковка блога → коммерческие страницы"),
    ("⬜", "Отправить sitemap-index.xml на переобход Яндекс/Google"),
    ("⬜", "Разбить рекламу на 4 группы (клопы/тараканы/крысы/дезинфекция)"),
    ("⬜", "Проверить позиции ТОП-10 через Serpstat/Яндекс.Вебмастер"),
]

TASKS_NEXT = [
    "НЧ-масштаб: +200 комбинаций дезинсекция+районы",
    "Страницы объектов: FAQ + блоки стоимости (офис, хостел)",
    "PageSpeed Mobile → 95+ (сейчас 88), lazy load + оптимизация CP",
    "Контент B2B: 10 лонгридов (СЭС, Роспотребнадзор, журналы дезучёта)",
    "A/B тесты лид-форм: 2 варианта квиза на страницах услуг",
    "Линкбилдинг: крауд-ссылки на коммерческие разделы",
    "Яндекс.Карты: новые фото, описание, 5-10 отзывов",
    "Авто-экспорт позиций из Яндекс.Вебмастера → Google Sheets",
]

COMPETITORS = [
    ("dezstation.ru",     "~300", "—"),
    ("procdez.ru",        "~200", "—"),
    ("eco-stolica.ru",    "~150", "—"),
    ("sanitexpert.ru",    "~180", "—"),
]

KEYWORDS_TRACKING = [
    ("уничтожение тараканов москва",       "/uslugi/dezinsekciya/", "—"),
    ("дезинфекция квартиры москва",        "/uslugi/dezinfekciya/", "—"),
    ("уничтожение клопов москва",          "/uslugi/dezinsekciya/", "—"),
    ("дератизация москва",                 "/uslugi/deratizaciya/", "—"),
    ("обработка от тараканов цена",        "/uslugi/dezinsekciya/", "—"),
    ("санитарная обработка помещений",     "/uslugi/dezinfekciya/", "—"),
    ("озонирование помещений москва",      "/uslugi/ozonirovanie/", "—"),
    ("уничтожение крыс в доме",           "/uslugi/deratizaciya/", "—"),
]


# ─── Функции проверки ─────────────────────────────────────────

def check_url(url: str, timeout: int = 15) -> dict:
    try:
        r = requests.get(url, timeout=timeout, allow_redirects=True)
        return {
            "url": url,
            "status_code": r.status_code,
            "response_time": round(r.elapsed.total_seconds() * 1000),
            "ok": r.status_code == 200,
        }
    except Exception as e:
        return {"url": url, "status_code": 0, "response_time": 0, "ok": False, "error": str(e)}


def check_ssl(hostname: str) -> dict:
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
            s.settimeout(10)
            s.connect((hostname, 443))
            cert = s.getpeercert()
        expire_dt = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
        days_left = (expire_dt - datetime.now(timezone.utc)).days
        return {"ok": True, "days_left": days_left, "expire_date": expire_dt.strftime("%d.%m.%Y")}
    except Exception as e:
        return {"ok": False, "days_left": 0, "expire_date": "—", "error": str(e)}


def fetch_metrika() -> dict | None:
    if not YANDEX_METRIKA_TOKEN:
        return None
    url = (
        "https://api-metrika.yandex.net/stat/v1/data"
        f"?ids={METRIKA_ID}"
        "&metrics=ym:s:visits,ym:s:users,ym:s:pageviews,ym:s:bounceRate,ym:s:avgVisitDurationSeconds"
        "&date1=30daysago&date2=today"
    )
    try:
        m = requests.get(url, headers={"Authorization": f"OAuth {YANDEX_METRIKA_TOKEN}"}, timeout=15).json()["totals"]
        return {
            "visits":   int(m[0]),
            "users":    int(m[1]),
            "views":    int(m[2]),
            "bounce":   round(m[3], 1),
            "duration": f"{int(m[4]//60)}м {int(m[4]%60)}с",
        }
    except Exception as e:
        print(f"Metrika error: {e}")
        return None


def fmt_num(n: int) -> str:
    return f"{n:,}".replace(",", " ")


# ─── Telegram-сообщение ──────────────────────────────────────

def build_telegram_message(url_results: list, ssl_info: dict, metrika: dict | None) -> str:
    msk = timezone(timedelta(hours=3))
    now = datetime.now(msk).strftime("%d.%m.%Y %H:%M MSK")
    lines = []

    # Шапка
    all_ok = all(r["ok"] for r in url_results)
    ok_list = [r for r in url_results if r["ok"]]
    avg_rt = round(sum(r["response_time"] for r in ok_list) / len(ok_list)) if ok_list else 0

    lines += [
        "📊 Ежедневный мониторинг goruslugimsk.ru",
        f"🕐 {now}",
        "━━━━━━━━━━━━━━━━━━━━",
        "",
        f"{'🟢' if all_ok else '🔴'} Статус сайта (ср. отклик {avg_rt} мс)",
    ]
    for r in url_results:
        path = r["url"].replace(SITE_URL, "") or "/"
        if r["ok"]:
            lines.append(f"✅ {path} — {r['response_time']} мс")
        else:
            err = r.get("error", f"HTTP {r['status_code']}")
            lines.append(f"❌ {path} — ОШИБКА ({err[:50]})")

    # SSL
    lines += ["", "🔐 Сертификат"]
    if ssl_info["ok"]:
        warn = " ⚠️ СКОРО ИСТЕКАЕТ!" if ssl_info["days_left"] < 30 else ""
        lines.append(f"• ✅ SSL до {ssl_info['expire_date']} ({ssl_info['days_left']} дн.){warn}")
    else:
        lines.append("• ❌ SSL — ОШИБКА ПРОВЕРКИ")

    # Контент
    cs = CONTENT_STATS
    lines += [
        "", "━━━━━━━━━━━━━━━━━━━━", "",
        "📄 Контент",
        f"• Всего страниц в SSG: ~{cs['total_ssg']}",
        f"• Блог (уникальных статей): {cs['blog']}",
        f"• Районы + округа: {cs['districts']}",
        f"• Города МО: {cs['mo_cities']}",
        f"• Услуги + подстраницы: {cs['services']}",
        f"• НЧ-страницы: {cs['nch_pages']}",
    ]

    # Индексация
    idx = INDEXATION
    pct = round(idx["yandex"] / idx["target"] * 100)
    bar = "█" * (pct // 10) + "░" * (10 - pct // 10)
    lines += [
        "", "🔍 Индексация",
        f"• Цель: {idx['target']}+ стр. в Яндексе (к апрелю 2026)",
        f"• Яндекс: {idx['yandex']} стр. ({pct}%) [{bar}]",
        f"• Google: {idx['google']} стр.",
        "• Яндекс Вебмастер / GSC — проверить вручную",
    ]

    # PageSpeed
    ps = PAGESPEED
    mob_ico = "✅" if ps["mobile"] >= 95 else "⚠️"
    lines += [
        "", f"⚙️ PageSpeed (замер {ps['date']})",
        f"• Desktop: {ps['desktop']} ✅ | Mobile: {ps['mobile']} {mob_ico}",
        f"• LCP: {ps['lcp']} | CLS: {ps['cls']}",
    ]
    if ps["mobile"] < 95:
        lines.append(f"• 🎯 Цель Mobile 95+ (нужно +{95 - ps['mobile']} очков)")

    # Трафик
    lines += ["", "━━━━━━━━━━━━━━━━━━━━", "", "📈 Трафик (Яндекс.Метрика, 30 дней)"]
    if metrika:
        lines += [
            f"• Визиты:     {fmt_num(metrika['visits'])}",
            f"• Посетители: {fmt_num(metrika['users'])}",
            f"• Просмотры:  {fmt_num(metrika['views'])}",
            f"• Отказы:     {metrika['bounce']}%",
            f"• Время:      {metrika['duration']}",
        ]
    else:
        lines.append("• ℹ️ YANDEX_METRIKA_TOKEN не задан — данные недоступны")

    # Задачи март
    lines += ["", "━━━━━━━━━━━━━━━━━━━━", "", "✅ Задачи (Март 2026)"]
    for i, (status, task) in enumerate(TASKS_MARCH, 1):
        lines.append(f"{i}️⃣ {status} {task}")

    # Задачи март-апрель
    lines += ["", "🎯 Следующий этап (Март–Апрель 2026)"]
    for i, task in enumerate(TASKS_NEXT, 1):
        lines.append(f"{i}. {task}")

    # Алерты
    alerts = []
    for r in url_results:
        if not r["ok"]:
            path = r["url"].replace(SITE_URL, "") or "/"
            alerts.append(f"❌ {path} — HTTP {r['status_code']}")
    if ssl_info.get("days_left", 99) < 30 and ssl_info["ok"]:
        alerts.append(f"⚠️ SSL истекает через {ssl_info['days_left']} дней!")
    if alerts:
        lines += ["", "━━━━━━━━━━━━━━━━━━━━", "", "🚨 Алерты"]
        for a in alerts:
            lines.append(f"• {a}")

    # Футер
    lines += [
        "", "━━━━━━━━━━━━━━━━━━━━",
        "📝 <a href='https://github.com/TheGusev/sanit-solutions-spark/blob/main/MONITORING.md'>MONITORING.md</a>",
        "🤖 <a href='https://github.com/TheGusev/sanit-solutions-spark/actions'>Workflows</a>",
    ]
    return "\n".join(lines)


# ─── MONITORING.md ────────────────────────────────────────────

def update_monitoring_md(url_results: list, ssl_info: dict, metrika: dict | None):
    msk = timezone(timedelta(hours=3))
    now_date = datetime.now(msk).strftime("%d.%m.%Y")
    now_full = datetime.now(msk).strftime("%d.%m.%Y %H:%M MSK")

    all_ok = all(r["ok"] for r in url_results)
    ok_list = [r for r in url_results if r["ok"]]
    avg_rt = round(sum(r["response_time"] for r in ok_list) / len(ok_list)) if ok_list else 0

    cs = CONTENT_STATS
    idx = INDEXATION
    ps = PAGESPEED
    pct = round(idx["yandex"] / idx["target"] * 100)

    md = f"""Контекст: автоматизированный мониторинг goruslugimsk.ru. Данные обновляются ежедневно через GitHub Actions.

# 🤖 MONITORING.md — Авто-мониторинг goruslugimsk.ru
**Дата последнего обновления:** {now_date} **Статус системы:** {'🟢 ONLINE' if all_ok else '🔴 ЕСТЬ ПРОБЛЕМЫ'}
**Ответственный:** Comet (Auto-bot) **Проект:** Санитарные Решения
**Средний отклик:** {avg_rt} мс

## 📊 Оглавление
- [Статус сайта](#-статус-сайта)
- [SSL-сертификат](#-ssl-сертификат)
- [Индексация](#-индексация)
- [Позиции в поиске](#-позиции-в-поиске-яндекс)
- [Трафик и аудитория](#-трафик-и-аудитория)
- [Конверсии и воронка](#-конверсии-и-воронка)
- [Технические показатели](#-технические-показатели-pagespeed)
- [Конкуренты](#-конкуренты)
- [Контент и структура](#-контент-и-структура)
- [Внешние факторы](#-внешние-факторы)
- [Алерты и проблемы](#-алерты-и-проблемы)
- [Задачи Март 2026](#-задачи-март-2026)
- [Задачи Март-Апрель 2026](#-задачи-март-апрель-2026)
- [Результаты периода](#-результаты-периода)

---

## 🟢 Статус сайта

| URL | Статус | Время отклика |
|---|---|---|
"""
    for r in url_results:
        path = r["url"].replace(SITE_URL, "") or "/"
        status = "✅ 200" if r["ok"] else f"❌ {r['status_code']}"
        rt = f"{r['response_time']} мс" if r["ok"] else "—"
        md += f"| {path} | {status} | {rt} |\n"

    md += f"""
## 🔐 SSL-сертификат

| Параметр | Значение |
|---|---|
| Статус | {'✅ Активен' if ssl_info['ok'] else '❌ Ошибка'} |
| Истекает | {ssl_info['expire_date']} |
| Дней до истечения | {ssl_info['days_left']} |
| Предупреждение | {'⚠️ Менее 30 дней!' if ssl_info['days_left'] < 30 and ssl_info['ok'] else '—'} |

## 🔍 Индексация

| Поисковик | Страниц в индексе | Цель | Прогресс |
|---|---|---|---|
| Яндекс | {idx['yandex']} | {idx['target']}+ | {pct}% |
| Google | {idx['google']} | — | — |

**KPI:** {idx['target']}+ страниц в Яндексе к апрелю 2026 ({pct}% выполнено)

### Детализация индексации (Яндекс)
| Тип | Всего | В индексе | Примечание |
|---|---|---|---|
| Главная | 1 | ✅ | — |
| Услуги + подстраницы | {cs['services']} | ✅ | — |
| Блог | {cs['blog']} | ✅ | — |
| Районы + округа | {cs['districts']} | ✅ | — |
| Города МО | {cs['mo_cities']} | ⚠️ Частично | Проверить в Вебмастере |
| НЧ-страницы | {cs['nch_pages']} | ⚠️ Частично | Новые, ждут индексации |

## 📈 Позиции в поиске (Яндекс)

| Запрос | Целевая страница | Позиция | Изменение |
|---|---|---|---|
"""
    for kw, page, pos in KEYWORDS_TRACKING:
        md += f"| {kw} | {page} | {pos} | — |\n"

    md += """
> Позиции обновляются вручную через Яндекс.Вебмастер / Serpstat

## 👥 Трафик и аудитория

| Период | Визиты | Посетители | Просмотры | Отказы | Время |
|---|---|---|---|---|---|
"""
    if metrika:
        month_label = datetime.now(msk).strftime("%B %Y")
        md += f"| {month_label} | {fmt_num(metrika['visits'])} | {fmt_num(metrika['users'])} | {fmt_num(metrika['views'])} | {metrika['bounce']}% | {metrika['duration']} |\n"
    else:
        md += "| — | — | — | — | — | — |\n"
        md += "\n> ℹ️ Для автоматического обновления добавьте `YANDEX_METRIKA_TOKEN` в GitHub Secrets\n"

    md += f"""
## 📊 Конверсии и воронка

| Точка входа | Лиды | CR | Примечание |
|---|---|---|---|
| Квиз (ServiceQuiz) | — | — | Основная форма |
| Калькулятор (Calculator) | — | — | Расчёт стоимости |
| Sticky-бар (StickyCTA) | — | — | Мобильный CTA |
| Быстрый звонок (QuickCallForm) | — | — | Форма обратного звонка |
| Мессенджеры (WhatsApp/Telegram) | — | — | Внешние каналы |
| Прямой звонок | — | — | По номеру телефона |

> Данные обновлять вручную из CRM / Яндекс.Метрики

## ⚙️ Технические показатели (PageSpeed)

| Страница | Desktop | Mobile | LCP | CLS | Дата замера |
|---|---|---|---|---|---|
| Главная (/) | {ps['desktop']} | {ps['mobile']} | {ps['lcp']} | {ps['cls']} | {ps['date']} |

**Цели:** Desktop 95+ ✅ | Mobile 95+ {'✅' if ps['mobile'] >= 95 else f"⚠️ (сейчас {ps['mobile']}, нужно +{95 - ps['mobile']})"} | LCP < 2.5с ✅ | CLS < 0.1 ✅

## 🏆 Конкуренты

| Домен | Страниц в индексе (оценка) | Позиции ВЧ |
|---|---|---|
"""
    for domain, pages, positions in COMPETITORS:
        md += f"| {domain} | {pages} | {positions} |\n"

    md += f"""
> Обновлять данные конкурентов ежемесячно через Serpstat / Ahrefs

## 📄 Контент и структура

| Тип страниц | Количество | SSG | Sitemap | Статус |
|---|---|---|---|---|
| Главная | 1 | ✅ | ✅ | ✅ |
| Услуги (основные) | 8 | ✅ | ✅ | ✅ |
| Подстраницы услуг | {cs['services'] - 8} | ✅ | ✅ | ✅ |
| Блог | {cs['blog']} | ✅ | ✅ | ✅ |
| Районы Москвы | {cs['districts']} | ✅ | ✅ | ✅ |
| Города МО | {cs['mo_cities']} | ✅ | ✅ | ✅ |
| НЧ-комбинации | {cs['nch_pages']} | ✅ | ✅ | ⚠️ Новые |
| Контакты | 1 | ✅ | ✅ | ✅ |
| Политика / Условия | 2 | ✅ | ✅ | ✅ |
| **ИТОГО** | **~{cs['total_ssg']}** | | | |

## 🌐 Внешние факторы

| Фактор | Статус | Примечание |
|---|---|---|
| SSL-сертификат | {'✅ Активен' if ssl_info['ok'] else '❌ Ошибка'} | До {ssl_info['expire_date']} ({ssl_info['days_left']} дн.) |
| robots.txt | ✅ Актуален | /robots.txt |
| sitemap-index.xml | ✅ Актуален | Автогенерация через Vite |
| Яндекс.Вебмастер | ✅ Подключен | Верификация пройдена |
| Google Search Console | ✅ Подключен | Верификация пройдена |
| Яндекс.Метрика | ✅ Счётчик {METRIKA_ID} | Работает |

## 🚨 Алерты и проблемы

| Проблема | Обнаружена | Приоритет | Статус |
|---|---|---|---|
"""
    has_alerts = False
    for r in url_results:
        if not r["ok"]:
            has_alerts = True
            path = r["url"].replace(SITE_URL, "") or "/"
            md += f"| URL {path} недоступен (HTTP {r['status_code']}) | {now_date} | ⚠️ Высокий | 🔴 Активна |\n"
    if ssl_info.get("days_left", 99) < 30 and ssl_info["ok"]:
        has_alerts = True
        md += f"| SSL истекает через {ssl_info['days_left']} дней | {now_date} | 🔴 Критический | 🔴 Активна |\n"
    if not has_alerts:
        md += "| Нет активных проблем | — | — | 🟢 |\n"

    md += """
## ✅ Задачи (Март 2026)

| # | Задача | Статус |
|---|---|---|
"""
    for i, (status, task) in enumerate(TASKS_MARCH, 1):
        label = "✅ Выполнено" if status == "✅" else "⬜ В работе"
        md += f"| {i} | {task} | {label} |\n"

    md += """
## 🎯 Задачи (Март–Апрель 2026)

| # | Задача |
|---|---|
"""
    for i, task in enumerate(TASKS_NEXT, 1):
        md += f"| {i} | {task} |\n"

    md += f"""
## 📋 Результаты периода

| Метрика | Значение | Период |
|---|---|---|
| Страниц в индексе (Яндекс) | {idx['yandex']} | Март 2026 |
| Страниц в индексе (Google) | {idx['google']} | Март 2026 |
| Desktop PageSpeed | {ps['desktop']} | {ps['date']} |
| Mobile PageSpeed | {ps['mobile']} | {ps['date']} |
| SSG страниц всего | ~{cs['total_ssg']} | Март 2026 |

---
**Последнее автоматическое обновление:** {now_full}
"""

    with open("MONITORING.md", "w", encoding="utf-8") as f:
        f.write(md)
    print("MONITORING.md updated")


# ─── Telegram ─────────────────────────────────────────────────

def send_telegram(message: str):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram not configured, skipping")
        return
    api = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    for chunk in [message[i:i+4000] for i in range(0, len(message), 4000)]:
        try:
            resp = requests.post(api, json={
                "chat_id": TELEGRAM_CHAT_ID,
                "text": chunk,
                "parse_mode": "HTML",
                "disable_web_page_preview": True,
            }, timeout=10)
            resp.raise_for_status()
            print("Telegram: chunk sent OK")
        except Exception as e:
            print(f"Telegram error: {e}")


# ─── MAIN ─────────────────────────────────────────────────────

def main():
    print(f"[monitor] Start: {datetime.now()}")

    # 1. URL checks
    urls = [f"{SITE_URL}{p}" if p != "/" else SITE_URL for p in KEY_URLS]
    url_results = [check_url(u) for u in urls]
    for r in url_results:
        print(f"  {'OK' if r['ok'] else 'FAIL'} {r['url']} {r['response_time']}ms")

    # 2. SSL check
    hostname = SITE_URL.replace("https://", "").replace("http://", "").split("/")[0]
    ssl_info = check_ssl(hostname)
    print(f"  SSL: {ssl_info}")

    # 3. Metrika
    metrika = fetch_metrika()
    print(f"  Metrika: {metrika}")

    # 4. Build & send Telegram
    message = build_telegram_message(url_results, ssl_info, metrika)
    print("\n--- TELEGRAM PREVIEW ---")
    print(message)
    print("--- END ---\n")
    send_telegram(message)

    # 5. Update MONITORING.md
    update_monitoring_md(url_results, ssl_info, metrika)

    print("[monitor] Done.")


if __name__ == "__main__":
    main()
