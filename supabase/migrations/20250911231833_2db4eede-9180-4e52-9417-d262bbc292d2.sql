-- Fix the is_admin() function to correctly check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    ) 
    AND is_active = true
  );
$$;