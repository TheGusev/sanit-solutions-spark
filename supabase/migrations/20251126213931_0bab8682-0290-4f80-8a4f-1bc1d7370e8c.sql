-- Создаём таблицу для хранения A/B статистики
CREATE TABLE ab_test_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name text NOT NULL,
  intent text NOT NULL DEFAULT 'default',
  variant_id text NOT NULL CHECK (variant_id IN ('A', 'B')),
  sessions_count integer DEFAULT 0 CHECK (sessions_count >= 0),
  conversions_count integer DEFAULT 0 CHECK (conversions_count >= 0),
  revenue_sum numeric DEFAULT 0 CHECK (revenue_sum >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(test_name, intent, variant_id)
);

-- Индекс для быстрого поиска по test_name и intent
CREATE INDEX idx_ab_test_stats_lookup ON ab_test_stats(test_name, intent);

-- RLS: только админы могут читать статистику
ALTER TABLE ab_test_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read ab_test_stats"
  ON ab_test_stats FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Публичный INSERT/UPDATE для записи статистики (анонимные пользователи могут обновлять)
CREATE POLICY "Allow public stats update"
  ON ab_test_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public stats modifications"
  ON ab_test_stats FOR UPDATE
  USING (true);

-- Функция для инкремента сессий
CREATE OR REPLACE FUNCTION increment_ab_session(
  p_test_name text,
  p_intent text,
  p_variant_id text
) RETURNS void AS $$
BEGIN
  INSERT INTO ab_test_stats (test_name, intent, variant_id, sessions_count, conversions_count)
  VALUES (p_test_name, p_intent, p_variant_id, 1, 0)
  ON CONFLICT (test_name, intent, variant_id)
  DO UPDATE SET
    sessions_count = ab_test_stats.sessions_count + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для инкремента конверсий
CREATE OR REPLACE FUNCTION increment_ab_conversion(
  p_test_name text,
  p_intent text,
  p_variant_id text,
  p_revenue numeric DEFAULT 0
) RETURNS void AS $$
BEGIN
  INSERT INTO ab_test_stats (test_name, intent, variant_id, sessions_count, conversions_count, revenue_sum)
  VALUES (p_test_name, p_intent, p_variant_id, 0, 1, p_revenue)
  ON CONFLICT (test_name, intent, variant_id)
  DO UPDATE SET
    conversions_count = ab_test_stats.conversions_count + 1,
    revenue_sum = ab_test_stats.revenue_sum + p_revenue,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_ab_test_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ab_test_stats_updated_at
BEFORE UPDATE ON ab_test_stats
FOR EACH ROW
EXECUTE FUNCTION update_ab_test_stats_updated_at();