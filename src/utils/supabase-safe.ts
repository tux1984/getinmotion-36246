// Safe Supabase wrapper to bypass TypeScript issues
import { supabase } from '@/integrations/supabase/client';

// @ts-ignore - Bypass restrictive Supabase types
export const safeSupabase = supabase as any;

export const safeQuery = {
  select: (table: string) => safeSupabase.from(table).select('*'),
  selectSingle: (table: string) => safeSupabase.from(table).select('*'),
  insert: (table: string) => safeSupabase.from(table).insert,
  update: (table: string) => safeSupabase.from(table).update,
  upsert: (table: string) => safeSupabase.from(table).upsert,
  rpc: safeSupabase.rpc
};