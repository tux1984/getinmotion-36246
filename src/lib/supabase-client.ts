
import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a client with fallback for development
let supabaseClient;

// Only create the client if we have valid URL and key
if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized successfully');
} else {
  // Create a mock client for development
  console.warn('Supabase credentials not found! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  console.info('Running in development mode with mock Supabase client.');
  
  // Create a mock client that won't throw errors but will log operations
  supabaseClient = {
    from: (table) => ({
      insert: (data) => {
        console.log(`MOCK Supabase: Insert into ${table}`, data);
        return Promise.resolve({ data, error: null });
      },
      select: (columns) => {
        console.log(`MOCK Supabase: Select ${columns || '*'} from ${table}`);
        return {
          eq: (column, value) => {
            console.log(`MOCK Supabase: Where ${column} = ${value}`);
            return Promise.resolve({ data: [], error: null });
          },
          order: () => {
            return {
              limit: () => Promise.resolve({ data: [], error: null })
            };
          },
          limit: () => Promise.resolve({ data: [], error: null })
        };
      },
    }),
    auth: {
      signIn: (credentials) => {
        console.log('MOCK Supabase: Auth sign in', credentials);
        return Promise.resolve({ user: { email: 'demo@example.com' }, session: {}, error: null });
      },
    },
    functions: {
      invoke: (functionName, options = {}) => {
        console.log(`MOCK Supabase: Function ${functionName} invoked`, options);
        return Promise.resolve({ data: {}, error: null });
      },
    },
  };
}

export { supabaseClient };
