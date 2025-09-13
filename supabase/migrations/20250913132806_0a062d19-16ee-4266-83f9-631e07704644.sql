-- Corregir email superadmin: reemplazar con mduque49@gmail.com
DELETE FROM admin_users WHERE email = 'rodolforodolf17@gmail.com';

-- Agregar mduque49@gmail.com como único superadmin
INSERT INTO admin_users (email, is_active, created_by) 
VALUES ('mduque49@gmail.com', true, null)
ON CONFLICT (email) DO UPDATE SET 
  is_active = true,
  updated_at = now();