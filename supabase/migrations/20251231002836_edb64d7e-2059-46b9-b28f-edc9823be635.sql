-- Создание таблицы reviews
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  display_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL CHECK (char_length(text) >= 10 AND char_length(text) <= 1000),
  object_type text,
  is_approved boolean DEFAULT false,
  is_rejected boolean DEFAULT false,
  approved_at timestamp with time zone,
  approved_by uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Включение RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Публичные могут добавлять отзывы
CREATE POLICY "Public can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (true);

-- Публичные видят ТОЛЬКО одобренные отзывы
CREATE POLICY "Public can read approved reviews"
  ON public.reviews FOR SELECT
  USING (is_approved = true);

-- Админы могут читать ВСЕ отзывы
CREATE POLICY "Admins can read all reviews"
  ON public.reviews FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Админы могут обновлять отзывы (модерация)
CREATE POLICY "Admins can update reviews"
  ON public.reviews FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Админы могут удалять отзывы
CREATE POLICY "Admins can delete reviews"
  ON public.reviews FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Добавление колонок для системы кодов отзывов в leads
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS review_code text,
  ADD COLUMN IF NOT EXISTS review_code_used boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS review_code_expires_at timestamp with time zone;

-- Уникальный индекс для быстрого поиска по коду
CREATE UNIQUE INDEX IF NOT EXISTS leads_review_code_idx 
  ON public.leads(review_code) WHERE review_code IS NOT NULL;

-- Админы могут обновлять заявки (статус, код отзыва)
CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));