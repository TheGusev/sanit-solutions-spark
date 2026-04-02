
-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Table for push notification subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Only admins can manage push subscriptions
CREATE POLICY "admins_manage_push_subscriptions" ON public.push_subscriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Allow service role full access (for edge functions)
CREATE POLICY "service_role_push_subscriptions" ON public.push_subscriptions
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Trigger function to notify on new lead
CREATE OR REPLACE FUNCTION public.notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://gimkzlozhwwgetlgtgvj.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on leads table
CREATE TRIGGER on_new_lead
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_lead();
