
import { createClient } from '@supabase/supabase-js';

// Estas URL y clave se agregan automáticamente cuando se activa la integración de Supabase en Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
