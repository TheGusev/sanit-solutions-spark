
-- Обновляем view public_reviews с полем created_at
CREATE OR REPLACE VIEW public_reviews AS
SELECT id, display_name, text, rating, object_type, created_at
FROM reviews 
WHERE is_approved = true
ORDER BY created_at DESC;
