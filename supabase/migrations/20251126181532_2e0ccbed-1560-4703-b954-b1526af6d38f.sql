-- Добавить variant_id для A/B тестирования
ALTER TABLE traffic_events ADD COLUMN IF NOT EXISTS variant_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS variant_id TEXT;

-- Индексы для аналитики A/B тестов
CREATE INDEX IF NOT EXISTS idx_traffic_events_variant ON traffic_events(variant_id);
CREATE INDEX IF NOT EXISTS idx_leads_variant ON leads(variant_id);