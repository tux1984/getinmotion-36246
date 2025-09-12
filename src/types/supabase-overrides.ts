// TypeScript overrides for overly strict Supabase generated types
import { supabase } from '@/integrations/supabase/client';

// Type-safe database query helpers
export const db = {
  // Select operations
  select: async (table: string, columns = '*', filters?: Record<string, any>) => {
    let query = (supabase as any).from(table).select(columns);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    return await query;
  },

  // Select single operation
  selectSingle: async (table: string, columns = '*', filters?: Record<string, any>) => {
    let query = (supabase as any).from(table).select(columns);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    return await query.maybeSingle();
  },

  // Insert operations
  insert: async (table: string, data: any) => {
    return await (supabase as any).from(table).insert(data).select().single();
  },

  // Update operations
  update: async (table: string, data: any, filters: Record<string, any>) => {
    let query = (supabase as any).from(table).update(data);
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    return await query.select().single();
  },

  // Upsert operations
  upsert: async (table: string, data: any, onConflict?: string) => {
    return await (supabase as any).from(table).upsert(data, onConflict ? { onConflict } : undefined);
  },

  // Function calls
  rpc: async (functionName: string, params?: any) => {
    return await (supabase as any).rpc(functionName, params);
  }
};

export { supabase };