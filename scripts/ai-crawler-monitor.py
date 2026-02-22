#!/usr/bin/env python3
"""
AI Crawler Monitor — парсинг access.log Nginx для отслеживания AI-ботов.

Запуск:
  python3 scripts/ai-crawler-monitor.py [путь_к_access.log]

По умолчанию: /var/log/nginx/access.log
Фильтрует только запросы к /blog/ URL.
Опционально: отправка отчёта в Telegram (требуются env-переменные
TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID).
"""

import os
import re
import sys
from collections import defaultdict
from datetime import datetime

# ─── Целевые User-Agent AI-ботов ─────────────────────────────
AI_BOTS = [
    "PerplexityBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "anthropic-ai",
    "GoogleOther",
    "Google-Extended",
    "Applebot-Extended",
]

# Стандартный формат combined log Nginx
LOG_PATTERN = re.compile(
    r'(?P<ip>\S+) \S+ \S+ '
    r'\[(?P<date>[^\]]+)\] '
    r'"(?P<method>GET|POST|HEAD|PUT|DELETE|PATCH) (?P<url>\S+) [^"]*" '
    r'(?P<status>\d{3}) \S+ '
    r'"[^"]*" '
    r'"(?P<user_agent>[^"]*)"'
)


def parse_nginx_log(log_path: str):
    """Парсит access.log и возвращает статистику по AI-ботам."""
    bot_stats = defaultdict(lambda: defaultdict(int))
    bot_dates = defaultdict(set)

    try:
        with open(log_path, "r", encoding="utf-8", errors="replace") as f:
            for line in f:
                match = LOG_PATTERN.match(line)
                if not match:
                    continue

                data = match.groupdict()
                url = data["url"]
                ua = data["user_agent"]
                date_str = data["date"]

                # Фильтр: только /blog/ URL
                if "/blog/" not in url:
                    continue

                for bot in AI_BOTS:
                    if bot.lower() in ua.lower():
                        bot_stats[bot][url] += 1
                        # Извлекаем дату (dd/Mon/yyyy)
                        try:
                            dt = datetime.strptime(
                                date_str.split(":")[0], "%d/%b/%Y"
                            )
                            bot_dates[bot].add(dt.strftime("%Y-%m-%d"))
                        except ValueError:
                            pass
                        break

    except FileNotFoundError:
        print(f"❌ Файл не найден: {log_path}")
        sys.exit(1)

    return bot_stats, bot_dates


def format_report(bot_stats, bot_dates) -> str:
    """Формирует текстовый отчёт."""
    if not bot_stats:
        return "ℹ️ AI-боты не обнаружены в логе."

    lines = ["=== AI Crawlers Report ===", ""]
    total_hits = 0

    for bot in sorted(bot_stats.keys()):
        urls = bot_stats[bot]
        hits = sum(urls.values())
        total_hits += hits
        dates = sorted(bot_dates.get(bot, []))
        date_range = f"{dates[0]} — {dates[-1]}" if dates else "N/A"

        lines.append(f"🤖 {bot} ({hits} hits, {date_range})")
        for url, count in sorted(urls.items(), key=lambda x: x[1], reverse=True)[
            :10
        ]:
            lines.append(f"  {count:>4} → {url}")
        lines.append("")

    lines.append(f"Итого: {total_hits} обращений от AI-ботов к /blog/")
    return "\n".join(lines)


def send_telegram(text: str):
    """Отправка отчёта в Telegram (если настроены env-переменные)."""
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        return

    try:
        import requests  # noqa: delayed import

        requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={
                "chat_id": chat_id,
                "text": text[:4096],
                "parse_mode": "HTML",
            },
            timeout=10,
        )
        print("✅ Отчёт отправлен в Telegram")
    except Exception as e:
        print(f"⚠️ Не удалось отправить в Telegram: {e}")


if __name__ == "__main__":
    log_file = sys.argv[1] if len(sys.argv) > 1 else "/var/log/nginx/access.log"
    print(f"📂 Анализ: {log_file}")

    stats, dates = parse_nginx_log(log_file)
    report = format_report(stats, dates)
    print(report)

    # Опциональная отправка в Telegram
    if stats:
        send_telegram(report)
