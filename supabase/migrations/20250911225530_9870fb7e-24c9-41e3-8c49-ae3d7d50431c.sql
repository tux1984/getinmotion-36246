-- Add mduque49@gmail.com to admin_users table
INSERT INTO public.admin_users (email, is_active, created_by)
VALUES ('mduque49@gmail.com', true, null)
ON CONFLICT (email) DO UPDATE SET is_active = true;