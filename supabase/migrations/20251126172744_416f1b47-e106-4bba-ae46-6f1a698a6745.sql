-- Создать таблицу traffic_events для логирования событий
CREATE TABLE IF NOT EXISTS public.traffic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  page_url TEXT NOT NULL,
  referrer TEXT,
  -- UTM параметры
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  keyword_raw TEXT,
  -- Дополнительные параметры рекламных систем
  yclid TEXT,
  gclid TEXT,
  -- Определённый интент
  intent TEXT,
  -- Устройство и гео
  device_type TEXT,
  -- Тип события
  event_type TEXT NOT NULL,
  -- Дополнительные данные в JSON
  event_data JSONB
);

-- Индексы для эффективных запросов
CREATE INDEX IF NOT EXISTS idx_traffic_events_session ON public.traffic_events(session_id);
CREATE INDEX IF NOT EXISTS idx_traffic_events_timestamp ON public.traffic_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_events_intent ON public.traffic_events(intent);
CREATE INDEX IF NOT EXISTS idx_traffic_events_utm_source ON public.traffic_events(utm_source);
CREATE INDEX IF NOT EXISTS idx_traffic_events_event_type ON public.traffic_events(event_type);

-- RLS: разрешить анонимную вставку для логирования
ALTER TABLE public.traffic_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for traffic events"
ON public.traffic_events
FOR INSERT
WITH CHECK (true);

-- Расширить таблицу leads новыми полями для интент-архитектуры
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS keyword TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS yclid TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS gclid TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS intent TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS first_landing_url TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_page_url TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS device_type TEXT;