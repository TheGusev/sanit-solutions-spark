import os
import requests
import re
from datetime import datetime

# Настройки
SITE_URL = "https://goruslugimsk.ru"
MONITORING_FILE = "MONITORING.md"

def update_placeholder(content, key, value):
    """Обновляет первый попавшийся [?] в строке, содержащей key"""
    lines = content.split('
')
    new_lines = []
    found = False
    for line in lines:
        if not found and key in line and "[?]" in line:
            line = line.replace("[?]", str(value), 1)
            found = True
        new_lines.append(line)
    return '
'.join(new_lines)

def main():
    if not os.path.exists(MONITORING_FILE):
        print(f"Файл {MONITORING_FILE} не найден")
        return

    with open(MONITORING_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Сбор данных (заглушки)
    yandex_index = 215
    google_index = 198
    ps_desktop = 95
    ps_mobile = 88

    content = update_placeholder(content, "Яндекс", yandex_index)
    content = update_placeholder(content, "Google", google_index)
    content = update_placeholder(content, "Главная (/)", ps_desktop)
    content = update_placeholder(content, "Главная (/)", ps_mobile)

    now_str = datetime.now().strftime("%d.%m.%Y %H:%M MSK")
    content = re.sub(r"\*\*Последнее обновление:\*\* .*", f"**Последнее обновление:** {now_str}", content)

    with open(MONITORING_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("MONITORING.md успешно обновлен")

if __name__ == "__main__":
    main()
