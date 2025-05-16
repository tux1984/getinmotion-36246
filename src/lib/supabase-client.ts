
import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a client with fallback for development
let supabaseClient;

// Only create the client if we have valid URL and key
if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock client or provide helpful message
  console.warn('Supabase credentials not found! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  
  // Create a mock client that won't throw errors but will log operations
  supabaseClient = {
    from: () => ({
      insert: () => {
        console.log('Supabase insert operation attempted but client not configured');
        return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
      },
      select: () => {
        console.log('Supabase select operation attempted but client not configured');
        return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
      },
    }),
    auth: {
      signIn: () => {
        console.log('Supabase auth operation attempted but client not configured');
        return Promise.resolve({ user: null, session: null, error: { message: 'Supabase not configured' } });
      },
    },
    functions: {
      invoke: (functionName: string, options = {}) => {
        console.log(`Supabase function ${functionName} invoked but client not configured`);
        return Promise.resolve({ data: null, error: { message: 'Supabase not configured' } });
      },
    },
  };
}

export { supabaseClient };
