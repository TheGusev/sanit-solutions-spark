-- Advanced MVT System with explicit α,β parameters and impression tracking

-- 1. Table: mvt_arm_params - stores α,β parameters for each arm
CREATE TABLE IF NOT EXISTS mvt_arm_params (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name text NOT NULL,
  intent text NOT NULL DEFAULT 'default',
  variant_key text NOT NULL,
  alpha numeric NOT NULL DEFAULT 1,
  beta numeric NOT NULL DEFAULT 1,
  impressions_count integer DEFAULT 0,
  conversions_count integer DEFAULT 0,
  revenue_sum numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT mvt_arm_params_unique UNIQUE(test_name, intent, variant_key)
);

CREATE INDEX idx_mvt_arm_params_lookup ON mvt_arm_params(test_name, intent, variant_key);
CREATE INDEX idx_mvt_arm_params_test ON mvt_arm_params(test_name);

-- 2. Table: mvt_impressions - logs every variant impression
CREATE TABLE IF NOT EXISTS mvt_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  test_name text NOT NULL,
  intent text,
  variant_key text NOT NULL,
  device_type text,
  utm_source text,
  sampled_theta numeric,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mvt_impressions_session ON mvt_impressions(session_id, created_at DESC);
CREATE INDEX idx_mvt_impressions_lookup ON mvt_impressions(test_name, intent, variant_key);

-- 3. Table: mvt_nodes - configuration for multi-node testing
CREATE TABLE IF NOT EXISTS mvt_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_name text NOT NULL UNIQUE,
  variants jsonb NOT NULL DEFAULT '["A", "B"]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Add impression linking to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS mvt_impression_id uuid REFERENCES mvt_impressions(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS mvt_arm_key text;

-- 5. RPC: increment_arm_impressions
CREATE OR REPLACE FUNCTION increment_arm_impressions(
  p_test_name text,
  p_intent text,
  p_variant_key text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO mvt_arm_params (test_name, intent, variant_key, impressions_count, alpha, beta)
  VALUES (p_test_name, p_intent, p_variant_key, 1, 1, 1)
  ON CONFLICT (test_name, intent, variant_key)
  DO UPDATE SET
    impressions_count = mvt_arm_params.impressions_count + 1,
    updated_at = now();
END;
$$;

-- 6. RPC: increment_arm_alpha
CREATE OR REPLACE FUNCTION increment_arm_alpha(
  p_test_name text,
  p_intent text,
  p_variant_key text,
  p_revenue numeric DEFAULT 0
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

-- 7. RPC: increment_arm_beta
CREATE OR REPLACE FUNCTION increment_arm_beta(
  p_test_name text,
  p_intent text,
  p_variant_key text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO mvt_arm_params (test_name, intent, variant_key, alpha, beta)
  VALUES (p_test_name, p_intent, p_variant_key, 1, 2)
  ON CONFLICT (test_name, intent, variant_key)
  DO UPDATE SET
    beta = mvt_arm_params.beta + 1,
    updated_at = now();
END;
$$;

-- 8. Trigger: update mvt_arm_params updated_at
CREATE OR REPLACE FUNCTION update_mvt_arm_params_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_mvt_arm_params_timestamp
  BEFORE UPDATE ON mvt_arm_params
  FOR EACH ROW
  EXECUTE FUNCTION update_mvt_arm_params_updated_at();

-- 9. RLS Policies for mvt_arm_params
ALTER TABLE mvt_arm_params ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to read mvt_arm_params"
  ON mvt_arm_params FOR SELECT
  USING (true);

CREATE POLICY "Allow public to insert mvt_arm_params"
  ON mvt_arm_params FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to update mvt_arm_params"
  ON mvt_arm_params FOR UPDATE
  USING (true);

-- 10. RLS Policies for mvt_impressions
ALTER TABLE mvt_impressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert mvt_impressions"
  ON mvt_impressions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can read mvt_impressions"
  ON mvt_impressions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 11. RLS Policies for mvt_nodes
ALTER TABLE mvt_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active mvt_nodes"
  ON mvt_nodes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage mvt_nodes"
  ON mvt_nodes FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 12. Insert default MVT nodes
INSERT INTO mvt_nodes (node_name, variants) VALUES
  ('hero', '["A", "B", "C", "D"]'),
  ('calc_offer', '["standard", "discount", "urgent"]'),
  ('popup_text', '["soft", "hard", "personal"]')
ON CONFLICT (node_name) DO NOTHING;

-- 13. Migrate existing ab_test_stats to mvt_arm_params
INSERT INTO mvt_arm_params (test_name, intent, variant_key, alpha, beta, impressions_count, conversions_count, revenue_sum)
SELECT 
  test_name,
  intent,
  variant_id as variant_key,
  COALESCE(conversions_count, 0) + 1 as alpha,
  COALESCE(sessions_count, 0) - COALESCE(conversions_count, 0) + 1 as beta,
  COALESCE(sessions_count, 0) as impressions_count,
  COALESCE(conversions_count, 0) as conversions_count,
  COALESCE(revenue_sum, 0) as revenue_sum
FROM ab_test_stats
ON CONFLICT (test_name, intent, variant_key) DO NOTHING;