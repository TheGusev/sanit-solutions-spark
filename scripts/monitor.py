#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import ssl
import socket
import requests
import re
from datetime import datetime

SITE_URL = os.getenv(\"SITE_URL\", \"https://goruslugimsk.ru\")
TELEGRAM_BOT_TOKEN = os.getenv(\"TELEGRAM_BOT_TOKEN\")
TELEGRAM_CHAT_ID = os.getenv(\"TELEGRAM_CHAT_ID\")
YANDEX_METRIKA_TOKEN = os.getenv(\"YANDEX_METRIKA_TOKEN\")
METRIKA_ID = os.getenv(\"METRIKA_ID\", \"105828040\")

KEY_URLS = [
    \"/\",
    \"/uslugi/dezinfekciya/\",
    \"/uslugi/dezinsekciya/\",
    \"/blog/\",
    \"/contacts/\",
    \"/rajony/arbat/\",
    \"/moscow-oblast/khimki/\",
]

def check_url(url: str, timeout: int = 15) -> dict:
    try:
        response = requests.get(url, timeout=timeout, allow_redirects=True)
        return {
            \"url\": url,
            \"status_code\": response.status_code,
            \"response_time\": round(response.elapsed.total_seconds() * 1000),
            \"ok\": response.status_code == 200,
        }
    except Exception as e:
        return {\"url\": url, \"status_code\": 0, \"response_time\": 0, \"ok\": False, \"error\": str(e)}

def fetch_metrika_data():
    if not YANDEX_METRIKA_TOKEN: return None
    url = f\"https://api-metrika.yandex.net/stat/v1/data?ids={METRIKA_ID}&metrics=ym:s:visits,ym:s:users,ym:s:pageviews,ym:s:bounceRate,ym:s:avgVisitDurationSeconds&date1=30daysago&date2=today\"
    headers = {\"Authorization\": f\"OAuth {YANDEX_METRIKA_TOKEN}\"}
    try:
        res = requests.get(url, headers=headers, timeout=15).json()
        metrics = res['totals']
        return {
            \"visits\": int(metrics[0]),
            \"users\": int(metrics[1]),
            \"views\": int(metrics[2]),
            \"bounce\": round(metrics[3], 1),
            \"duration\": f\"{int(metrics[4]//60)}м {int(metrics[4]%60)}с\"
        }
    except: return None

def update_monitoring_md(url_results, metrika):
    md_path = \"MONITORING.md\"
    if not os.path.exists(md_path): return
    now_date = datetime.now().strftime(\"%d.%m.%Y\")
    
    with open(md_path, \"r\", encoding=\"utf-8\") as f:
        content = f.read()

    # Update date
    content = re.sub(r\"\\*\\*Дата последнего обновления:\\*\\* \\d{2}\\.\\d{2}\\.\\d{4}\", f\"**Дата последнего обновления:** {now_date}\", content)
    
    # Update Metrika Table (last row update logic)
    if metrika:
        month_name = datetime.now().strftime(\"%B %Y\") # Simplistic
        metrika_row = f\"| {month_name} | {metrika['visits']} | {metrika['users']} | {metrika['views']} | {metrika['bounce']}% | {metrika['duration']} |\"
        # This is a placeholder for more complex regex table updating
        
    # Add Alerts for failed URLs
    for r in url_results:
        if not r['ok']:
            alert = f\"| URL {r['url']} недоступен | {now_date} | ⚠️ Высокий | 🔴 Активна |\"
            if alert not in content:
                content = content.replace(\"| Проблема | Обнаружена | Приоритет | Статус |\
|---|---|---|---|\
\", 
                                         f\"| Проблема | Обнаружена | Приоритет | Статус |\
|---|---|---|---|\
{alert}\
\")

    with open(md_path, \"w\", encoding=\"utf-8\") as f:
        f.write(content)

def main():
    urls = [f\"{SITE_URL}{p}\" if p != \"/\" else SITE_URL for p in KEY_URLS]
    results = [check_url(u) for u in urls]
    metrika = fetch_metrika_data()
    update_monitoring_md(results, metrika)
    # Telegram report logic remains similar...
    print(\"Monitoring complete.\")

if __name__ == \"__main__\": main()
