-- Add data classification and privacy controls to artisan_shops table
ALTER TABLE public.artisan_shops ADD COLUMN IF NOT EXISTS privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'limited', 'private'));
ALTER TABLE public.artisan_shops ADD COLUMN IF NOT EXISTS data_classification JSONB DEFAULT '{"contact": "sensitive", "strategies": "confidential", "analytics": "restricted"}';
ALTER TABLE public.artisan_shops ADD COLUMN IF NOT EXISTS public_profile JSONB;

-- Create function to generate safe public profile
CREATE OR REPLACE FUNCTION public.generate_public_profile(shop_record artisan_shops)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN jsonb_build_object(
    'shop_name', shop_record.shop_name,
    'craft_type', shop_record.craft_type,
    'description', shop_record.description,
    'banner_url', shop_record.banner_url,
    'rating', COALESCE((shop_record.contact_info->>'rating')::numeric, 0),
    'location', CASE 
      WHEN shop_record.privacy_level = 'public' THEN (shop_record.contact_info->>'city')
      ELSE 'Location Hidden'
    END,
    'contact_method', CASE 
      WHEN shop_record.privacy_level = 'public' THEN 'Available'
      ELSE 'Contact via platform'
    END
  );
END;
$$;

-- Trigger to auto-update public_profile when artisan_shops is modified
CREATE OR REPLACE FUNCTION public.update_public_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.public_profile = public.generate_public_profile(NEW);
  RETURN NEW;
END;
$$;

-- Create trigger for public profile updates
DROP TRIGGER IF EXISTS update_artisan_shops_public_profile ON public.artisan_shops;
CREATE TRIGGER update_artisan_shops_public_profile
  BEFORE INSERT OR UPDATE ON public.artisan_shops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_public_profile();

-- Update existing records to generate public profiles
UPDATE public.artisan_shops SET updated_at = updated_at;

-- Create audit log table for data access
CREATE TABLE IF NOT EXISTS public.data_access_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit table
ALTER TABLE public.data_access_audit ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit table
CREATE POLICY "Admins can view all audit logs"
ON public.data_access_audit
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND is_active = true
  )
);

CREATE POLICY "System can insert audit logs"
ON public.data_access_audit
FOR INSERT
WITH CHECK (true);