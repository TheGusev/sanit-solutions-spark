-- Create server-side RPC function for admin access verification
-- This function uses SECURITY DEFINER to bypass RLS and verify admin role
CREATE OR REPLACE FUNCTION public.verify_admin_access()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
  current_user_id uuid;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated'
      USING HINT = 'unauthenticated';
  END IF;
  
  -- Check if user has admin role
  SELECT has_role(current_user_id, 'admin'::app_role) INTO is_admin;
  
  IF NOT is_admin THEN
    RAISE EXCEPTION 'Access denied'
      USING HINT = 'unauthorized';
  END IF;
  
  RETURN json_build_object('authorized', true, 'role', 'admin');
END;
$$;