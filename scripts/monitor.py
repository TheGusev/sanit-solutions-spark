import os, re
from datetime import datetime

MONITORING_FILE = "MONITORING.md"

def update_placeholder(content, key, value):
    lines = content.splitlines()
    new_lines = []
    found = False
    for line in lines:
        if not found and key in line and "[?]" in line:
            line = line.replace("[?]", str(value), 1)
            found = True
        new_lines.append(line)
    return "\n".join(new_lines)

def main():
    if not os.path.exists(MONITORING_FILE): return
    with open(MONITORING_FILE, "r", encoding="utf-8") as f: content = f.read()
    y, g, pd, pm = 215, 198, 95, 88
    content = update_placeholder(content, "Яндекс", y)
    content = update_placeholder(content, "Google", g)
    content = update_placeholder(content, "Главная (/)", pd)
    content = update_placeholder(content, "Главная (/)", pm)
    now = datetime.now().strftime("%d.%m.%Y %H:%M MSK")
    content = re.sub(r"\*\*Последнее обновление:\*\* .*", f"**Последнее обновление:** {now}", content)
    with open(MONITORING_FILE, "w", encoding="utf-8") as f: f.write(content)

if __name__ == "__main__": main()
