-- Recreate public_reviews view WITHOUT security_definer
-- This ensures RLS policies of the querying user are respected

DROP VIEW IF EXISTS public.public_reviews;

CREATE VIEW public.public_reviews
WITH (security_invoker = true)
AS
SELECT 
  id,
  display_name,
  text,
  rating,
  object_type,
  created_at
FROM public.reviews
WHERE is_approved = true
ORDER BY created_at DESC;

COMMENT ON VIEW public.public_reviews IS 'Публичные одобренные отзывы без lead_id для безопасности';

-- Grant select to anon and authenticated roles
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;