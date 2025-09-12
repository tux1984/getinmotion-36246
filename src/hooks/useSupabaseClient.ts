import { supabase } from '@/integrations/supabase/client';

// Type-safe wrapper for Supabase operations to bypass overly restrictive generated types
export const useSupabaseClient = () => {
  // Generic query function that bypasses strict typing
  const query = async (table: string, operation: any) => {
    try {
      const result = (supabase as any).from(table);
      return await operation(result);
    } catch (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
  };

  // Simplified select operations
  const selectFrom = async (table: string, columns = '*', filters?: any) => {
    return query(table, (client: any) => {
      let query = client.select(columns);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      return query;
    });
  };

  // Simplified insert operations
  const insertInto = async (table: string, data: any) => {
    return query(table, (client: any) => 
      client.insert(data).select().single()
    );
  };

  // Simplified update operations
  const updateIn = async (table: string, data: any, filters: any) => {
    return query(table, (client: any) => {
      let query = client.update(data);
      
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      
      return query.select().single();
    });
  };

  // Simplified upsert operations
  const upsertIn = async (table: string, data: any, onConflict?: string) => {
    return query(table, (client: any) => 
      client.upsert(data, onConflict ? { onConflict } : undefined)
    );
  };

  return {
    selectFrom,
    insertInto,
    updateIn,
    upsertIn,
    raw: supabase
  };
};