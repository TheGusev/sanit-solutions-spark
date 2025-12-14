-- Удаляем публичные политики (уязвимость!)
DROP POLICY IF EXISTS "Allow public to insert mvt_arm_params" ON public.mvt_arm_params;
DROP POLICY IF EXISTS "Allow public to read mvt_arm_params" ON public.mvt_arm_params;
DROP POLICY IF EXISTS "Allow public to update mvt_arm_params" ON public.mvt_arm_params;

-- Добавляем политику только для администраторов
CREATE POLICY "Only admins can manage mvt_arm_params" 
ON public.mvt_arm_params
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));