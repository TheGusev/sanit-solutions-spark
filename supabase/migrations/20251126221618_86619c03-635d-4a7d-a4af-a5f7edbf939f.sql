-- Обновление конфигурации MVT теста для включения вариантов E и F
UPDATE mvt_test_config 
SET variants = '["A", "B", "C", "D", "E", "F"]'::jsonb,
    updated_at = now()
WHERE test_name = 'main_variant';

-- Обновление mvt_nodes для включения E и F вариантов
UPDATE mvt_nodes 
SET variants = '["A", "B", "C", "D", "E", "F"]'::jsonb,
    updated_at = now()
WHERE node_name IN ('hero', 'calc_offer', 'popup_text');

-- Добавление начальных параметров Thompson Sampling для E и F вариантов
-- Используем Beta(1,1) как uninformative prior для новых arms
INSERT INTO mvt_arm_params (test_name, intent, variant_key, alpha, beta, impressions_count, conversions_count, revenue_sum)
SELECT 
  'main_variant' as test_name,
  intent,
  variant_key,
  1 as alpha,
  1 as beta,
  0 as impressions_count,
  0 as conversions_count,
  0 as revenue_sum
FROM (
  SELECT DISTINCT intent FROM mvt_arm_params WHERE test_name = 'main_variant'
) intents
CROSS JOIN (VALUES ('E'), ('F')) AS v(variant_key)
ON CONFLICT (test_name, intent, variant_key) DO NOTHING;