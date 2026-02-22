#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Daily Site Monitoring для goruslugimsk.ru
Проверяет несколько ключевых URL, SSL-сертификат и отправляет отчёт в Telegram.
"""

import os
import sys
import ssl
import socket
import requests
from datetime import datetime

SITE_URL = os.getenv("SITE_URL", "https://goruslugimsk.ru")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

# Ключевые URL для проверки (все имеют статические index.html)
KEY_URLS = [
    "/",
    "/uslugi/dezinfekciya/",
    "/uslugi/dezinsekciya/",
    "/blog/",
    "/contacts/",
    "/rajony/arbat/",
    "/moscow-oblast/khimki/",
]


def check_url(url: str, timeout: int = 10) -> dict:
    """Проверка доступности одного URL."""
    try:
        response = requests.get(url, timeout=timeout, allow_redirects=True)
        return {
            "url": url,
            "status_code": response.status_code,
            "response_time": round(response.elapsed.total_seconds() * 1000),
            "ok": response.status_code == 200,
        }
    except Exception as e:
        return {
            "url": url,
            "status_code": 0,
            "response_time": 0,
            "ok": False,
            "error": str(e),
        }


def check_all_urls() -> list[dict]:
    """Проверка всех ключевых URL."""
    results = []
    for path in KEY_URLS:
        url = f"{SITE_URL}{path}" if path != "/" else SITE_URL
        results.append(check_url(url))
    return results


def check_ssl_expiry(hostname: str = "goruslugimsk.ru") -> dict:
    """Проверка срока действия SSL-сертификата."""
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
            s.settimeout(10)
            s.connect((hostname, 443))
            cert = s.getpeercert()
            expires_str = cert["notAfter"]
            expires = datetime.strptime(expires_str, "%b %d %H:%M:%S %Y %Z")
            days_left = (expires - datetime.utcnow()).days
            return {
                "valid": True,
                "expires": expires.strftime("%d.%m.%Y"),
                "days_left": days_left,
                "warning": days_left < 30,
            }
    except Exception as e:
        return {"valid": False, "error": str(e), "days_left": 0, "warning": True}


def send_telegram_message(message: str) -> bool:
    """Отправка сообщения в Telegram."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("⚠️ TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не установлены")
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            print("✅ Отчет отправлен в Telegram")
            return True
        else:
            print(f"❌ Ошибка отправки: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Ошибка Telegram API: {e}")
        return False


def update_monitoring_md(url_results: list[dict], ssl_info: dict):
    """Обновляет дату последнего обновления в MONITORING.md (для git commit в CI)."""
    md_path = os.path.join(os.path.dirname(__file__), "..", "MONITORING.md")
    if not os.path.exists(md_path):
        return

    now = datetime.now().strftime("%d.%m.%Y")
    try:
        with open(md_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Обновляем только нижнюю строку с датой
        import re
        content = re.sub(
            r"\*\*Последнее обновление:\*\*.*$",
            f"**Последнее обновление:** {now}",
            content,
            flags=re.MULTILINE,
        )

        with open(md_path, "w", encoding="utf-8") as f:
            f.write(content)

        print(f"📝 MONITORING.md обновлён ({now})")
    except Exception as e:
        print(f"⚠️ Не удалось обновить MONITORING.md: {e}")


def generate_report(url_results: list[dict], ssl_info: dict) -> str:
    """Генерация динамического отчёта мониторинга."""
    now = datetime.now().strftime("%d.%m.%Y %H:%M MSK")

    # Статус URL
    all_ok = all(r["ok"] for r in url_results)
    site_emoji = "🟢" if all_ok else "🔴"
    avg_time = round(sum(r["response_time"] for r in url_results) / len(url_results))

    url_lines = []
    for r in url_results:
        path = r["url"].replace(SITE_URL, "") or "/"
        emoji = "✅" if r["ok"] else "❌"
        time_str = f"{r['response_time']} мс" if r["ok"] else f"ОШИБКА"
        url_lines.append(f"  {emoji} {path} — {time_str}")

    urls_block = "\n".join(url_lines)

    # SSL
    if ssl_info["valid"]:
        ssl_emoji = "⚠️" if ssl_info["warning"] else "✅"
        ssl_line = f"{ssl_emoji} SSL до {ssl_info['expires']} ({ssl_info['days_left']} дн.)"
    else:
        ssl_line = f"🔴 SSL ошибка: {ssl_info.get('error', 'unknown')}"

    report = f"""📊 <b>Ежедневный мониторинг goruslugimsk.ru</b>
🕐 {now}

━━━━━━━━━━━━━━━━━━━━

<b>{site_emoji} Статус сайта</b> (ср. отклик {avg_time} мс)
{urls_block}

<b>🔐 Сертификат</b>
• {ssl_line}

━━━━━━━━━━━━━━━━━━━━

<b>📄 Контент</b>
• Всего страниц в SSG: ~547
• Блог (уникальных статей): 176
• Районы + округа: 145
• Города МО: 51
• Услуги + подстраницы: 51
• НЧ-страницы: 120

<b>🔍 Индексация</b>
• Цель: 500+ страниц в индексе
• Яндекс: проверить в Вебмастере
• Google: проверить в GSC

<b>⚙️ PageSpeed (последний замер)</b>
• Desktop: 95 | Mobile: 88
• LCP: 0.95 с | CLS: 0.04

━━━━━━━━━━━━━━━━━━━━

<b>✅ Задачи (Февраль 2026)</b>
3️⃣ Проверить индексацию 176 статей блога
4️⃣ Довести PageSpeed до 100/100
5️⃣ Заполнить данные о конкурентах
6️⃣ Настроить аналитику конверсий

━━━━━━━━━━━━━━━━━━━━

📝 <a href="https://github.com/TheGusev/sanit-solutions-spark/blob/main/MONITORING.md">MONITORING.md</a>
🤖 <a href="https://github.com/TheGusev/sanit-solutions-spark/actions">Workflows</a>
"""

    return report


def main():
    """Основная функция."""
    print("🚀 Запуск мониторинга goruslugimsk.ru...")

    # 1. Проверка URL
    url_results = check_all_urls()
    for r in url_results:
        status = "OK" if r["ok"] else f"FAIL ({r.get('error', r['status_code'])})"
        print(f"  {r['url']} — {status} ({r['response_time']} мс)")

    # 2. Проверка SSL
    ssl_info = check_ssl_expiry()
    if ssl_info["valid"]:
        print(f"  SSL: до {ssl_info['expires']} ({ssl_info['days_left']} дней)")
    else:
        print(f"  SSL: ОШИБКА — {ssl_info.get('error')}")

    # 3. Обновление MONITORING.md
    update_monitoring_md(url_results, ssl_info)

    # 4. Генерация и отправка отчёта
    report = generate_report(url_results, ssl_info)
    print("\n" + "=" * 50)
    print(report)
    print("=" * 50 + "\n")

    success = send_telegram_message(report)

    if success:
        print("✅ Мониторинг завершен успешно")
    else:
        print("⚠️ Мониторинг завершен с предупреждениями")

    sys.exit(0)


if __name__ == "__main__":
    main()
