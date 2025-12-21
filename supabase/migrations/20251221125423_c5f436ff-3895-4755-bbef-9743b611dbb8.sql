-- Remove dangerous public INSERT/UPDATE policies on ab_test_stats
DROP POLICY IF EXISTS "Allow public stats update" ON ab_test_stats;
DROP POLICY IF EXISTS "Allow public stats modifications" ON ab_test_stats;

-- Add admin-only policies for INSERT and UPDATE (admin needs direct access for management)
CREATE POLICY "Only admins can insert ab_test_stats"
  ON ab_test_stats FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update ab_test_stats"
  ON ab_test_stats FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));