#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Автоматизированный мониторинг goruslugimsk.ru
Все данные получаются динамически:
- URL доступность + время отклика
- SSL сертификат
- SSG страницы из sitemap-index.xml
- PageSpeed через Google API
- Трафик из Яндекс.Метрики
- Индексация из env (GitHub Secrets)
"""

import os
import sys
import ssl
import socket
import requests
from datetime import datetime, timezone, timedelta
from xml.etree import ElementTree as ET

# ─── ENV ──────────────────────────────────────────────────────
SITE_URL             = os.getenv("SITE_URL", "https://goruslugimsk.ru")
TELEGRAM_BOT_TOKEN   = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID     = os.getenv("TELEGRAM_CHAT_ID")
YANDEX_METRIKA_TOKEN = os.getenv("YANDEX_METRIKA_TOKEN")
METRIKA_ID           = os.getenv("METRIKA_ID", "105828040")
YANDEX_INDEXED       = os.getenv("YANDEX_INDEXED", "")
GOOGLE_INDEXED       = os.getenv("GOOGLE_INDEXED", "")

KEY_URLS = [
    "/",
    "/uslugi/dezinfekciya/",
    "/uslugi/dezinsekciya/",
    "/uslugi/deratizaciya/",
    "/blog/",
    "/contacts/",
    "/rajony/arbat/",
    "/moscow-oblast/khimki/",
]

# Паттерны для категоризации URL из sitemap
SITEMAP_CATEGORIES = {
    "services":  "/uslugi/",
    "blog":      "/blog/",
    "districts": "/rajony/",
    "mo_cities": "/moscow-oblast/",
    "nch":       "/nch/",
}


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


def fetch_sitemap_stats() -> dict:
    """Парсит sitemap-index.xml и считает URL по категориям."""
    stats = {"total": 0, "services": 0, "blog": 0, "districts": 0, "mo_cities": 0, "nch": 0, "other": 0}
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    try:
        index_url = f"{SITE_URL}/sitemap-index.xml"
        resp = requests.get(index_url, timeout=15)
        resp.raise_for_status()
        root = ET.fromstring(resp.content)

        sitemap_urls = [loc.text for loc in root.findall(".//sm:loc", ns) if loc.text]
        if not sitemap_urls:
            sitemap_urls = [loc.text for loc in root.findall(".//loc") if loc.text]

        for sm_url in sitemap_urls:
            try:
                sm_resp = requests.get(sm_url, timeout=15)
                sm_resp.raise_for_status()
                sm_root = ET.fromstring(sm_resp.content)

                locs = [loc.text for loc in sm_root.findall(".//sm:loc", ns) if loc.text]
                if not locs:
                    locs = [loc.text for loc in sm_root.findall(".//loc") if loc.text]

                for loc in locs:
                    stats["total"] += 1
                    categorized = False
                    for cat, pattern in SITEMAP_CATEGORIES.items():
                        if pattern in loc:
                            stats[cat] += 1
                            categorized = True
                            break
                    if not categorized:
                        stats["other"] += 1
            except Exception as e:
                print(f"  Sitemap parse error ({sm_url}): {e}")
    except Exception as e:
        print(f"  Sitemap index error: {e}")

    return stats


def fetch_pagespeed(url: str, strategy: str = "desktop") -> dict:
    """Вызывает Google PageSpeed Insights API (бесплатный)."""
    api = (
        f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
        f"?url={url}&strategy={strategy}&category=performance"
    )
    try:
        resp = requests.get(api, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        lhr = data.get("lighthouseResult", {})
        cats = lhr.get("categories", {})
        audits = lhr.get("audits", {})

        score = round((cats.get("performance", {}).get("score", 0)) * 100)
        lcp_ms = audits.get("largest-contentful-paint", {}).get("numericValue", 0)
        cls_val = audits.get("cumulative-layout-shift", {}).get("numericValue", 0)

        return {
            "score": score,
            "lcp": round(lcp_ms / 1000, 2),
            "cls": round(cls_val, 3),
        }
    except Exception as e:
        print(f"  PageSpeed error ({strategy}): {e}")
        return {"score": 0, "lcp": 0, "cls": 0}


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

def build_telegram_message(
    url_results: list, ssl_info: dict, sitemap: dict,
    ps_desktop: dict, ps_mobile: dict, metrika: dict | None,
    idx_yandex: str, idx_google: str,
) -> str:
    msk = timezone(timedelta(hours=3))
    now = datetime.now(msk).strftime("%d.%m.%Y %H:%M MSK")
    lines = []

    all_ok = all(r["ok"] for r in url_results)
    ok_list = [r for r in url_results if r["ok"]]
    avg_rt = round(sum(r["response_time"] for r in ok_list) / len(ok_list)) if ok_list else 0

    lines += [
        "📊 Мониторинг goruslugimsk.ru",
        f"🕐 {now}",
        "━━━━━━━━━━━━━━━━━━━━",
        "",
        f"{'🟢' if all_ok else '🔴'} Статус (ср. отклик {avg_rt} мс)",
    ]
    for r in url_results:
        path = r["url"].replace(SITE_URL, "") or "/"
        if r["ok"]:
            lines.append(f"✅ {path} — {r['response_time']} мс")
        else:
            err = r.get("error", f"HTTP {r['status_code']}")
            lines.append(f"❌ {path} — ({err[:50]})")

    # SSL
    lines += ["", "🔐 SSL"]
    if ssl_info["ok"]:
        warn = " ⚠️ СКОРО!" if ssl_info["days_left"] < 30 else ""
        lines.append(f"• До {ssl_info['expire_date']} ({ssl_info['days_left']} дн.){warn}")
    else:
        lines.append("• ❌ ОШИБКА")

    # Контент из sitemap
    lines += [
        "", "📄 Контент (sitemap)",
        f"• Всего URL: {sitemap['total']}",
        f"• Услуги: {sitemap['services']} | Блог: {sitemap['blog']}",
        f"• Районы: {sitemap['districts']} | МО: {sitemap['mo_cities']}",
        f"• НЧ: {sitemap['nch']} | Прочее: {sitemap['other']}",
    ]

    # Индексация
    if idx_yandex or idx_google:
        lines += ["", "🔍 Индексация"]
        if idx_yandex:
            lines.append(f"• Яндекс: {idx_yandex} стр.")
        if idx_google:
            lines.append(f"• Google: {idx_google} стр.")

    # PageSpeed
    lines += [
        "", "⚙️ PageSpeed (сегодня)",
        f"• Desktop: {ps_desktop['score']} | Mobile: {ps_mobile['score']}",
        f"• LCP: {ps_desktop['lcp']}с / {ps_mobile['lcp']}с",
        f"• CLS: {ps_desktop['cls']} / {ps_mobile['cls']}",
    ]

    # Трафик
    if metrika:
        lines += [
            "", "📈 Трафик (30 дн.)",
            f"• Визиты: {fmt_num(metrika['visits'])} | Посетители: {fmt_num(metrika['users'])}",
            f"• Отказы: {metrika['bounce']}% | Время: {metrika['duration']}",
        ]

    # Алерты
    alerts = []
    for r in url_results:
        if not r["ok"]:
            path = r["url"].replace(SITE_URL, "") or "/"
            alerts.append(f"❌ {path}")
    if ssl_info.get("days_left", 99) < 30 and ssl_info["ok"]:
        alerts.append(f"⚠️ SSL через {ssl_info['days_left']} дн.")
    if ps_mobile["score"] > 0 and ps_mobile["score"] < 90:
        alerts.append(f"⚠️ Mobile PageSpeed: {ps_mobile['score']}")
    if alerts:
        lines += ["", "🚨 Алерты"]
        for a in alerts:
            lines.append(f"• {a}")

    return "\n".join(lines)


# ─── MONITORING.md ────────────────────────────────────────────

def update_monitoring_md(
    url_results: list, ssl_info: dict, sitemap: dict,
    ps_desktop: dict, ps_mobile: dict, metrika: dict | None,
    idx_yandex: str, idx_google: str,
):
    msk = timezone(timedelta(hours=3))
    now_date = datetime.now(msk).strftime("%d.%m.%Y")
    now_full = datetime.now(msk).strftime("%d.%m.%Y %H:%M MSK")

    all_ok = all(r["ok"] for r in url_results)
    ok_list = [r for r in url_results if r["ok"]]
    avg_rt = round(sum(r["response_time"] for r in ok_list) / len(ok_list)) if ok_list else 0

    md = f"""Контекст: автоматизированный мониторинг goruslugimsk.ru. Все данные обновляются ежедневно через GitHub Actions.

# 🤖 MONITORING.md — Авто-мониторинг goruslugimsk.ru
**Дата:** {now_date} | **Статус:** {'🟢 ONLINE' if all_ok else '🔴 ЕСТЬ ПРОБЛЕМЫ'} | **Средний отклик:** {avg_rt} мс

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

## 📄 Контент (из sitemap)

| Категория | Количество URL |
|---|---|
| Услуги | {sitemap['services']} |
| Блог | {sitemap['blog']} |
| Районы Москвы | {sitemap['districts']} |
| Города МО | {sitemap['mo_cities']} |
| НЧ-страницы | {sitemap['nch']} |
| Прочее | {sitemap['other']} |
| **Всего** | **{sitemap['total']}** |

## 🔍 Индексация

| Поисковик | Страниц в индексе |
|---|---|
| Яндекс | {idx_yandex if idx_yandex else '— (задайте YANDEX_INDEXED в Secrets)'} |
| Google | {idx_google if idx_google else '— (задайте GOOGLE_INDEXED в Secrets)'} |

> Обновляйте `YANDEX_INDEXED` и `GOOGLE_INDEXED` в GitHub Secrets по данным Вебмастера / GSC.

## ⚙️ PageSpeed (автозамер)

| Метрика | Desktop | Mobile |
|---|---|---|
| Performance Score | {ps_desktop['score']} | {ps_mobile['score']} |
| LCP | {ps_desktop['lcp']} с | {ps_mobile['lcp']} с |
| CLS | {ps_desktop['cls']} | {ps_mobile['cls']} |

"""

    # Трафик
    md += "## 📈 Трафик (Яндекс.Метрика, 30 дней)\n\n"
    if metrika:
        md += f"""| Метрика | Значение |
|---|---|
| Визиты | {fmt_num(metrika['visits'])} |
| Посетители | {fmt_num(metrika['users'])} |
| Просмотры | {fmt_num(metrika['views'])} |
| Отказы | {metrika['bounce']}% |
| Ср. время | {metrika['duration']} |
"""
    else:
        md += "> ℹ️ Для автоматического обновления добавьте `YANDEX_METRIKA_TOKEN` в GitHub Secrets\n"

    # Алерты
    md += "\n## 🚨 Алерты\n\n"
    has_alerts = False
    alert_rows = ""
    for r in url_results:
        if not r["ok"]:
            has_alerts = True
            path = r["url"].replace(SITE_URL, "") or "/"
            alert_rows += f"| URL {path} недоступен | ⚠️ Высокий | 🔴 |\n"
    if ssl_info.get("days_left", 99) < 30 and ssl_info["ok"]:
        has_alerts = True
        alert_rows += f"| SSL истекает через {ssl_info['days_left']} дней | 🔴 Критический | 🔴 |\n"
    if ps_mobile["score"] > 0 and ps_mobile["score"] < 90:
        has_alerts = True
        alert_rows += f"| Mobile PageSpeed {ps_mobile['score']} (цель 90+) | ⚠️ Средний | 🟡 |\n"

    if has_alerts:
        md += "| Проблема | Приоритет | Статус |\n|---|---|---|\n" + alert_rows
    else:
        md += "✅ Нет активных проблем\n"

    md += f"""
---
**Последнее обновление:** {now_full}
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
            print("Telegram: sent OK")
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

    # 2. SSL
    hostname = SITE_URL.replace("https://", "").replace("http://", "").split("/")[0]
    ssl_info = check_ssl(hostname)
    print(f"  SSL: {ssl_info}")

    # 3. Sitemap stats
    print("  Fetching sitemap stats...")
    sitemap = fetch_sitemap_stats()
    print(f"  Sitemap: {sitemap}")

    # 4. PageSpeed
    print("  Fetching PageSpeed Desktop...")
    ps_desktop = fetch_pagespeed(SITE_URL, "desktop")
    print(f"  Desktop: {ps_desktop}")
    print("  Fetching PageSpeed Mobile...")
    ps_mobile = fetch_pagespeed(SITE_URL, "mobile")
    print(f"  Mobile: {ps_mobile}")

    # 5. Metrika
    metrika = fetch_metrika()
    print(f"  Metrika: {metrika}")

    # 6. Indexation from env
    idx_yandex = YANDEX_INDEXED
    idx_google = GOOGLE_INDEXED

    # 7. Telegram
    message = build_telegram_message(
        url_results, ssl_info, sitemap,
        ps_desktop, ps_mobile, metrika,
        idx_yandex, idx_google,
    )
    print("\n--- TELEGRAM ---")
    print(message)
    print("--- END ---\n")
    send_telegram(message)

    # 8. MONITORING.md
    update_monitoring_md(
        url_results, ssl_info, sitemap,
        ps_desktop, ps_mobile, metrika,
        idx_yandex, idx_google,
    )

    print("[monitor] Done.")


if __name__ == "__main__":
    main()
