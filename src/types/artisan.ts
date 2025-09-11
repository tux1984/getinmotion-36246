// Artisan-specific types for the e-commerce module

export interface ArtisanShop {
  id: string;
  user_id: string;
  shop_name: string;
  shop_slug: string;
  description?: string;
  story?: string;
  logo_url?: string;
  banner_url?: string;
  craft_type?: string;
  region?: string;
  certifications: any; // JSON field
  contact_info: any; // JSON field
  social_links: any; // JSON field
  active: boolean;
  featured: boolean;
  seo_data: any; // JSON field
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  images: any; // JSON field
  category?: string;
  subcategory?: string;
  tags: any; // JSON field
  inventory: number;
  sku?: string;
  weight?: number;
  dimensions?: any; // JSON field
  materials: any; // JSON field
  techniques: any; // JSON field
  production_time?: string;
  customizable: boolean;
  active: boolean;
  featured: boolean;
  seo_data: any; // JSON field
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  shop_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: Address;
  billing_address?: Address;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  currency: string;
  payment_method?: string;
  payment_status: PaymentStatus;
  payment_id?: string;
  fulfillment_status: FulfillmentStatus;
  tracking_number?: string;
  notes?: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  total: number;
  customizations?: Record<string, any>;
}

export interface ArtisanAnalytics {
  id: string;
  shop_id: string;
  date: string;
  views: number;
  visitors: number;
  orders: number;
  revenue: number;
  products_added: number;
  created_at: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  website?: string;
}

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  og_image?: string;
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
  unit?: 'cm' | 'in';
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled' | 'shipped';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type CraftType = 
  | 'textiles' 
  | 'ceramics' 
  | 'jewelry' 
  | 'woodwork' 
  | 'leather' 
  | 'basketry' 
  | 'metalwork' 
  | 'glasswork' 
  | 'painting' 
  | 'sculpture' 
  | 'other';

export type Region = 
  | 'amazonas' 
  | 'antioquia' 
  | 'arauca' 
  | 'atlantico' 
  | 'bolivar' 
  | 'boyaca' 
  | 'caldas' 
  | 'caqueta' 
  | 'casanare' 
  | 'cauca' 
  | 'cesar' 
  | 'choco' 
  | 'cordoba' 
  | 'cundinamarca' 
  | 'guainia' 
  | 'guaviare' 
  | 'huila' 
  | 'la_guajira' 
  | 'magdalena' 
  | 'meta' 
  | 'narino' 
  | 'norte_santander' 
  | 'putumayo' 
  | 'quindio' 
  | 'risaralda' 
  | 'san_andres' 
  | 'santander' 
  | 'sucre' 
  | 'tolima' 
  | 'valle_del_cauca' 
  | 'vaupes' 
  | 'vichada' 
  | 'bogota';

// Extended creator profiles for artisans
export type ExtendedCreatorProfile = 
  | 'musician' 
  | 'visual-artist' 
  | 'textile-artisan' 
  | 'indigenous-artisan'
  | 'ceramic-artisan'
  | 'jewelry-artisan'
  | 'woodwork-artisan'
  | 'leather-artisan'
  | 'basketry-artisan'
  | 'metalwork-artisan';

// Artisan-specific onboarding data
export interface ArtisanProfile {
  craft_type: CraftType;
  region: Region;
  years_of_experience: number;
  has_workshop: boolean;
  sells_online: boolean;
  export_experience: boolean;
  certifications: string[];
  specialties: string[];
  production_capacity: 'low' | 'medium' | 'high';
  target_market: 'local' | 'national' | 'international' | 'all';
}