#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import ssl
import socket
import requests
from datetime import datetime, timezone, timedelta

SITE_URL           = os.getenv("SITE_URL", "https://goruslugimsk.ru")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID   = os.getenv("TELEGRAM_CHAT_ID")
YANDEX_METRIKA_TOKEN = os.getenv("YANDEX_METRIKA_TOKEN")
METRIKA_ID         = os.getenv("METRIKA_ID", "105828040")

KEY_URLS = [
    "/",
    "/uslugi/dezinfekciya/",
    "/uslugi/dezinsekciya/",
    "/blog/",
    "/contacts/",
    "/rajony/arbat/",
    "/moscow-oblast/khimki/",
]

# ---------- Статические данные (обновлять вручную) ----------

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

# ---------- Функции ----------

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


def build_message(url_results: list, ssl_info: dict, metrika: dict | None) -> str:
    msk   = timezone(timedelta(hours=3))
    now   = datetime.now(msk).strftime("%d.%m.%Y %H:%M MSK")
    lines = []

    # ── ШАПКА ──────────────────────────────────────────────
    all_ok   = all(r["ok"] for r in url_results)
    site_ico = "🟢" if all_ok else "🔴"
    ok_list  = [r for r in url_results if r["ok"]]
    avg_rt   = round(sum(r["response_time"] for r in ok_list) / len(ok_list)) if ok_list else 0

    lines += [
        "📊 Ежедневный мониторинг goruslugimsk.ru",
        f"🕐 {now}",
        "━━━━━━━━━━━━━━━━━━━━",
        "",
        f"{site_ico} Статус сайта (ср. отклик {avg_rt} мс)",
    ]
    for r in url_results:
        icon = "✅" if r["ok"] else "❌"
        path = r["url"].replace(SITE_URL, "") or "/"
        if r["ok"]:
            lines.append(f"{icon} {path} — {r['response_time']} мс")
        else:
            err = r.get("error", f"HTTP {r['status_code']}")
            lines.append(f"{icon} {path} — ОШИБКА ({err[:50]})")

    # ── SSL ────────────────────────────────────────────────
    lines.append("")
    lines.append("🔐 Сертификат")
    if ssl_info["ok"]:
        warn = " ⚠️ СКОРО ИСТЕКАЕТ!" if ssl_info["days_left"] < 30 else ""
        lines.append(f"• ✅ SSL до {ssl_info['expire_date']} ({ssl_info['days_left']} дн.){warn}")
    else:
        lines.append(f"• ❌ SSL — ОШИБКА ПРОВЕРКИ")

    # ── КОНТЕНТ ────────────────────────────────────────────
    cs = CONTENT_STATS
    lines += [
        "",
        "━━━━━━━━━━━━━━━━━━━━",
        "",
        "📄 Контент",
        f"• Всего страниц в SSG: ~{cs['total_ssg']}",
        f"• Блог (уникальных статей): {cs['blog']}",
        f"• Районы + округа: {cs['districts']}",
        f"• Города МО: {cs['mo_cities']}",
        f"• Услуги + подстраницы: {cs['services']}",
        f"• НЧ-страницы: {cs['nch_pages']}",
    ]

    # ── ИНДЕКСАЦИЯ ─────────────────────────────────────────
    idx = INDEXATION
    pct = round(idx["yandex"] / idx["target"] * 100)
    bar = "█" * (pct // 10) + "░" * (10 - pct // 10)
    lines += [
        "",
        "🔍 Индексация",
        f"• Цель: {idx['target']}+ стр. в Яндексе (к апрелю 2026)",
        f"• Яндекс: {idx['yandex']} стр. ({pct}%) [{bar}]",
        f"• Google: {idx['google']} стр.",
        "• Яндекс Вебмастер / GSC — проверить вручную",
    ]

    # ── PAGESPEED ──────────────────────────────────────────
    ps  = PAGESPEED
    mob_ico = "✅" if ps["mobile"] >= 95 else "⚠️"
    lines += [
        "",
        f"⚙️ PageSpeed (замер {ps['date']})",
        f"• Desktop: {ps['desktop']} ✅ | Mobile: {ps['mobile']} {mob_ico}",
        f"• LCP: {ps['lcp']} | CLS: {ps['cls']}",
    ]
    if ps["mobile"] < 95:
        lines.append(f"• 🎯 Цель Mobile 95+ (нужно +{95 - ps['mobile']} очков)")

    # ── ТРАФИК ─────────────────────────────────────────────
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

    # ── ЗАДАЧИ МАРТ 2026 ───────────────────────────────────
    lines += ["", "━━━━━━━━━━━━━━━━━━━━", "", "✅ Задачи (Март 2026)"]
    for i, (status, task) in enumerate(TASKS_MARCH, 1):
        lines.append(f"{i}. {status} {task}")

    # ── ЗАДАЧИ МАРТ–АПРЕЛЬ ─────────────────────────────────
    lines += ["", "🎯 Следующий этап (Март–Апрель 2026)"]
    for i, task in enumerate(TASKS_NEXT, 1):
        lines.append(f"{i}. {task}")

    # ── АЛЕРТЫ ────────────────────────────────────────────
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

    # ── ФУТЕР ─────────────────────────────────────────────
    lines += [
        "",
        "━━━━━━━━━━━━━━━━━━━━",
        "📝 <a href='https://github.com/TheGusev/sanit-solutions-spark/blob/main/MONITORING.md'>MONITORING.md</a>",
        "🤖 <a href='https://github.com/TheGusev/sanit-solutions-spark/actions'>Workflows</a>",
    ]
    return "
".join(lines)


def send_telegram(message: str):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram not configured, skipping")
        return
    api = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    for chunk in [message[i:i+4000] for i in range(0, len(message), 4000)]:
        try:
            requests.post(api, json={"chat_id": TELEGRAM_CHAT_ID, "text": chunk, "parse_mode": "HTML"}, timeout=10).raise_for_status()
            print("Telegram: chunk sent OK")
        except Exception as e:
            print(f"Telegram error: {e}")


# ---------- MAIN ----------

def main():
    print(f"[monitor] Start: {datetime.now()}")

    urls        = [f"{SITE_URL}{p}" if p != "/" else SITE_URL for p in KEY_URLS]
    url_results = [check_url(u) for u in urls]
    for r in url_results:
        print(f"  {'OK' if r['ok'] else 'FAIL'} {r['url']} {r['response_time']}ms")

    hostname = SITE_URL.replace("https://", "").replace("http://", "").split("/")[0]
    ssl_info = check_ssl(hostname)
    print(f"  SSL: {ssl_info}")

    metrika = fetch_metrika()
    print(f"  Metrika: {metrika}")

    message = build_message(url_results, ssl_info, metrika)
    print(\"\
--- PREVIEW ---\
\" + message + \"\
--- END ---\
\")

    send_telegram(message)
    print(\"[monitor] Done.\")


if __name__ == \"__main__\":
    main()
