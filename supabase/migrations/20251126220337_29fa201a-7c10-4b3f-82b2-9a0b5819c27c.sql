-- Update MVT test configuration to include C and D variants
UPDATE mvt_test_config 
SET variants = '["A", "B", "C", "D"]'::jsonb,
    description = 'Main hero variant test with 4 variants (A, B, C, D) for Thompson Sampling optimization'
WHERE test_name = 'main_variant';

-- Add C and D variant parameters for all existing intents in mvt_arm_params
INSERT INTO mvt_arm_params (test_name, intent, variant_key, alpha, beta, impressions_count, conversions_count, revenue_sum)
SELECT 
  test_name,
  intent,
  'C' as variant_key,
  1 as alpha,
  1 as beta,
  0 as impressions_count,
  0 as conversions_count,
  0 as revenue_sum
FROM mvt_arm_params
WHERE variant_key = 'A'
ON CONFLICT (test_name, intent, variant_key) DO NOTHING;

INSERT INTO mvt_arm_params (test_name, intent, variant_key, alpha, beta, impressions_count, conversions_count, revenue_sum)
SELECT 
  test_name,
  intent,
  'D' as variant_key,
  1 as alpha,
  1 as beta,
  0 as impressions_count,
  0 as conversions_count,
  0 as revenue_sum
FROM mvt_arm_params
WHERE variant_key = 'A'
ON CONFLICT (test_name, intent, variant_key) DO NOTHING;