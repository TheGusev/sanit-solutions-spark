-- Исправляем функции A/B тестирования, добавляя search_path для безопасности

-- Функция для инкремента сессий
CREATE OR REPLACE FUNCTION increment_ab_session(
  p_test_name text,
  p_intent text,
  p_variant_id text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO ab_test_stats (test_name, intent, variant_id, sessions_count, conversions_count)
  VALUES (p_test_name, p_intent, p_variant_id, 1, 0)
  ON CONFLICT (test_name, intent, variant_id)
  DO UPDATE SET
    sessions_count = ab_test_stats.sessions_count + 1,
    updated_at = now();
END;
$$;

-- Функция для инкремента конверсий
CREATE OR REPLACE FUNCTION increment_ab_conversion(
  p_test_name text,
  p_intent text,
  p_variant_id text,
  p_revenue numeric DEFAULT 0
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO ab_test_stats (test_name, intent, variant_id, sessions_count, conversions_count, revenue_sum)
  VALUES (p_test_name, p_intent, p_variant_id, 0, 1, p_revenue)
  ON CONFLICT (test_name, intent, variant_id)
  DO UPDATE SET
    conversions_count = ab_test_stats.conversions_count + 1,
    revenue_sum = ab_test_stats.revenue_sum + p_revenue,
    updated_at = now();
END;
$$;

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_ab_test_stats_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;