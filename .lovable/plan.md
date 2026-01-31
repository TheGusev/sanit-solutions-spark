

# План: Доработка системы мониторинга с Яндекс.Метрикой и Telegram

## Текущее состояние

**Проблема**: Скрипт `scripts/monitor.py` — это заглушка, которая:
- НЕ получает данные из Яндекс.Метрики API
- НЕ отправляет уведомления в Telegram
- Просто заменяет плейсхолдеры захардкоженными числами

**Что уже настроено**:
| Компонент | Статус |
|-----------|--------|
| `.github/workflows/monitoring.yml` | Настроен правильно (env variables) |
| `MONITORING.md` | Шаблон готов |
| Telegram секреты в Lovable Cloud | Есть (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) |
| `YANDEX_METRIKA_TOKEN` | НЕТ (нужно добавить) |

---

## Что нужно сделать

### 1. Добавить секрет YANDEX_METRIKA_TOKEN в Lovable Cloud
Добавить OAuth-токен Яндекс.Метрики: `y0__xCf0pjNBxi1sD0gwuuioBZlsy_3A7DHIQ6VVxvOSc5UJStOMg`

### 2. Переписать scripts/monitor.py
Создать полноценный скрипт мониторинга:

```text
Функции скрипта:
├── get_metrika_stats() — запрос к API Яндекс.Метрики
│   └── Метрики: визиты, посетители, просмотры, отказы, время на сайте
├── check_site_health() — проверка доступности сайта
│   └── HTTP статус, время ответа
├── send_telegram_report() — отправка отчёта в Telegram
│   └── Форматированное сообщение с данными
├── update_monitoring_file() — обновление MONITORING.md
│   └── Замена плейсхолдеров реальными данными
└── main() — точка входа
```

**Структура Telegram-отчёта**:
```
📊 Ежедневный отчёт goruslugimsk.ru

📈 Метрика (7 дней):
• Визиты: 1,234
• Посетители: 987
• Отказы: 25.4%
• Время: 2:45

🌐 Сайт:
• Статус: ✅ OK (234ms)
• SSL: ✅ Активен

🕐 01.02.2026 09:00 MSK
```

### 3. Пользователю: добавить секреты в GitHub
Поскольку GitHub Actions запускается отдельно от Lovable Cloud, секреты нужно добавить в двух местах:

**Для GitHub Actions** (Settings → Secrets → Actions):
- `TELEGRAM_BOT_TOKEN`: `6958845812:AAH48RU65h0f6wR8rCChjkmmkR1UxPndudI`
- `TELEGRAM_CHAT_ID`: `-3429956285`
- `YANDEX_METRIKA_TOKEN`: `y0__xCf0pjNBxi1sD0gwuuioBZlsy_3A7DHIQ6VVxvOSc5UJStOMg`

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `scripts/monitor.py` | Полностью переписать (добавить API Метрики + Telegram) |
| Lovable Cloud Secrets | Добавить `YANDEX_METRIKA_TOKEN` |

---

## Технические детали скрипта

### API Яндекс.Метрики
```python
# Endpoint
url = f"https://api-metrika.yandex.net/stat/v1/data"
params = {
    "id": METRIKA_ID,  # 105828040
    "metrics": "ym:s:visits,ym:s:users,ym:s:bounceRate,ym:s:avgVisitDurationSeconds",
    "date1": "7daysAgo",
    "date2": "today"
}
headers = {"Authorization": f"OAuth {token}"}
```

### Telegram Bot API
```python
# Endpoint
url = f"https://api.telegram.org/bot{token}/sendMessage"
payload = {
    "chat_id": chat_id,
    "text": message,
    "parse_mode": "Markdown"
}
```

---

## Ожидаемый результат

После выполнения:
1. Каждый день в 09:00 MSK запускается мониторинг
2. Скрипт получает реальные данные из Яндекс.Метрики
3. Отправляет отчёт в Telegram группу `-3429956285`
4. Обновляет файл `MONITORING.md` с актуальными данными
5. Коммитит изменения в репозиторий

**Важно**: После моих изменений вам нужно добавить 3 секрета в GitHub репозиторий вручную (Settings → Secrets → Actions), потому что я не имею доступа к настройкам GitHub.

