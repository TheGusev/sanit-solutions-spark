-- Add is_test column to leads for test leads filtering
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_test boolean DEFAULT false;

-- Create index for filtering test leads
CREATE INDEX IF NOT EXISTS idx_leads_is_test ON leads(is_test);

-- Add is_active column to mvt_arm_params for enabling/disabling variants
ALTER TABLE mvt_arm_params ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create index for filtering active variants
CREATE INDEX IF NOT EXISTS idx_mvt_arm_params_is_active ON mvt_arm_params(is_active);