#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Автоматизированный мониторинг goruslugimsk.ru v3
Все данные получаются динамически:
- URL доступность + время отклика
- SSL сертификат
- SSG страницы из sitemap-index.xml
- PageSpeed через Google API
- Трафик из Яндекс.Метрики
- Индексация из env (GitHub Secrets)
- Семантическое ядро (парсинг semanticCore.ts)
- SSG маршруты (парсинг seoRoutes.ts)
- Рендеринг (проверка H1, JSON-LD, canonical)
- Гео-роутинг (случайная выборка районов/МО)
- Тренды (дельта с предыдущим днём)
"""

import os
import sys
import ssl
import json
import random
import re
import socket
import requests
from datetime import datetime, timezone, timedelta

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False

# ─── ENV ──────────────────────────────────────────────────────
SITE_URL             = os.getenv("SITE_URL", "https://goruslugimsk.ru")
TELEGRAM_BOT_TOKEN   = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID     = os.getenv("TELEGRAM_CHAT_ID")
YANDEX_METRIKA_TOKEN = os.getenv("YANDEX_METRIKA_TOKEN")
METRIKA_ID           = os.getenv("METRIKA_ID", "105828040")
YANDEX_INDEXED       = os.getenv("YANDEX_INDEXED", "")
GOOGLE_INDEXED       = os.getenv("GOOGLE_INDEXED", "")
CACHE_FILE           = ".monitoring-cache.json"

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

# Страницы для проверки рендеринга
RENDER_CHECK_URLS = [
    "/uslugi/dezinsekciya/",
    "/uslugi/deratizaciya/",
    "/rajony/arbat/",
    "/blog/borba-s-tarakanami/",
    "/moscow-oblast/khimki/",
]


# ─── Кэш (тренды) ────────────────────────────────────────────

def load_cache() -> dict:
    try:
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_cache(data: dict):
    with open(CACHE_FILE, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def delta_str(current: int | float, previous: int | float | None) -> str:
    if previous is None:
        return ""
    diff = current - previous
    if diff == 0:
        return ""
    sign = "▲" if diff > 0 else "▼"
    return f" ({sign}{diff:+g})"


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
        root = __import__("xml.etree.ElementTree", fromlist=["ElementTree"]).fromstring(resp.content)

        sitemap_urls = [loc.text for loc in root.findall(".//sm:loc", ns) if loc.text]
        if not sitemap_urls:
            sitemap_urls = [loc.text for loc in root.findall(".//loc") if loc.text]

        for sm_url in sitemap_urls:
            try:
                sm_resp = requests.get(sm_url, timeout=15)
                sm_resp.raise_for_status()
                sm_root = __import__("xml.etree.ElementTree", fromlist=["ElementTree"]).fromstring(sm_resp.content)

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


# ─── Семантическое ядро ───────────────────────────────────────

def parse_semantic_core() -> dict:
    """Парсит src/data/semanticCore.ts и возвращает статистику."""
    filepath = "src/data/semanticCore.ts"
    stats = {
        "total": 0, "duplicates": 0,
        "by_cluster": {"service": 0, "pest": 0, "object": 0, "district": 0, "nch": 0, "blog": 0},
        "by_priority": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
        "by_intent": {"commercial": 0, "informational": 0, "navigational": 0},
    }
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        queries = re.findall(r"query:\s*'([^']+)'", content)
        priorities = re.findall(r"priority:\s*(\d)", content)
        clusters = re.findall(r"cluster:\s*'(\w+)'", content)
        intents = re.findall(r"intent:\s*'(\w+)'", content)

        stats["total"] = len(queries)
        stats["duplicates"] = len(queries) - len(set(queries))

        for c in clusters:
            if c in stats["by_cluster"]:
                stats["by_cluster"][c] += 1
        for p in priorities:
            pi = int(p)
            if pi in stats["by_priority"]:
                stats["by_priority"][pi] += 1
        for i in intents:
            if i in stats["by_intent"]:
                stats["by_intent"][i] += 1

    except Exception as e:
        print(f"  Semantic core parse error: {e}")

    return stats


# ─── SSG маршруты ─────────────────────────────────────────────

def parse_ssg_routes() -> dict:
    """Парсит src/lib/seoRoutes.ts и возвращает разбивку маршрутов."""
    filepath = "src/lib/seoRoutes.ts"
    stats = {
        "static": 0, "services": 0, "subpages": 0,
        "pest_pages": 0, "object_pages": 0,
        "nch_pages": 0, "districts_okrug": 0,
        "neighborhoods": 0, "mo_cities": 0, "mo_services": 0,
        "blog": 0, "total": 0,
    }
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Static routes
        static_matches = re.findall(r"path:\s*'[^']+'.+?outputPath", content[:800])
        stats["static"] = len(re.findall(r"\{\s*path:", content[:content.find("servicesSlugs")]))

        # Services
        svc = re.findall(r"'(\w+)'", content[content.find("servicesSlugs"):content.find("serviceSubpageRoutes")])
        stats["services"] = len([s for s in svc if s not in ('servicesSlugs', 'export', 'const')])

        # Subpages
        subpage_section = content[content.find("serviceSubpageRoutes"):content.find("dezinsekciyaPestSlugs")]
        stats["subpages"] = len(re.findall(r"parent:", subpage_section))

        # Pest slugs
        dez_pests = re.findall(r"'(\w+)'", content[content.find("dezinsekciyaPestSlugs"):content.find("deratizaciyaPestSlugs")])
        der_pests = re.findall(r"'(\w+)'", content[content.find("deratizaciyaPestSlugs"):content.find("districtSlugs")])
        dez_pests = [p for p in dez_pests if p not in ('dezinsekciyaPestSlugs', 'export', 'const')]
        der_pests = [p for p in der_pests if p not in ('deratizaciyaPestSlugs', 'export', 'const')]
        stats["pest_pages"] = len(dez_pests) + len(der_pests)

        # Neighborhoods count
        nh_section = content[content.find("neighborhoodSlugs"):content.find("moscowRegionCitySlugs")]
        nh_slugs = re.findall(r"'([\w-]+)'", nh_section)
        nh_slugs = [s for s in nh_slugs if s not in ('neighborhoodSlugs', 'export', 'const')]
        stats["neighborhoods"] = len(nh_slugs)

        # MO cities
        mo_section = content[content.find("moscowRegionCitySlugs"):content.find("moscowRegionServices")]
        mo_cities = re.findall(r"'([\w-]+)'", mo_section)
        mo_cities = [c for c in mo_cities if c not in ('moscowRegionCitySlugs', 'export', 'const')]
        stats["mo_cities"] = len(mo_cities)

        # MO services
        mo_svc_section = content[content.find("moscowRegionServices"):content.find("topNeighborhoods")]
        mo_svcs = re.findall(r"'(\w+)'", mo_svc_section)
        mo_svcs = [s for s in mo_svcs if s not in ('moscowRegionServices', 'export', 'const')]
        stats["mo_services"] = len(mo_svcs)

        # Objects
        obj_section = content[content.find("objectSlugs"):content.find("servicesForObjects")]
        obj_slugs = re.findall(r"'([\w-]+)'", obj_section)
        obj_slugs = [s for s in obj_slugs if s not in ('objectSlugs', 'export', 'const')]
        svc_for_obj_section = content[content.find("servicesForObjects"):content.find("getAllSSGRoutes")]
        svc_for_obj = re.findall(r"'(\w+)'", svc_for_obj_section)
        svc_for_obj = [s for s in svc_for_obj if s not in ('servicesForObjects', 'export', 'const')]
        stats["object_pages"] = len(obj_slugs) * len(svc_for_obj)

        # Districts (okrug)
        dist_section = content[content.find("districtSlugs"):content.find("neighborhoodSlugs")]
        dist_slugs = re.findall(r"'(\w+)'", dist_section)
        dist_slugs = [d for d in dist_slugs if d not in ('districtSlugs', 'export', 'const')]
        stats["districts_okrug"] = len(dist_slugs) * 3  # 3 services per district

        # Blog (count slugs in blogArticleSlugs array)
        blog_section = content[content.find("blogArticleSlugs"):content.find("blogArticleSlugs.forEach")]
        stats["blog"] = len(re.findall(r"'[\w-]+'", blog_section))

        # NCH pages (tier1 × all + tier2 × 40 + tier3 × 15)
        stats["nch_pages"] = (4 * len(nh_slugs)) + (4 * 40) + (6 * 15)

        # Total
        stats["total"] = (
            stats["static"] + stats["services"] + stats["subpages"]
            + stats["pest_pages"] + stats["object_pages"]
            + stats["nch_pages"] + stats["districts_okrug"]
            + stats["neighborhoods"] + 1  # +1 for /rajony/ overview
            + stats["mo_cities"] + (stats["mo_cities"] * stats["mo_services"]) + 1  # +1 for /moscow-oblast/
            + stats["blog"] + 1  # +1 for district overview
        )

    except Exception as e:
        print(f"  SSG routes parse error: {e}")

    return stats


# ─── Рендеринг (SSR/SSG проверка) ────────────────────────────

def check_rendering(path: str) -> dict:
    """Проверяет HTML страницы на наличие H1, JSON-LD, canonical."""
    url = f"{SITE_URL}{path}"
    result = {"path": path, "ok": True, "h1": False, "h1_text": "", "json_ld": False, "canonical": False, "size_kb": 0}
    try:
        r = requests.get(url, timeout=20)
        if r.status_code != 200:
            result["ok"] = False
            return result

        html = r.text
        result["size_kb"] = round(len(html) / 1024, 1)

        if HAS_BS4:
            soup = BeautifulSoup(html, "html.parser")
            h1 = soup.find("h1")
            if h1:
                result["h1"] = True
                result["h1_text"] = h1.get_text(strip=True)[:60]
            result["json_ld"] = bool(soup.find("script", {"type": "application/ld+json"}))
            canonical = soup.find("link", {"rel": "canonical"})
            result["canonical"] = bool(canonical and canonical.get("href"))
        else:
            result["h1"] = bool(re.search(r"<h1[^>]*>", html))
            result["json_ld"] = "application/ld+json" in html
            result["canonical"] = bool(re.search(r'<link[^>]+rel=["\']canonical["\']', html))

    except Exception as e:
        result["ok"] = False
        print(f"  Render check error ({path}): {e}")

    return result


# ─── Гео-роутинг ─────────────────────────────────────────────

def check_geo_routing(sitemap_urls: list) -> list:
    """Выбирает случайные районы и МО для проверки."""
    rajony = [u for u in sitemap_urls if "/rajony/" in u and u.count("/") >= 5]
    mo = [u for u in sitemap_urls if "/moscow-oblast/" in u and u.count("/") >= 5 and "/dezin" not in u and "/derat" not in u and "/ozon" not in u]

    sample_rajony = random.sample(rajony, min(3, len(rajony))) if rajony else []
    sample_mo = random.sample(mo, min(2, len(mo))) if mo else []
    results = []

    for url in sample_rajony + sample_mo:
        path = url.replace(SITE_URL, "")
        try:
            r = requests.get(url, timeout=20)
            h1_text = ""
            if HAS_BS4 and r.status_code == 200:
                soup = BeautifulSoup(r.text, "html.parser")
                h1 = soup.find("h1")
                h1_text = h1.get_text(strip=True)[:50] if h1 else "—"
            elif r.status_code == 200:
                m = re.search(r"<h1[^>]*>(.*?)</h1>", r.text, re.DOTALL)
                h1_text = m.group(1).strip()[:50] if m else "—"

            results.append({
                "path": path,
                "status": r.status_code,
                "h1": h1_text,
                "time_ms": round(r.elapsed.total_seconds() * 1000),
            })
        except Exception as e:
            results.append({"path": path, "status": 0, "h1": "—", "time_ms": 0})

    return results


# ─── Сбор всех URL из sitemap ─────────────────────────────────

def collect_all_sitemap_urls() -> list:
    """Собирает все URL из sitemap для гео-выборки."""
    urls = []
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    try:
        index_url = f"{SITE_URL}/sitemap-index.xml"
        resp = requests.get(index_url, timeout=15)
        resp.raise_for_status()
        ET = __import__("xml.etree.ElementTree", fromlist=["ElementTree"])
        root = ET.fromstring(resp.content)
        sitemap_urls = [loc.text for loc in root.findall(".//sm:loc", ns) if loc.text]
        if not sitemap_urls:
            sitemap_urls = [loc.text for loc in root.findall(".//loc") if loc.text]
        for sm_url in sitemap_urls:
            try:
                sm_resp = requests.get(sm_url, timeout=15)
                sm_root = ET.fromstring(sm_resp.content)
                locs = [loc.text for loc in sm_root.findall(".//sm:loc", ns) if loc.text]
                if not locs:
                    locs = [loc.text for loc in sm_root.findall(".//loc") if loc.text]
                urls.extend(locs)
            except Exception:
                pass
    except Exception:
        pass
    return urls


def fmt_num(n: int) -> str:
    return f"{n:,}".replace(",", " ")


# ─── Telegram-сообщение ──────────────────────────────────────

def build_telegram_message(
    url_results: list, ssl_info: dict, sitemap: dict,
    ps_desktop: dict, ps_mobile: dict, metrika: dict | None,
    idx_yandex: str, idx_google: str,
    semantic: dict, ssg: dict, render_results: list,
    geo_results: list, cache: dict,
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
    d_total = delta_str(sitemap["total"], cache.get("sitemap_total"))
    lines += [
        "", "📄 Контент (sitemap)",
        f"• Всего URL: {sitemap['total']}{d_total}",
        f"• Услуги: {sitemap['services']} | Блог: {sitemap['blog']}",
        f"• Районы: {sitemap['districts']} | МО: {sitemap['mo_cities']}",
    ]

    # Семантическое ядро
    sc = semantic
    d_sem = delta_str(sc["total"], cache.get("semantic_total"))
    lines += [
        "", "🧠 Семантическое ядро",
        f"• Запросов: {sc['total']}{d_sem} | Дублей: {sc['duplicates']}",
        f"• P1:{sc['by_priority'][1]} P2:{sc['by_priority'][2]} P3:{sc['by_priority'][3]} P4:{sc['by_priority'][4]} P5:{sc['by_priority'][5]}",
        f"• com:{sc['by_intent']['commercial']} info:{sc['by_intent']['informational']} nav:{sc['by_intent']['navigational']}",
        f"• Кластеры: svc:{sc['by_cluster']['service']} pest:{sc['by_cluster']['pest']} obj:{sc['by_cluster']['object']} dist:{sc['by_cluster']['district']} blog:{sc['by_cluster']['blog']}",
    ]

    # SSG маршруты
    d_ssg = delta_str(ssg["total"], cache.get("ssg_total"))
    lines += [
        "", "📐 SSG маршруты",
        f"• Всего: {ssg['total']}{d_ssg}",
        f"• Услуги: {ssg['services']} | Подстр: {ssg['subpages']} | Pest: {ssg['pest_pages']}",
        f"• Object: {ssg['object_pages']} | НЧ: {ssg['nch_pages']}",
        f"• Районы: {ssg['neighborhoods']} | Округа: {ssg['districts_okrug']}",
        f"• МО: {ssg['mo_cities']}×{ssg['mo_services']}+{ssg['mo_cities']} | Блог: {ssg['blog']}",
    ]

    # Рендеринг
    lines += ["", "🔍 Рендеринг (SSR/SSG)"]
    for rr in render_results:
        h1 = "✅" if rr["h1"] else "❌"
        jld = "✅" if rr["json_ld"] else "❌"
        can = "✅" if rr["canonical"] else "❌"
        lines.append(f"• {rr['path']} — H1:{h1} LD:{jld} can:{can} {rr['size_kb']}KB")

    # Гео-роутинг
    if geo_results:
        lines += ["", "🗺️ Гео-роутинг"]
        for gr in geo_results:
            st = "✅" if gr["status"] == 200 else "❌"
            lines.append(f"• {gr['path']} — {st} {gr['status']}, «{gr['h1'][:30]}», {gr['time_ms']}мс")

    # Индексация
    if idx_yandex or idx_google:
        lines += ["", "📈 Индексация"]
        if idx_yandex:
            try:
                pct = round(int(idx_yandex) / sitemap["total"] * 100, 1) if sitemap["total"] else 0
                d_y = delta_str(int(idx_yandex), cache.get("idx_yandex"))
                lines.append(f"• Яндекс: {idx_yandex}/{sitemap['total']} ({pct}%){d_y}")
            except ValueError:
                lines.append(f"• Яндекс: {idx_yandex}")
        if idx_google:
            try:
                pct = round(int(idx_google) / sitemap["total"] * 100, 1) if sitemap["total"] else 0
                d_g = delta_str(int(idx_google), cache.get("idx_google"))
                lines.append(f"• Google: {idx_google}/{sitemap['total']} ({pct}%){d_g}")
            except ValueError:
                lines.append(f"• Google: {idx_google}")

    # PageSpeed
    d_psd = delta_str(ps_desktop["score"], cache.get("ps_desktop"))
    d_psm = delta_str(ps_mobile["score"], cache.get("ps_mobile"))
    lines += [
        "", "⚙️ PageSpeed",
        f"• Desktop: {ps_desktop['score']}{d_psd} | Mobile: {ps_mobile['score']}{d_psm}",
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
        alerts.append(f"⚠️ Mobile PSI: {ps_mobile['score']}")
    for rr in render_results:
        if not rr["h1"]:
            alerts.append(f"⚠️ Нет H1: {rr['path']}")
        if not rr["json_ld"]:
            alerts.append(f"⚠️ Нет JSON-LD: {rr['path']}")
    if semantic["duplicates"] > 0:
        alerts.append(f"🔴 Дубли в семантике: {semantic['duplicates']}")

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
    semantic: dict, ssg: dict, render_results: list,
    geo_results: list, cache: dict,
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

## 🧠 Семантическое ядро

| Метрика | Значение |
|---|---|
| Всего запросов | {semantic['total']} |
| Дубли | {semantic['duplicates']} |
| P1 (критичные) | {semantic['by_priority'][1]} |
| P2 | {semantic['by_priority'][2]} |
| P3 | {semantic['by_priority'][3]} |
| P4 | {semantic['by_priority'][4]} |
| P5 | {semantic['by_priority'][5]} |
| Commercial | {semantic['by_intent']['commercial']} |
| Informational | {semantic['by_intent']['informational']} |
| Navigational | {semantic['by_intent']['navigational']} |

**Кластеры:** service:{semantic['by_cluster']['service']} | pest:{semantic['by_cluster']['pest']} | object:{semantic['by_cluster']['object']} | district:{semantic['by_cluster']['district']} | nch:{semantic['by_cluster']['nch']} | blog:{semantic['by_cluster']['blog']}

## 📐 SSG маршруты

| Тип страниц | Количество |
|---|---|
| Статические | {ssg['static']} |
| Услуги | {ssg['services']} |
| Подстраницы услуг | {ssg['subpages']} |
| Pest-страницы | {ssg['pest_pages']} |
| Object-страницы | {ssg['object_pages']} |
| НЧ (Pest×Geo) | {ssg['nch_pages']} |
| Округа (×3 услуги) | {ssg['districts_okrug']} |
| Районы Москвы | {ssg['neighborhoods']} |
| Города МО | {ssg['mo_cities']} |
| Блог | {ssg['blog']} |
| **Всего маршрутов** | **{ssg['total']}** |

## 🔍 Рендеринг (SSR/SSG)

| Страница | H1 | JSON-LD | Canonical | Размер |
|---|---|---|---|---|
"""
    for rr in render_results:
        h1 = "✅" if rr["h1"] else "❌"
        jld = "✅" if rr["json_ld"] else "❌"
        can = "✅" if rr["canonical"] else "❌"
        md += f"| {rr['path']} | {h1} | {jld} | {can} | {rr['size_kb']} KB |\n"

    md += """
## 🗺️ Гео-роутинг (случайная выборка)

| Страница | Статус | H1 | Время отклика |
|---|---|---|---|
"""
    for gr in geo_results:
        st = f"✅ {gr['status']}" if gr['status'] == 200 else f"❌ {gr['status']}"
        md += f"| {gr['path']} | {st} | «{gr['h1'][:40]}» | {gr['time_ms']} мс |\n"

    md += f"""
## 🔍 Индексация

| Поисковик | Страниц | % от sitemap |
|---|---|---|
"""
    if idx_yandex:
        try:
            pct = round(int(idx_yandex) / sitemap["total"] * 100, 1) if sitemap["total"] else 0
            md += f"| Яндекс | {idx_yandex} | {pct}% |\n"
        except ValueError:
            md += f"| Яндекс | {idx_yandex} | — |\n"
    else:
        md += "| Яндекс | — | задайте YANDEX_INDEXED |\n"
    if idx_google:
        try:
            pct = round(int(idx_google) / sitemap["total"] * 100, 1) if sitemap["total"] else 0
            md += f"| Google | {idx_google} | {pct}% |\n"
        except ValueError:
            md += f"| Google | {idx_google} | — |\n"
    else:
        md += "| Google | — | задайте GOOGLE_INDEXED |\n"

    md += f"""
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

    # Тренд
    md += "\n## 📉 Тренд (vs предыдущий запуск)\n\n"
    trend_items = []
    if cache.get("sitemap_total") is not None:
        trend_items.append(f"Страниц в sitemap: {sitemap['total']} (было {cache['sitemap_total']})")
    if cache.get("semantic_total") is not None:
        trend_items.append(f"Семантика: {semantic['total']} (было {cache['semantic_total']})")
    if cache.get("ps_desktop") is not None:
        trend_items.append(f"PSI Desktop: {ps_desktop['score']} (было {cache['ps_desktop']})")
    if cache.get("ps_mobile") is not None:
        trend_items.append(f"PSI Mobile: {ps_mobile['score']} (было {cache['ps_mobile']})")
    if cache.get("ssg_total") is not None:
        trend_items.append(f"SSG маршрутов: {ssg['total']} (было {cache['ssg_total']})")
    if trend_items:
        for t in trend_items:
            md += f"- {t}\n"
    else:
        md += "> Первый запуск — тренды появятся завтра.\n"

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
    for rr in render_results:
        if not rr["h1"]:
            has_alerts = True
            alert_rows += f"| Нет H1 на {rr['path']} | ⚠️ Средний | 🟡 |\n"
        if not rr["json_ld"]:
            has_alerts = True
            alert_rows += f"| Нет JSON-LD на {rr['path']} | ⚠️ Средний | 🟡 |\n"
    if semantic["duplicates"] > 0:
        has_alerts = True
        alert_rows += f"| Дубли в семантическом ядре: {semantic['duplicates']} | 🔴 Критический | 🔴 |\n"

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

    # Load previous cache
    cache = load_cache()
    print(f"  Cache loaded: {bool(cache)}")

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

    # 7. Semantic core
    print("  Parsing semantic core...")
    semantic = parse_semantic_core()
    print(f"  Semantic: {semantic}")

    # 8. SSG routes
    print("  Parsing SSG routes...")
    ssg = parse_ssg_routes()
    print(f"  SSG: {ssg}")

    # 9. Rendering checks
    print("  Checking rendering...")
    render_results = [check_rendering(p) for p in RENDER_CHECK_URLS]
    for rr in render_results:
        print(f"    {rr['path']} — H1:{rr['h1']} LD:{rr['json_ld']} can:{rr['canonical']} {rr['size_kb']}KB")

    # 10. Geo-routing
    print("  Checking geo-routing...")
    all_sitemap_urls = collect_all_sitemap_urls()
    geo_results = check_geo_routing(all_sitemap_urls)
    for gr in geo_results:
        print(f"    {gr['path']} — {gr['status']} «{gr['h1']}» {gr['time_ms']}ms")

    # 11. Telegram
    message = build_telegram_message(
        url_results, ssl_info, sitemap,
        ps_desktop, ps_mobile, metrika,
        idx_yandex, idx_google,
        semantic, ssg, render_results,
        geo_results, cache,
    )
    print("\n--- TELEGRAM ---")
    print(message)
    print("--- END ---\n")
    send_telegram(message)

    # 12. MONITORING.md
    update_monitoring_md(
        url_results, ssl_info, sitemap,
        ps_desktop, ps_mobile, metrika,
        idx_yandex, idx_google,
        semantic, ssg, render_results,
        geo_results, cache,
    )

    # 13. Save cache for next run
    new_cache = {
        "date": datetime.now(timezone(timedelta(hours=3))).strftime("%d.%m.%Y"),
        "sitemap_total": sitemap["total"],
        "semantic_total": semantic["total"],
        "ssg_total": ssg["total"],
        "ps_desktop": ps_desktop["score"],
        "ps_mobile": ps_mobile["score"],
    }
    try:
        new_cache["idx_yandex"] = int(idx_yandex) if idx_yandex else None
    except ValueError:
        new_cache["idx_yandex"] = None
    try:
        new_cache["idx_google"] = int(idx_google) if idx_google else None
    except ValueError:
        new_cache["idx_google"] = None
    save_cache(new_cache)
    print("  Cache saved")

    print("[monitor] Done.")


if __name__ == "__main__":
    main()
