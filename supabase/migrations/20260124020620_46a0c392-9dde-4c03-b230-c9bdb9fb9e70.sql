-- ===============================================
-- Миграция: Создание public_reviews view без lead_id
-- Цель: Скрыть связь отзывов с лидами от публичного доступа
-- ===============================================

-- 1. Создаём представление без lead_id
CREATE OR REPLACE VIEW public.public_reviews 
WITH (security_invoker = on)
AS
SELECT 
  id,
  display_name,
  text,
  rating,
  object_type,
  created_at
FROM reviews
WHERE is_approved = true
ORDER BY created_at DESC;

-- 2. Даём права на чтение анонимным пользователям
GRANT SELECT ON public.public_reviews TO anon;
GRANT SELECT ON public.public_reviews TO authenticated;

-- 3. Комментарий
COMMENT ON VIEW public.public_reviews IS 
  'Публичные одобренные отзывы без lead_id для безопасности';