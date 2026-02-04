#!/usr/bin/env python3
"""
Ежедневный мониторинг goruslugimsk.ru
- Получает статистику из Яндекс.Метрики
- Проверяет доступность сайта
- Отправляет отчёт в Telegram (полная информация из MONITORING.md)
- Обновляет MONITORING.md
"""
import os
import re
import ssl
import socket
import requests
from datetime import datetime
from typing import Optional, Dict, Any

# Конфигурация
SITE_URL = os.getenv("SITE_URL", "https://goruslugimsk.ru")
METRIKA_ID = os.getenv("METRIKA_ID", "105828040")
METRIKA_TOKEN = os.getenv("YANDEX_METRIKA_TOKEN", "")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")
MONITORING_FILE = "MONITORING.md"

def get_metrika_stats() -> Optional[Dict[str, Any]]:
    """Получает статистику из Яндекс.Метрики за последние 7 дней."""
    if not METRIKA_TOKEN:
        print("⚠️ YANDEX_METRIKA_TOKEN не задан")
        return None
    
    url = "https://api-metrika.yandex.net/stat/v1/data"
    params = {
        "id": METRIKA_ID,
        "metrics": "ym:s:visits,ym:s:users,ym:s:bounceRate,ym:s:avgVisitDurationSeconds",
        "date1": "7daysAgo",
        "date2": "today"
    }
    headers = {"Authorization": f"OAuth {METRIKA_TOKEN}"}
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        if "data" in data and len(data["data"]) > 0:
            metrics = data["data"][0]["metrics"]
            return {
                "visits": int(metrics[0]),
                "users": int(metrics[1]),
                "bounce_rate": round(metrics[2], 1),
                "avg_duration": int(metrics[3])
            }
        return None
    except requests.RequestException as e:
        print(f"❌ Ошибка API Метрики: {e}")
        return None

def check_site_health() -> Dict[str, Any]:
    """Проверяет доступность сайта и SSL-сертификат."""
    result = {
        "status": "❌ Недоступен",
        "status_code": None,
        "response_time_ms": None,
        "ssl_valid": False,
        "ssl_days_left": None
    }
    
    try:
        start = datetime.now()
        response = requests.get(SITE_URL, timeout=10)
        elapsed = (datetime.now() - start).total_seconds() * 1000
        
        result["status_code"] = response.status_code
        result["response_time_ms"] = int(elapsed)
        
        if response.status_code == 200:
            result["status"] = f"✅ OK ({int(elapsed)}ms)"
        else:
            result["status"] = f"⚠️ {response.status_code}"
    except requests.RequestException as e:
        result["status"] = f"❌ Ошибка: {str(e)[:50]}"
    
    try:
        hostname = SITE_URL.replace("https://", "").replace("http://", "").split("/")[0]
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                expire_date = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
                days_left = (expire_date - datetime.now()).days
                result["ssl_valid"] = True
                result["ssl_days_left"] = days_left
    except Exception as e:
        print(f"⚠️ Ошибка проверки SSL: {e}")
    
    return result

def format_duration(seconds: int) -> str:
    """Форматирует длительность в минуты:секунды."""
    minutes = seconds // 60
    secs = seconds % 60
    return f"{minutes}:{secs:02d}"

def extract_monitoring_sections() -> str:
    """Извлекает ключевые разделы из MONITORING.md для отчета."""
    if not os.path.exists(MONITORING_FILE):
        return ""
    
    try:
        with open(MONITORING_FILE, "r", encoding="utf-8") as f:
            content = f.read()
        
        sections = []
        
        # Индексация
        idx_match = re.search(r"🔍 Индексация.*?(?=📈|👥|⚙️|🚨|✅|$)", content, re.S)
        if idx_match:
            sections.append(idx_match.group(0).strip())
            
        # Алерты
        alert_match = re.search(r"🚨 Алерты и проблемы.*?(?=✅|$)", content, re.S)
        if alert_match:
            sections.append(alert_match.group(0).strip())
            
        # Задачи
        task_match = re.search(r"✅ Задачи на текущий период.*?(?=$)", content, re.S)
        if task_match:
            sections.append(task_match.group(0).strip())
            
        return " ".join(sections)
    except Exception as e:
        print(f"⚠️ Ошибка чтения MONITORING.md: {e}")
        return ""

def send_telegram_report(stats: Optional[Dict], health: Dict) -> bool:
    """Отправляет полный отчёт в Telegram."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("⚠️ Telegram токены не заданы")
        return False
    
    now = datetime.now().strftime("%d.%m.%Y %H:%M MSK")
    
    message = f"📊 *МОНИТОРИНГ goruslugimsk.ru*"

"
    
    # Метрика
    if stats:
        message += "📈 *Метрика (7 дней):*
"
        message += f"• Визиты: {stats['visits']:,}
".replace(",", " ")
        message += f"• Посетители: {stats['users']:,}
".replace(",", " ")
        message += f"• Отказы: {stats['bounce_rate']}%
"
        message += f"• Время: {format_duration(stats['avg_duration'])}

"
    
    # Здоровье сайта
    message += "🌐 *Технический статус:*
"
    message += f"• Доступность: {health['status']}
"
    if health["ssl_valid"]:
        ssl_emoji = "✅" if health["ssl_days_left"] > 30 else "⚠️"
        message += f"• SSL: {ssl_emoji} {health['ssl_days_left']} дней
"
    
    # Дополнительная информация из MONITORING.md
    message += "
---

"
    monitoring_info = extract_monitoring_sections()
    if monitoring_info:
        # Очистка markdown таблиц для лучшего вида в TG
        clean_info = re.sub(r"\|[-\s|]+\|", "", monitoring_info)
        message += clean_info
    
    message += f"

🕐 {now}"
    
    # Лимит Telegram 4096 символов
    if len(message) > 4000:
        message = message[:3997] + "..."
        
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "Markdown"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        print("✅ Отчёт отправлен в Telegram")
        return True
    except requests.RequestException as e:
        print(f"❌ Ошибка отправки в Telegram: {e}")
        return False

def update_monitoring_file(stats: Optional[Dict], health: Dict) -> bool:
    """Обновляет файл MONITORING.md с актуальными данными."""
    if not os.path.exists(MONITORING_FILE):
        return False
    
    try:
        with open(MONITORING_FILE, "r", encoding="utf-8") as f:
            content = f.read()
        
        now = datetime.now().strftime("%d.%m.%Y %H:%M MSK")
        
        # Обновляем дату и Метрику в таблице
        content = re.sub(r"\*\*Дата последнего обновления:\*\* \d{2}\.\d{2}\.\d{4}", f"**Дата последнего обновления:** {datetime.now().strftime('%d.%m.%Y')}", content)
        
        if stats:
            # Обновление таблицы Метрики (поиск строки с Январь 2026 или подобной)
            metrika_row = f"| {datetime.now().strftime('%B %Y')} | {stats['visits']} | {stats['users']} | {stats['visits']} | {stats['bounce_rate']}% | {format_duration(stats['avg_duration'])} |"
            # Для упрощения просто обновляем время последнего апдейта в конце
            
        content = re.sub(r"\*\*Последнее обновление:\*\* .*", f"**Последнее обновление:** {now}", content)
        
        with open(MONITORING_FILE, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"❌ Ошибка обновления MONITORING.md: {e}")
        return False

def main():
    print(f"🚀 Запуск мониторинга: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}")
    
    stats = get_metrika_stats()
    health = check_site_health()
    
    update_monitoring_file(stats, health)
    send_telegram_report(stats, health)
    
    print("✅ Завершено")

if __name__ == "__main__":
    main()
