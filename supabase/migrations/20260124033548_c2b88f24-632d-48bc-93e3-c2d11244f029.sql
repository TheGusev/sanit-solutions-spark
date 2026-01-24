-- =====================================================
-- ПРОБЛЕМА 1: Ужесточение RLS политик
-- =====================================================

-- 1. mvt_impressions - валидация session_id
DROP POLICY IF EXISTS "Allow public to insert mvt_impressions" ON mvt_impressions;

CREATE POLICY "Validated insert for mvt_impressions"
ON mvt_impressions FOR INSERT
WITH CHECK (
  session_id IS NOT NULL 
  AND length(session_id) >= 20
  AND length(session_id) <= 50
  AND test_name IS NOT NULL
  AND length(test_name) <= 100
  AND variant_key IS NOT NULL
  AND length(variant_key) <= 20
);

-- 2. traffic_events - whitelist event_type + session_id валидация
DROP POLICY IF EXISTS "Allow public insert for traffic events" ON traffic_events;

CREATE POLICY "Validated insert for traffic_events"
ON traffic_events FOR INSERT
WITH CHECK (
  session_id IS NOT NULL 
  AND length(session_id) >= 20
  AND length(session_id) <= 50
  AND event_type IN (
    'page_view', 'scroll_depth', 'time_on_page', 
    'calculator_open', 'calculator_submit', 'lead_submit',
    'phone_click', 'whatsapp_click', 'modal_open', 'modal_close',
    'ab_impression', 'mvt_impression', 'exit_intent_show',
    'form_start', 'form_abandon', 'cta_click'
  )
  AND page_url IS NOT NULL
  AND length(page_url) <= 2048
);

-- 3. leads - валидация телефона и имени
DROP POLICY IF EXISTS "Allow public insert" ON leads;

CREATE POLICY "Validated insert for leads"
ON leads FOR INSERT
WITH CHECK (
  phone IS NOT NULL
  AND length(phone) >= 10
  AND length(phone) <= 30
  AND name IS NOT NULL
  AND length(name) >= 2
  AND length(name) <= 100
);

-- 4. reviews - валидация рейтинга и текста
DROP POLICY IF EXISTS "Public can insert reviews" ON reviews;

CREATE POLICY "Validated insert for reviews"
ON reviews FOR INSERT
WITH CHECK (
  rating >= 1 AND rating <= 5
  AND display_name IS NOT NULL
  AND length(display_name) >= 2
  AND length(display_name) <= 100
  AND text IS NOT NULL
  AND length(text) >= 10
  AND length(text) <= 2000
);