#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Daily Governance Monitoring Reporter for goruslugimsk.ru.

Generates MONITORING.md as an operational-ready report answering:
  "Can we safely keep the site live today, and have new architectural
   or SEO/analytics risks emerged?"

Outputs:
  - MONITORING.md          (human-readable governance report)
  - .monitoring-cache.json (state for next-run deltas)
  - Telegram alert         (only when status != STABLE, if secrets set)
"""

from __future__ import annotations

import json
import os
import socket
import ssl
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone, timedelta
from typing import Any, Optional
from xml.etree import ElementTree as ET

import requests
from bs4 import BeautifulSoup

# ─── Configuration ──────────────────────────────────────────────────────────

SITE_URL = os.environ.get("SITE_URL", "https://goruslugimsk.ru").rstrip("/")
TG_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TG_CHAT  = os.environ.get("TELEGRAM_CHAT_ID", "")

CACHE_FILE  = ".monitoring-cache.json"
REPORT_FILE = "MONITORING.md"

TIMEOUT = 15
USER_AGENT = "GoruslugimskMonitor/3.0 (+https://goruslugimsk.ru)"
HEADERS = {"User-Agent": USER_AGENT, "Accept-Charset": "utf-8"}
MSK = timezone(timedelta(hours=3))

# Representative URLs — fixed deterministic sample covering all page templates.
# (label, path, expected_indexable)
REPRESENTATIVE_URLS: list[tuple[str, str, bool]] = [
    ("homepage",         "/",                                            True),
    ("service_hub",      "/uslugi/dezinsekciya/",                        True),
    ("pest_page",        "/uslugi/dezinsekciya/klopy/",                  True),
    # objectSlugs use genitive plural — kvartir, ofisov, etc. (NOT kvartira)
    ("object_page",      "/uslugi/dezinsekciya/ofisov/",                 True),
    # /rajony/:slug serves NeighborhoodPage; districts like /uslugi/dezinfekciya-cao/ are the canonical ones
    ("moscow_district",  "/uslugi/dezinfekciya-cao/",                    True),
    ("mo_overview",      "/moscow-oblast/",                              True),
    ("mo_city",          "/moscow-oblast/podolsk/",                      True),
    ("mole_city",        "/uslugi/borba-s-krotami/khimki/",              True),
    ("blog_post",        "/blog/klopy-v-kvartire/",                      True),
    ("excluded_page",    "/uslugi/sertifikaciya/",                       False),
]

KEY_URLS = [
    "/",
    "/uslugi/dezinfekciya/",
    "/uslugi/dezinsekciya/",
    "/uslugi/deratizaciya/",
    "/blog/",
    "/contacts/",
]

CRITICAL_RESPONSE_MS = 3000

# ─── Data containers ────────────────────────────────────────────────────────

@dataclass
class FetchResult:
    url: str
    status: int
    time_ms: int
    html: str = ""
    error: Optional[str] = None
    final_url: Optional[str] = None

@dataclass
class Alert:
    severity: str   # CRITICAL | WARNING
    check: str
    problem: str
    impact: str
    action: str

@dataclass
class Report:
    alerts: list[Alert] = field(default_factory=list)
    rep_results: list[dict] = field(default_factory=list)
    key_url_results: list[dict] = field(default_factory=list)
    sitemap: dict = field(default_factory=dict)
    ssl: dict = field(default_factory=dict)
    conversion_checks: list[dict] = field(default_factory=list)
    summary_changes: list[str] = field(default_factory=list)

    def add(self, severity: str, check: str, problem: str, impact: str, action: str) -> None:
        self.alerts.append(Alert(severity, check, problem, impact, action))

    @property
    def critical_count(self) -> int:
        return sum(1 for a in self.alerts if a.severity == "CRITICAL")

    @property
    def warning_count(self) -> int:
        return sum(1 for a in self.alerts if a.severity == "WARNING")

# ─── Fetch utilities ────────────────────────────────────────────────────────

def fetch(path_or_url: str, allow_redirects: bool = True) -> FetchResult:
    url = path_or_url if path_or_url.startswith("http") else SITE_URL + path_or_url
    t0 = time.time()
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=allow_redirects)
        r.encoding = "utf-8"  # site is utf-8 — avoid mojibake from misdetected charset
        return FetchResult(
            url=url, status=r.status_code,
            time_ms=int((time.time() - t0) * 1000),
            html=r.text, final_url=r.url,
        )
    except Exception as e:
        return FetchResult(url=url, status=0, time_ms=int((time.time() - t0) * 1000), error=str(e))


def head(path_or_url: str) -> FetchResult:
    url = path_or_url if path_or_url.startswith("http") else SITE_URL + path_or_url
    t0 = time.time()
    try:
        r = requests.head(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=False)
        return FetchResult(
            url=url, status=r.status_code,
            time_ms=int((time.time() - t0) * 1000),
            final_url=r.headers.get("Location"),
        )
    except Exception as e:
        return FetchResult(url=url, status=0, time_ms=int((time.time() - t0) * 1000), error=str(e))

# ─── HTML inspection ────────────────────────────────────────────────────────

def parse_html(html: str) -> Optional[BeautifulSoup]:
    if not html:
        return None
    for parser in ("lxml", "html.parser"):
        try:
            return BeautifulSoup(html, parser)
        except Exception:
            continue
    return None


def inspect_page(fr: FetchResult) -> dict:
    """Extract canonical/H1/JSON-LD/robots from a page."""
    out = {
        "url": fr.url, "status": fr.status, "time_ms": fr.time_ms,
        "h1": None, "canonical": None, "robots_meta": None,
        "viewport": False, "breadcrumb_count": 0, "schema_types": [],
        "schema_malformed": False,
        "size_kb": round(len(fr.html) / 1024, 1) if fr.html else 0,
    }
    soup = parse_html(fr.html)
    if not soup:
        return out

    h1 = soup.find("h1")
    if h1:
        out["h1"] = h1.get_text(strip=True)[:80]

    can = soup.find("link", rel="canonical")
    if can and can.get("href"):
        out["canonical"] = can["href"].strip()

    robots = soup.find("meta", attrs={"name": "robots"})
    if robots and robots.get("content"):
        out["robots_meta"] = robots["content"].strip().lower()

    viewport = soup.find("meta", attrs={"name": "viewport"})
    out["viewport"] = bool(viewport and viewport.get("content"))

    def _walk(node: Any) -> None:
        """Recursively walk JSON-LD; count BreadcrumbList anywhere (incl. @graph)."""
        if isinstance(node, list):
            for x in node:
                _walk(x)
            return
        if not isinstance(node, dict):
            return
        t = node.get("@type")
        types = t if isinstance(t, list) else [t] if isinstance(t, str) else []
        for tt in types:
            out["schema_types"].append(tt)
            if tt == "BreadcrumbList":
                out["breadcrumb_count"] += 1
        graph = node.get("@graph")
        if graph:
            _walk(graph)

    for s in soup.find_all("script", type="application/ld+json"):
        # Use s.string (None for tags with mixed content) then fallback,
        # but skip empty/whitespace blocks to avoid double-count of placeholders.
        raw = (s.string if s.string else s.get_text()) or ""
        if not raw.strip():
            continue
        try:
            data = json.loads(raw)
        except Exception:
            out["schema_malformed"] = True
            continue
        _walk(data)
    return out

# ─── Section checks ─────────────────────────────────────────────────────────

def check_ssl(rep: Report) -> None:
    host = SITE_URL.replace("https://", "").replace("http://", "").split("/")[0]
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((host, 443), timeout=10) as sock:
            with ctx.wrap_socket(sock, server_hostname=host) as ssock:
                cert = ssock.getpeercert()
        expire = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
        days_left = (expire - datetime.utcnow()).days
        rep.ssl = {"active": True, "expires": expire.strftime("%d.%m.%Y"), "days_left": days_left}
        if days_left < 14:
            rep.add("CRITICAL", "SSL", f"Сертификат истекает через {days_left} дней",
                    "Сайт может стать недоступным", "Срочно продлить SSL")
        elif days_left < 30:
            rep.add("WARNING", "SSL", f"Сертификат истекает через {days_left} дней",
                    "Скоро потребуется продление", "Запланировать продление")
    except Exception as e:
        rep.ssl = {"active": False, "error": str(e)}
        rep.add("WARNING", "SSL", f"Не удалось проверить сертификат: {e}",
                "Неизвестное состояние SSL", "Проверить вручную")


def check_key_urls(rep: Report) -> int:
    times: list[int] = []
    for path in KEY_URLS:
        fr = fetch(path)
        ok = fr.status == 200
        rep.key_url_results.append({"path": path, "status": fr.status, "time_ms": fr.time_ms, "ok": ok})
        if ok:
            times.append(fr.time_ms)
        if fr.status == 0:
            rep.add("CRITICAL", "Site Health", f"{path} недоступен ({fr.error})",
                    "Страница не отвечает", "Проверить инфраструктуру/CDN")
        elif fr.status >= 500:
            rep.add("CRITICAL", "Site Health", f"{path} → HTTP {fr.status}",
                    "Серверная ошибка на критичной странице", "Проверить логи Nginx/Cloudflare")
        elif fr.status >= 400:
            rep.add("WARNING", "Site Health", f"{path} → HTTP {fr.status}",
                    "Страница возвращает ошибку", "Проверить роутинг/SSG")
        if ok and fr.time_ms > CRITICAL_RESPONSE_MS:
            rep.add("WARNING", "Performance",
                    f"{path} отвечает {fr.time_ms} мс (>{CRITICAL_RESPONSE_MS})",
                    "Замедление на критичной странице", "Проверить кэш/bundle")
    return int(sum(times) / len(times)) if times else 0


def parse_sitemap_index(rep: Report) -> dict:
    out = {
        "total": 0, "service": 0, "blog": 0, "district": 0,
        "mo_city": 0, "mole_city": 0, "other": 0, "files": [],
    }
    fr = fetch("/sitemap-index.xml")
    if fr.status != 200:
        rep.add("CRITICAL", "Sitemap", f"sitemap-index.xml → HTTP {fr.status}",
                "Поисковики не получат список карт",
                "Проверить SSG-пайплайн")
        return out
    try:
        root = ET.fromstring(fr.html)
    except ET.ParseError as e:
        rep.add("CRITICAL", "Sitemap", f"sitemap-index.xml невалиден: {e}",
                "Поисковики не разберут индекс", "Перегенерировать sitemap")
        return out

    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    sitemap_urls = [loc.text for loc in root.findall(".//sm:loc", ns) if loc.text]
    out["files"] = [u.split("/")[-1] for u in sitemap_urls]

    all_urls: list[str] = []
    for sm_url in sitemap_urls:
        sm_fr = fetch(sm_url)
        if sm_fr.status != 200:
            rep.add("WARNING", "Sitemap",
                    f"{sm_url.split('/')[-1]} → HTTP {sm_fr.status}",
                    "Часть карты недоступна", "Проверить генерацию")
            continue
        try:
            sub = ET.fromstring(sm_fr.html)
        except ET.ParseError:
            continue
        for loc in sub.findall(".//sm:loc", ns):
            if loc.text:
                all_urls.append(loc.text.strip())

    out["total"] = len(all_urls)
    for u in all_urls:
        if "/blog/" in u:
            out["blog"] += 1
        elif "/uslugi/borba-s-krotami/" in u and u.rstrip("/").count("/") >= 5:
            out["mole_city"] += 1
            out["service"] += 1
        elif "/uslugi/" in u:
            out["service"] += 1
        elif "/rajony/" in u:
            out["district"] += 1
        elif "/moscow-oblast/" in u:
            out["mo_city"] += 1
        else:
            out["other"] += 1
    return out


def check_representative(rep: Report) -> None:
    for label, path, expected_indexable in REPRESENTATIVE_URLS:
        fr = fetch(path)
        info = inspect_page(fr)
        canonical_ok = "—"
        indexable_ok = "—"
        schema_ok = "—"

        if fr.status != 200:
            rep.add("CRITICAL", "Representative",
                    f"{label} ({path}) → HTTP {fr.status}",
                    "Шаблон страницы не отдаётся", "Проверить роутинг/SSG")
        else:
            # Canonical
            if not info["canonical"]:
                canonical_ok = "❌ missing"
                rep.add("CRITICAL", "Canonical", f"{path}: отсутствует canonical",
                        "Нарушение SEO-стандарта", "Проверить SEOHead.tsx")
            else:
                expected = SITE_URL + path
                actual = info["canonical"].rstrip("/") + "/"
                if actual == expected:
                    canonical_ok = "✅"
                else:
                    canonical_ok = f"⚠️ mismatch"
                    rep.add("CRITICAL", "Canonical",
                            f"{path}: canonical = {info['canonical']}",
                            "Canonical drift — конфликт с маршрутом",
                            "Сверить с seoRoutes.ts")

            # Indexability
            robots = info["robots_meta"] or ""
            is_noindex = "noindex" in robots
            if expected_indexable and is_noindex:
                indexable_ok = "❌ noindex"
                rep.add("CRITICAL", "Indexability",
                        f"{path}: должен индексироваться, но noindex",
                        "Страница выпадет из индекса", "Снять noindex")
            elif (not expected_indexable) and not is_noindex:
                indexable_ok = "❌ index"
                rep.add("CRITICAL", "Indexability",
                        f"{path}: должен быть noindex, но открыт",
                        "Утечка excluded-страницы в индекс", "Поставить noindex")
            else:
                indexable_ok = "✅ noindex" if is_noindex else "✅ index"

            # Schema
            if info["schema_malformed"]:
                schema_ok = "❌ malformed"
                rep.add("CRITICAL", "Schema", f"{path}: невалидный JSON-LD",
                        "Поисковики не разберут разметку", "Проверить компонент")
            elif info["breadcrumb_count"] > 1:
                schema_ok = f"❌ {info['breadcrumb_count']}× BreadcrumbList"
                rep.add("CRITICAL", "Schema",
                        f"{path}: {info['breadcrumb_count']} BreadcrumbList",
                        "Дубликаты разметки", "Использовать единый источник")
            elif info["breadcrumb_count"] == 0 and label != "homepage":
                schema_ok = "⚠️ no breadcrumb"
                rep.add("WARNING", "Schema",
                        f"{path}: BreadcrumbList отсутствует",
                        "Снижение видимости в SERP", "Добавить разметку")
            else:
                schema_ok = "✅"

        result_ok = (
            fr.status == 200
            and "❌" not in canonical_ok
            and "❌" not in indexable_ok
            and "❌" not in schema_ok
        )
        rep.rep_results.append({
            "label": label, "path": path, "status": fr.status,
            "canonical_ok": canonical_ok, "indexable_ok": indexable_ok,
            "schema_ok": schema_ok,
            "mobile": "✅" if info["viewport"] else "❌",
            "result": "OK" if result_ok else "FAIL",
            "size_kb": info["size_kb"], "h1": info["h1"],
        })


def check_internal_linking_leaks(rep: Report, html_samples: list[str]) -> None:
    """Detect /admin/ and WhatsApp links across sampled pages.

    Dedup by (href) so the same Footer/Header link counted across pages is one leak.
    Recognise rel="nofollow" robustly (token-based, case-insensitive).
    """
    admin_leaks: set[str] = set()
    whatsapp_leaks: set[str] = set()
    for html in html_samples:
        soup = parse_html(html)
        if not soup:
            continue
        for a in soup.find_all("a", href=True):
            href = a["href"]
            rel = a.get("rel") or []
            rel_tokens = (rel if isinstance(rel, list) else str(rel).split())
            rel_lc = {x.lower() for x in rel_tokens}
            if "/admin" in href and "nofollow" not in rel_lc:
                admin_leaks.add(href)
            if "wa.me" in href.lower() or "whatsapp" in href.lower():
                whatsapp_leaks.add(href)
    if admin_leaks:
        rep.add("CRITICAL", "Internal Linking",
                f"Найдено {len(admin_leaks)} уникальных ссылок на /admin/ без rel=nofollow: "
                + ", ".join(sorted(admin_leaks)[:3]),
                "Утечка веса в utility-зону",
                "Добавить rel='nofollow' или убрать ссылки")
    if whatsapp_leaks:
        rep.add("CRITICAL", "Brand Standard",
                f"Обнаружены {len(whatsapp_leaks)} ссылок на WhatsApp",
                "Регресс контактного стандарта (Telegram/MAX only)",
                "Удалить wa.me ссылки")


def check_conversion(rep: Report, homepage_html: str) -> None:
    if "t.me/one_help" in homepage_html or "tg.me" in homepage_html or "telegram_click" in homepage_html:
        rep.conversion_checks.append({"check": "Telegram CTA на главной", "result": "✅ present", "notes": "—"})
    else:
        rep.conversion_checks.append({"check": "Telegram CTA на главной", "result": "❌ missing",
                                      "notes": "Проверить FloatingButtons.tsx"})
        rep.add("CRITICAL", "Conversion", "На главной нет Telegram CTA",
                "Потеря канала конверсии", "Проверить FloatingButtons.tsx")

    if "all_conversions" in homepage_html:
        rep.conversion_checks.append({"check": "all_conversions composite goal",
                                      "result": "✅ present", "notes": "—"})
    else:
        rep.conversion_checks.append({"check": "all_conversions composite goal",
                                      "result": "⚠️ not in HTML", "notes": "Может быть в JS-bundle"})

    if "105828040" in homepage_html:
        rep.conversion_checks.append({"check": "Yandex Metrika counter",
                                      "result": "✅ 105828040", "notes": "—"})
    else:
        rep.conversion_checks.append({"check": "Yandex Metrika counter",
                                      "result": "❌ missing", "notes": "Проверить index.html"})
        rep.add("CRITICAL", "Analytics", "Метрика 105828040 не найдена на главной",
                "Полная потеря аналитики", "Восстановить счётчик")

    func_url = "https://gimkzlozhwwgetlgtgvj.supabase.co/functions/v1/handle-lead"
    fr = head(func_url)
    if fr.status in (200, 204, 401, 405):
        rep.conversion_checks.append({"check": "handle-lead edge function",
                                      "result": f"✅ reachable ({fr.status})", "notes": "—"})
    else:
        rep.conversion_checks.append({"check": "handle-lead edge function",
                                      "result": f"⚠️ {fr.status or fr.error}",
                                      "notes": "Lead flow может быть нарушен"})


def check_pricing_consistency(rep: Report, homepage_html: str) -> None:
    if "от 1500" in homepage_html.lower() and "от 1000" not in homepage_html.lower():
        rep.add("WARNING", "Pricing",
                "На главной 'от 1500₽' без 'от 1000₽'",
                "Возможный mismatch с прайсом 1000₽",
                "Сверить с servicePrices.ts")


def check_robots(rep: Report) -> None:
    fr = fetch("/robots.txt")
    if fr.status != 200:
        rep.add("CRITICAL", "Robots", f"robots.txt → HTTP {fr.status}",
                "Поисковики не получат правила краулинга", "Проверить статику")
        return
    if "Sitemap:" not in fr.html:
        rep.add("CRITICAL", "Robots", "robots.txt не содержит Sitemap:",
                "Карта сайта не объявлена", "Добавить директиву Sitemap")
    if "/admin/" not in fr.html:
        rep.add("WARNING", "Robots", "Нет Disallow: /admin/",
                "Утилитарная зона может попасть в индекс", "Добавить Disallow")

# ─── Cache & deltas ─────────────────────────────────────────────────────────

def load_cache() -> dict:
    if not os.path.exists(CACHE_FILE):
        return {}
    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_cache(data: dict) -> None:
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)


def delta_arrow(cur: Any, prev: Any) -> str:
    if prev is None or cur is None:
        return "—"
    try:
        diff = cur - prev
        if diff == 0:
            return "0"
        return f"{'+' if diff > 0 else ''}{diff}"
    except TypeError:
        return "—"

# ─── Status decision ────────────────────────────────────────────────────────

def decide_status(rep: Report) -> tuple[str, str]:
    if rep.critical_count > 0:
        return "CRITICAL", "NOT SAFE UNTIL FIXED"
    if rep.warning_count > 0:
        return "WARNING", "SAFE WITH WARNINGS"
    return "STABLE", "SAFE TO KEEP LIVE"

# ─── Markdown rendering ─────────────────────────────────────────────────────

def render_markdown(rep: Report, cache_now: dict, cache_prev: dict,
                    status: str, decision: str) -> str:
    now_msk = datetime.now(MSK)
    date_str = now_msk.strftime("%d.%m.%Y")
    ts_str = now_msk.strftime("%d.%m.%Y %H:%M MSK")

    site_state = "ONLINE"
    if any(r["status"] == 0 for r in rep.key_url_results):
        site_state = "DOWN"
    elif any(r["status"] >= 500 for r in rep.key_url_results):
        site_state = "DEGRADED"

    def section(label_check: list[str]) -> str:
        related = [a for a in rep.alerts if a.check in label_check]
        if any(a.severity == "CRITICAL" for a in related):
            return "FAIL"
        if related:
            return "WARNING"
        return "OK"

    build_state = section(["Sitemap"])
    canonical_state = section(["Canonical", "Indexability", "Sitemap", "Robots"])
    schema_state = section(["Schema"])
    conv_state = section(["Conversion", "Analytics"])
    perf_state = section(["Performance"])

    L: list[str] = []
    L.append("# 🤖 MONITORING.md — goruslugimsk.ru")
    L.append("")
    L.append(f"**Дата:** {date_str} | **Статус:** {status} | **Финальный вердикт:** {decision}")
    L.append("")
    L.append("---")
    L.append("")

    # 1. Executive Summary
    L.append("## 1. Executive Summary")
    L.append("")
    L.append(f"- Сайт: **{site_state}**")
    L.append(f"- Build / SSG: **{build_state}**")
    L.append(f"- Canonical / Sitemap / Indexability: **{canonical_state}**")
    L.append(f"- Schema: **{schema_state}**")
    L.append(f"- Conversion / Analytics: **{conv_state}**")
    L.append(f"- Performance / Cache: **{perf_state}**")
    L.append("")
    L.append("### Что изменилось с прошлого запуска")
    L.append("")
    if rep.summary_changes:
        for c in rep.summary_changes:
            L.append(f"- {c}")
    else:
        L.append("Существенных изменений не обнаружено.")
    L.append("")
    L.append("---")
    L.append("")

    # 2. Critical Alerts
    L.append("## 2. Critical Alerts")
    L.append("")
    crit = [a for a in rep.alerts if a.severity == "CRITICAL"]
    warn = [a for a in rep.alerts if a.severity == "WARNING"]
    if not crit and not warn:
        L.append("✅ Critical issues not detected")
    else:
        L.append("| Severity | Check | Problem | Impact | Action |")
        L.append("|---|---|---|---|---|")
        for a in crit + warn:
            L.append(f"| {a.severity} | {a.check} | {a.problem} | {a.impact} | {a.action} |")
    L.append("")
    L.append("---")
    L.append("")

    # 3. Key URL Health
    L.append("## 3. Key URL Health")
    L.append("")
    L.append("| URL | HTTP | Response Time | Notes |")
    L.append("|---|---|---:|---|")
    for r in rep.key_url_results:
        emoji = "✅" if r["ok"] else "❌"
        note = "—"
        if not r["ok"]:
            note = "FAIL"
        elif r["time_ms"] > CRITICAL_RESPONSE_MS:
            note = "медленно"
        L.append(f"| {r['path']} | {emoji} {r['status']} | {r['time_ms']} мс | {note} |")
    L.append("")
    L.append("---")
    L.append("")

    # 4. Governance Checks
    L.append("## 4. Governance Checks")
    L.append("")
    L.append("### Routing / Canonical / Trailing Slash")
    L.append("")
    L.append("| Check | Result | Notes |")
    L.append("|---|---|---|")
    canon_failures = sum(1 for r in rep.rep_results if "❌" in r["canonical_ok"])
    L.append(f"| Self-referencing canonical | {'✅ OK' if canon_failures == 0 else f'❌ {canon_failures} drift'} | {len(rep.rep_results)} representative URLs |")
    L.append(f"| Trailing slash на canonical | {'✅ OK' if canon_failures == 0 else '❌ drift'} | По canonical comparison |")
    L.append("")
    L.append("### Sitemap / Robots / Indexability")
    L.append("")
    L.append("| Check | Result | Notes |")
    L.append("|---|---|---|")
    sm = rep.sitemap
    L.append(f"| sitemap-index.xml доступен | {'✅' if sm.get('total', 0) > 0 else '❌'} | {len(sm.get('files', []))} файлов, {sm.get('total', 0)} URL |")
    robots_ok = not any(a.check == "Robots" and a.severity == "CRITICAL" for a in rep.alerts)
    L.append(f"| robots.txt + Sitemap-директива | {'✅' if robots_ok else '❌'} | — |")
    idx_failures = sum(1 for r in rep.rep_results if "❌" in r["indexable_ok"])
    L.append(f"| Indexability roles | {'✅ OK' if idx_failures == 0 else f'❌ {idx_failures} drift'} | По REPRESENTATIVE_URLS |")
    L.append("")
    L.append("### Structured Data")
    L.append("")
    L.append("| Check | Result | Notes |")
    L.append("|---|---|---|")
    schema_failures = sum(1 for r in rep.rep_results if "❌" in r["schema_ok"])
    L.append(f"| Один BreadcrumbList на страницу | {'✅ OK' if schema_failures == 0 else f'❌ {schema_failures} drift'} | По representative URLs |")
    malformed = any(a.check == "Schema" and "malformed" in a.problem for a in rep.alerts)
    L.append(f"| Валидный JSON-LD | {'❌ malformed' if malformed else '✅ OK'} | json.loads() на каждом блоке |")
    L.append("")
    L.append("---")
    L.append("")

    # 5. Representative URL Audit
    L.append("## 5. Representative URL Audit")
    L.append("")
    L.append("| URL Type | Sample URL | HTTP | Canonical | Indexability | Schema | Mobile | Result |")
    L.append("|---|---|---|---|---|---|---|---|")
    for r in rep.rep_results:
        result = "✅ OK" if r["result"] == "OK" else "❌ FAIL"
        L.append(
            f"| {r['label']} | `{r['path']}` | {r['status']} | "
            f"{r['canonical_ok']} | {r['indexable_ok']} | {r['schema_ok']} | "
            f"{r['mobile']} | {result} |"
        )
    L.append("")
    L.append("---")
    L.append("")

    # 6. Conversion & Analytics
    L.append("## 6. Conversion & Analytics")
    L.append("")
    L.append("| Check | Result | Notes |")
    L.append("|---|---|---|")
    for c in rep.conversion_checks:
        L.append(f"| {c['check']} | {c['result']} | {c['notes']} |")
    L.append("")
    L.append("---")
    L.append("")

    # 7. Performance & Cache
    avg_ms = cache_now.get("avg_response_ms", 0)
    largest = max((r["size_kb"] for r in rep.rep_results), default=0)
    L.append("## 7. Performance & Cache")
    L.append("")
    L.append("| Check | Result | Notes |")
    L.append("|---|---|---|")
    L.append(f"| Avg response time (key URLs) | {avg_ms} мс | Порог: {CRITICAL_RESPONSE_MS} мс |")
    L.append(f"| Largest HTML sample | {largest} KB | Из representative audit |")
    if rep.ssl.get("active"):
        L.append(f"| SSL сертификат | ✅ {rep.ssl.get('expires')} | {rep.ssl.get('days_left')} дн. до истечения |")
    else:
        L.append(f"| SSL сертификат | ⚠️ check failed | {rep.ssl.get('error', '—')} |")
    L.append("| PageSpeed Insights | unavailable | Источник данных не подключён |")
    L.append("| Bundle size | unavailable | Не измеряется в runtime-мониторе |")
    L.append("")
    L.append("---")
    L.append("")

    # 8. Totals & Deltas
    L.append("## 8. Totals & Deltas")
    L.append("")
    L.append("| Metric | Current | Previous | Delta |")
    L.append("|---|---:|---:|---:|")
    metrics = [
        ("total sitemap URLs", "sitemap_total"),
        ("service URLs", "service_urls"),
        ("blog URLs", "blog_urls"),
        ("district URLs", "district_urls"),
        ("MO city URLs", "mo_city_urls"),
        ("mole city URLs", "mole_city_urls"),
        ("representative failures", "rep_failures"),
        ("critical alerts", "critical_alerts"),
        ("warnings", "warnings"),
        ("avg response time (мс)", "avg_response_ms"),
    ]
    for label, key in metrics:
        cur = cache_now.get(key)
        prev = cache_prev.get(key)
        cur_disp = "unavailable" if cur is None else cur
        prev_disp = "—" if prev is None else prev
        L.append(f"| {label} | {cur_disp} | {prev_disp} | {delta_arrow(cur, prev)} |")
    L.append("")
    L.append("---")
    L.append("")

    # 9. Stop-Conditions
    L.append("## 9. Stop-Conditions")
    L.append("")
    L.append("| Stop-condition | Status | Notes |")
    L.append("|---|---|---|")
    sc = {
        "Canonical drift": any(a.check == "Canonical" and a.severity == "CRITICAL" for a in rep.alerts),
        "Routing drift (rep URL ≠ 200)": any(a.check == "Representative" and a.severity == "CRITICAL" for a in rep.alerts),
        "Sitemap participation drift": any(a.check == "Sitemap" and a.severity == "CRITICAL" for a in rep.alerts),
        "Indexability-role drift": any(a.check == "Indexability" and a.severity == "CRITICAL" for a in rep.alerts),
        "Duplicate BreadcrumbList": any(a.check == "Schema" and "BreadcrumbList" in a.problem for a in rep.alerts),
        "WhatsApp / brand regression": any(a.check == "Brand Standard" for a in rep.alerts),
        "Analytics regression": any(a.check == "Analytics" and a.severity == "CRITICAL" for a in rep.alerts),
        "Conversion regression": any(a.check == "Conversion" and a.severity == "CRITICAL" for a in rep.alerts),
        "Malformed JSON-LD": any(a.check == "Schema" and "malformed" in a.problem for a in rep.alerts),
        "Critical response time breach": any(a.check == "Performance" for a in rep.alerts),
        "Internal linking leak (/admin)": any(a.check == "Internal Linking" for a in rep.alerts),
        "SSL expiry < 14 дней": any(a.check == "SSL" and a.severity == "CRITICAL" for a in rep.alerts),
    }
    for cond, triggered in sc.items():
        st = "❌" if triggered else "✅"
        notes = "Сработало — см. Critical Alerts" if triggered else "OK"
        L.append(f"| {cond} | {st} | {notes} |")
    L.append("")
    L.append("---")
    L.append("")

    # 10. Final Verdict
    L.append("## 10. Final Verdict")
    L.append("")
    L.append(f"**Status:** {status}  ")
    L.append(f"**Decision:** {decision}")
    L.append("")
    L.append("### Required actions")
    L.append("")
    actions = [a.action for a in rep.alerts if a.severity == "CRITICAL"]
    if not actions:
        actions = [a.action for a in rep.alerts if a.severity == "WARNING"]
    if not actions:
        L.append("1. Действий не требуется — система стабильна.")
    else:
        seen = set()
        idx = 1
        for act in actions:
            if act in seen:
                continue
            seen.add(act)
            L.append(f"{idx}. {act}")
            idx += 1
            if idx > 5:
                break
    L.append("")
    L.append("---")
    L.append("")
    L.append(f"**Последнее обновление:** {ts_str}")
    L.append("")
    return "\n".join(L)

# ─── Telegram alerts ────────────────────────────────────────────────────────

def send_telegram_if_needed(status: str, rep: Report) -> None:
    if status == "STABLE":
        return
    if not (TG_TOKEN and TG_CHAT):
        return
    icon = "🚨" if status == "CRITICAL" else "⚠️"
    crit = [a for a in rep.alerts if a.severity == "CRITICAL"][:5]
    warn = [a for a in rep.alerts if a.severity == "WARNING"][:3]
    parts = [f"{icon} *MONITORING — {status}*", "",
             f"goruslugimsk.ru ({datetime.now(MSK).strftime('%d.%m %H:%M MSK')})"]
    if crit:
        parts.append("\n*Critical:*")
        for a in crit:
            parts.append(f"• [{a.check}] {a.problem}")
    if warn:
        parts.append("\n*Warnings:*")
        for a in warn:
            parts.append(f"• [{a.check}] {a.problem}")
    text = "\n".join(parts)
    try:
        requests.post(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            json={"chat_id": TG_CHAT, "text": text, "parse_mode": "Markdown",
                  "disable_web_page_preview": True},
            timeout=10,
        )
    except Exception as e:
        print(f"[telegram] failed: {e}", file=sys.stderr)

# ─── Main ───────────────────────────────────────────────────────────────────

def main() -> int:
    print("🔍 Daily governance monitor — start")
    rep = Report()
    cache_prev = load_cache()

    check_ssl(rep)
    avg_ms = check_key_urls(rep)
    rep.sitemap = parse_sitemap_index(rep)
    check_robots(rep)
    check_representative(rep)

    homepage_fr = fetch("/")
    homepage_html = homepage_fr.html if homepage_fr.status == 200 else ""

    samples = [homepage_html]
    hub_fr = fetch("/uslugi/dezinsekciya/")
    if hub_fr.status == 200:
        samples.append(hub_fr.html)
    check_internal_linking_leaks(rep, samples)

    check_conversion(rep, homepage_html)
    check_pricing_consistency(rep, homepage_html)

    rep_failures = sum(1 for r in rep.rep_results if r["result"] != "OK")
    cache_now = {
        "date": datetime.now(MSK).strftime("%Y-%m-%d"),
        "sitemap_total": rep.sitemap.get("total", 0),
        "service_urls": rep.sitemap.get("service", 0),
        "blog_urls": rep.sitemap.get("blog", 0),
        "district_urls": rep.sitemap.get("district", 0),
        "mo_city_urls": rep.sitemap.get("mo_city", 0),
        "mole_city_urls": rep.sitemap.get("mole_city", 0),
        "rep_failures": rep_failures,
        "critical_alerts": rep.critical_count,
        "warnings": rep.warning_count,
        "avg_response_ms": avg_ms,
        "ssl_days_left": rep.ssl.get("days_left"),
        "stop_conditions_triggered": [a.check for a in rep.alerts if a.severity == "CRITICAL"],
    }

    if cache_prev:
        for label, key in [
            ("sitemap URLs", "sitemap_total"),
            ("service URLs", "service_urls"),
            ("blog URLs", "blog_urls"),
            ("district URLs", "district_urls"),
            ("MO city URLs", "mo_city_urls"),
            ("mole city URLs", "mole_city_urls"),
        ]:
            cur, prev = cache_now.get(key), cache_prev.get(key)
            if cur is not None and prev is not None and cur != prev:
                rep.summary_changes.append(f"{label}: {prev} → {cur} ({delta_arrow(cur, prev)})")
        if cache_prev.get("critical_alerts", 0) == 0 and rep.critical_count > 0:
            rep.summary_changes.append(f"Появились критичные алерты: {rep.critical_count}")
        if cache_prev.get("critical_alerts", 0) > 0 and rep.critical_count == 0:
            rep.summary_changes.append("Все критичные алерты устранены ✅")

    status, decision = decide_status(rep)

    md = render_markdown(rep, cache_now, cache_prev, status, decision)
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        f.write(md)
    save_cache(cache_now)

    send_telegram_if_needed(status, rep)

    print(f"✅ Report written: {REPORT_FILE}")
    print(f"   Status: {status} | Critical: {rep.critical_count} | Warnings: {rep.warning_count}")
    print(f"   Sitemap total: {cache_now['sitemap_total']} | Avg response: {avg_ms} мс")
    return 0


if __name__ == "__main__":
    sys.exit(main())
