-- ===============================================
-- Миграция: Добавление валидации во все increment_* функции
-- Цель: Защита от невалидных входных данных
-- ===============================================

-- 1. increment_ab_session с валидацией
CREATE OR REPLACE FUNCTION public.increment_ab_session(p_test_name text, p_intent text, p_variant_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Валидация: test_name (макс 100 символов, только a-z, 0-9, _, -)
  IF p_test_name IS NULL OR 
     LENGTH(p_test_name) > 100 OR
     p_test_name !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid test_name format';
  END IF;

  -- Валидация: intent (макс 50 символов, только допустимые символы)
  IF p_intent IS NULL OR 
     LENGTH(p_intent) > 50 OR
     p_intent !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid intent format';
  END IF;

  -- Валидация: variant_id (только A-Z, 1 символ)
  IF p_variant_id IS NULL OR p_variant_id !~ '^[A-Z]$' THEN
    RAISE EXCEPTION 'Invalid variant_id: must be single uppercase letter';
  END IF;

  -- Основная логика
  INSERT INTO ab_test_stats (test_name, intent, variant_id, sessions_count, conversions_count)
  VALUES (p_test_name, p_intent, p_variant_id, 1, 0)
  ON CONFLICT (test_name, intent, variant_id)
  DO UPDATE SET
    sessions_count = ab_test_stats.sessions_count + 1,
    updated_at = now();
END;
$$;

-- 2. increment_ab_conversion с валидацией
CREATE OR REPLACE FUNCTION public.increment_ab_conversion(p_test_name text, p_intent text, p_variant_id text, p_revenue numeric DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Валидация: test_name
  IF p_test_name IS NULL OR 
     LENGTH(p_test_name) > 100 OR
     p_test_name !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid test_name format';
  END IF;

  -- Валидация: intent
  IF p_intent IS NULL OR 
     LENGTH(p_intent) > 50 OR
     p_intent !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid intent format';
  END IF;

  -- Валидация: variant_id
  IF p_variant_id IS NULL OR p_variant_id !~ '^[A-Z]$' THEN
    RAISE EXCEPTION 'Invalid variant_id';
  END IF;

  -- Валидация: revenue не может быть отрицательным
  IF p_revenue < 0 THEN
    RAISE EXCEPTION 'Revenue cannot be negative';
  END IF;

  -- Основная логика
  INSERT INTO ab_test_stats (test_name, intent, variant_id, sessions_count, conversions_count, revenue_sum)
  VALUES (p_test_name, p_intent, p_variant_id, 0, 1, p_revenue)
  ON CONFLICT (test_name, intent, variant_id)
  DO UPDATE SET
    conversions_count = ab_test_stats.conversions_count + 1,
    revenue_sum = ab_test_stats.revenue_sum + p_revenue,
    updated_at = now();
END;
$$;

-- 3. increment_arm_impressions с валидацией
CREATE OR REPLACE FUNCTION public.increment_arm_impressions(p_test_name text, p_intent text, p_variant_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Валидация: test_name
  IF p_test_name IS NULL OR 
     LENGTH(p_test_name) > 100 OR
     p_test_name !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid test_name format';
  END IF;

  -- Валидация: intent
  IF p_intent IS NULL OR 
     LENGTH(p_intent) > 50 OR
     p_intent !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid intent format';
  END IF;

  -- Валидация: variant_key (макс 20 символов)
  IF p_variant_key IS NULL OR 
     LENGTH(p_variant_key) > 20 OR
     p_variant_key !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid variant_key format';
  END IF;

  -- Основная логика
  INSERT INTO mvt_arm_params (test_name, intent, variant_key, impressions_count, alpha, beta)
  VALUES (p_test_name, p_intent, p_variant_key, 1, 1, 1)
  ON CONFLICT (test_name, intent, variant_key)
  DO UPDATE SET
    impressions_count = mvt_arm_params.impressions_count + 1,
    updated_at = now();
END;
$$;

-- 4. increment_arm_alpha с валидацией
CREATE OR REPLACE FUNCTION public.increment_arm_alpha(p_test_name text, p_intent text, p_variant_key text, p_revenue numeric DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Валидация: test_name
  IF p_test_name IS NULL OR 
     LENGTH(p_test_name) > 100 OR
     p_test_name !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid test_name format';
  END IF;

  -- Валидация: intent
  IF p_intent IS NULL OR 
     LENGTH(p_intent) > 50 OR
     p_intent !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid intent format';
  END IF;

  -- Валидация: variant_key
  IF p_variant_key IS NULL OR 
     LENGTH(p_variant_key) > 20 OR
     p_variant_key !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid variant_key format';
  END IF;

  -- Валидация: revenue
  IF p_revenue < 0 THEN
    RAISE EXCEPTION 'Revenue cannot be negative';
  END IF;

  -- Основная логика
  INSERT INTO mvt_arm_params (test_name, intent, variant_key, alpha, beta, conversions_count, revenue_sum)
  VALUES (p_test_name, p_intent, p_variant_key, 2, 1, 1, p_revenue)
  ON CONFLICT (test_name, intent, variant_key)
  DO UPDATE SET
    alpha = mvt_arm_params.alpha + 1,
    conversions_count = mvt_arm_params.conversions_count + 1,
    revenue_sum = mvt_arm_params.revenue_sum + p_revenue,
    updated_at = now();
END;
$$;

-- 5. increment_arm_beta с валидацией
CREATE OR REPLACE FUNCTION public.increment_arm_beta(p_test_name text, p_intent text, p_variant_key text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Валидация: test_name
  IF p_test_name IS NULL OR 
     LENGTH(p_test_name) > 100 OR
     p_test_name !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid test_name format';
  END IF;

  -- Валидация: intent
  IF p_intent IS NULL OR 
     LENGTH(p_intent) > 50 OR
     p_intent !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid intent format';
  END IF;

  -- Валидация: variant_key
  IF p_variant_key IS NULL OR 
     LENGTH(p_variant_key) > 20 OR
     p_variant_key !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid variant_key format';
  END IF;

  -- Основная логика
  INSERT INTO mvt_arm_params (test_name, intent, variant_key, alpha, beta)
  VALUES (p_test_name, p_intent, p_variant_key, 1, 2)
  ON CONFLICT (test_name, intent, variant_key)
  DO UPDATE SET
    beta = mvt_arm_params.beta + 1,
    updated_at = now();
END;
$$;

-- Добавляем комментарии
COMMENT ON FUNCTION public.increment_ab_session IS 'Инкремент сессий A/B теста с валидацией входных данных';
COMMENT ON FUNCTION public.increment_ab_conversion IS 'Инкремент конверсий A/B теста с валидацией входных данных';
COMMENT ON FUNCTION public.increment_arm_impressions IS 'Инкремент показов MVT теста с валидацией входных данных';
COMMENT ON FUNCTION public.increment_arm_alpha IS 'Инкремент успешных конверсий Thompson Sampling с валидацией';
COMMENT ON FUNCTION public.increment_arm_beta IS 'Инкремент неуспешных конверсий Thompson Sampling с валидацией';