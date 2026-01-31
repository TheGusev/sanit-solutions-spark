

# План: Исправление отправки мониторинга в Telegram

## Диагностика проблемы

**Причина**: Скрипт `scripts/monitor.py` запускается в GitHub Actions, а НЕ в Lovable Cloud. Поэтому он **не видит секреты** из Lovable Cloud.

| Среда | Где работает | Секреты |
|-------|-------------|---------|
| Lovable Cloud | Edge Functions (`handle-lead`, и т.д.) | ✅ Есть `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| GitHub Actions | `scripts/monitor.py` через workflow | ❌ Секреты нужно добавить отдельно |

---

## Что нужно сделать

### 1. Вам нужно добавить секреты в GitHub репозиторий

Я **не имею доступа** к настройкам GitHub репозитория. Вам нужно вручную добавить секреты:

1. Откройте: **GitHub → Settings → Secrets and variables → Actions**
2. Нажмите **New repository secret**
3. Добавьте три секрета:

| Secret Name | Value |
|-------------|-------|
| `TELEGRAM_BOT_TOKEN` | `6958845812:AAH48RU65h0f6wR8rCChjkmmkR1UxPndudI` |
| `TELEGRAM_CHAT_ID` | `-3429956285` |
| `YANDEX_METRIKA_TOKEN` | `y0__xCf0pjNBxi1sD0gwuuioBZlsy_3A7DHIQ6VVxvOSc5UJStOMg` |

### 2. Улучшить скрипт для диагностики

Обновить `scripts/monitor.py` чтобы показывать больше деталей при ошибках:

- Вывод статуса всех переменных окружения в начале
- Подробный вывод ответа Telegram API при ошибке
- Тест отправки пустого сообщения для проверки токенов

```python
# В начале main():
print(f"📋 Проверка конфигурации:")
print(f"   TELEGRAM_BOT_TOKEN: {'✅ задан' if TELEGRAM_BOT_TOKEN else '❌ НЕ ЗАДАН'}")
print(f"   TELEGRAM_CHAT_ID: {'✅ задан' if TELEGRAM_CHAT_ID else '❌ НЕ ЗАДАН'}")
print(f"   YANDEX_METRIKA_TOKEN: {'✅ задан' if METRIKA_TOKEN else '❌ НЕ ЗАДАН'}")
```

```python
# В send_telegram_report() — детальный вывод ошибки:
except requests.RequestException as e:
    print(f"❌ Ошибка отправки в Telegram: {e}")
    if hasattr(e, 'response') and e.response:
        print(f"   Response: {e.response.text}")
    return False
```

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `scripts/monitor.py` | Добавить диагностику переменных окружения |
| GitHub Secrets | **Вручную** добавить 3 секрета |

---

## Проверка после добавления секретов

После добавления секретов в GitHub:

1. Перейдите в **Actions → Daily Site Monitoring**
2. Нажмите **Run workflow**
3. Проверьте логи — должно появиться:
   - `✅ TELEGRAM_BOT_TOKEN: задан`
   - `✅ TELEGRAM_CHAT_ID: задан`
   - `✅ Отчёт отправлен в Telegram`
4. Проверьте Telegram чат — сообщение должно прийти

---

## Важно

Секреты в Lovable Cloud и в GitHub — это **разные хранилища**:

```text
┌─────────────────────────────────────────────────────────────┐
│ Lovable Cloud                                               │
│ ┌─────────────────┐   ┌─────────────────┐                   │
│ │ Edge Functions  │ ← │ Secrets (5 шт)  │                   │
│ │ handle-lead     │   │ TELEGRAM_*      │                   │
│ │ submit-review   │   │ YANDEX_*        │                   │
│ └─────────────────┘   └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ GitHub Actions                                              │
│ ┌─────────────────┐   ┌─────────────────┐                   │
│ │ Workflow        │ ← │ GitHub Secrets  │ ← Нужно добавить! │
│ │ monitor.py      │   │ (пусто сейчас?) │                   │
│ └─────────────────┘   └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

Я **не могу** добавить секреты в GitHub — это нужно сделать вручную в настройках репозитория.

