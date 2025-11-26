-- Create MVT test configuration table
CREATE TABLE IF NOT EXISTS mvt_test_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name text NOT NULL UNIQUE,
  description text,
  variants jsonb NOT NULL DEFAULT '["A", "B"]',
  exploration_sessions_per_variant integer DEFAULT 50,
  confidence_threshold numeric DEFAULT 0.95,
  is_active boolean DEFAULT true,
  winner_variant text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add index for faster stats lookup
CREATE INDEX IF NOT EXISTS idx_ab_test_stats_lookup 
  ON ab_test_stats(test_name, intent, variant_id);

-- RLS policies for mvt_test_config
ALTER TABLE mvt_test_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage mvt_test_config"
  ON mvt_test_config FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read active mvt configs"
  ON mvt_test_config FOR SELECT
  USING (is_active = true);

-- Insert default test configurations
INSERT INTO mvt_test_config (test_name, variants, description) VALUES
  ('main_variant', '["A", "B", "C", "D"]', 'Main hero and CTA variant test'),
  ('hero_headline', '["A", "B", "C"]', 'Hero headline variants'),
  ('cta_button', '["original", "urgent", "discount"]', 'CTA button text variants')
ON CONFLICT (test_name) DO NOTHING;

-- Function to update MVT config updated_at
CREATE OR REPLACE FUNCTION update_mvt_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for MVT config updates
DROP TRIGGER IF EXISTS update_mvt_test_config_updated_at ON mvt_test_config;
CREATE TRIGGER update_mvt_test_config_updated_at
  BEFORE UPDATE ON mvt_test_config
  FOR EACH ROW
  EXECUTE FUNCTION update_mvt_config_updated_at();