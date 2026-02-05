#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Daily Site Monitoring для goruslugimsk.ru
Отправляет отчет в Telegram на основе MONITORING.md
"""

import os
import sys
import requests
from datetime import datetime

SITE_URL = "https://goruslugimsk.ru"
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def check_site_status():
    """Проверка доступности сайта"""
    try:
        response = requests.get(SITE_URL, timeout=10)
        return {
            "status": "🟢 Доступен" if response.status_code == 200 else f"🟡 HTTP {response.status_code}",
            "response_time": round(response.elapsed.total_seconds() * 1000),
            "status_code": response.status_code
        }
    except Exception as e:
        return {
            "status": "🔴 Недоступен",
            "response_time": 0,
            "error": str(e)
        }

def send_telegram_message(message):
    """Отправка сообщения в Telegram"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("⚠️ TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не установлены")
        return False

    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": True
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

def generate_report():
    """Генерация отчета мониторинга"""
    now = datetime.now().strftime("%d.%m.%Y %H:%M MSK")
    site_status = check_site_status()

    report = f"""📊 <b>Ежедневный мониторинг goruslugimsk.ru</b>
🕐 {now}

━━━━━━━━━━━━━━━━━━━━

<b>🌐 Статус сайта</b>
• Состояние: {site_status['status']}
• Время отклика: {site_status['response_time']} мс
• URL: {SITE_URL}

━━━━━━━━━━━━━━━━━━━━

<b>🔍 Индексация</b>
• Яндекс: Проверка вручную в Вебмастере
• Google: Проверка через Search Console
• Цель: 170+ страниц в индексе

<b>📈 Позиции (Яндекс)</b>
• "дезинфекция москва" (~15K показов)
• "дезинсекция москва" (~12K показов)
• "уничтожение клопов москва" (~20K показов)

<b>👥 Трафик</b>
• Метрика: <a href="https://metrika.yandex.ru/dashboard?id=105828040">105828040</a>
• Февраль 2026: Анализ в процессе

<b>⚙️ Технические показатели</b>
• PageSpeed Desktop: 95
• PageSpeed Mobile: 88
• LCP: 95 мс (хорошо)

━━━━━━━━━━━━━━━━━━━━

<b>✅ Задачи на февраль 2026</b>
1️⃣ Создать 10 локальных страниц (Марьино, Химки и др.)
2️⃣ Проверить индексацию всех 158 статей блога
3️⃣ Довести PageSpeed до 100/100 на главной

━━━━━━━━━━━━━━━━━━━━

<b>🚨 Алерты</b>
• ⚠️ Нет локальных страниц под гео-запросы (высокий приоритет)

━━━━━━━━━━━━━━━━━━━━

📝 Подробный мониторинг: <a href="https://github.com/TheGusev/sanit-solutions-spark/blob/main/MONITORING.md">MONITORING.md</a>
🤖 GitHub Actions: <a href="https://github.com/TheGusev/sanit-solutions-spark/actions">Workflows</a>
"""

    return report

def main():
    """Основная функция"""
    print("🚀 Запуск мониторинга goruslugimsk.ru...")

    report = generate_report()
    print("\n" + "="*50)
    print(report)
    print("="*50 + "\n")

    success = send_telegram_message(report)

    if success:
        print("✅ Мониторинг завершен успешно")
        sys.exit(0)
    else:
        print("⚠️ Мониторинг завершен с предупреждениями")
        sys.exit(0)  # Не падаем, даже если Telegram не работает

if __name__ == "__main__":
    main()
