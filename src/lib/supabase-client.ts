
import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a client with fallback for development
let supabaseClient;

// Only create the client if we have valid URL and key
if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized successfully with URL:', supabaseUrl);
} else {
  // Create a mock client for development
  console.warn('⚠️ Supabase credentials not found! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  console.info('✅ Running in development mode with mock Supabase client.');
  
  // Check which environment variables are missing
  if (!supabaseUrl) {
    console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  }
  if (!supabaseAnonKey) {
    console.error('❌ Missing VITE_SUPABASE_ANON_KEY environment variable');
  }
  
  // Mock data for testing
  const mockWaitlist = [];
  
  // Create a more robust mock client that won't throw errors
  supabaseClient = {
    from: (table) => ({
      insert: (data) => {
        console.log(`MOCK Supabase: Insert into ${table}`, data);
        
        // For waitlist table, we'll store the data in our mock array
        if (table === 'waitlist') {
          try {
            // Add each record to our mock array
            const records = Array.isArray(data) ? data : [data];
            records.forEach(record => {
              const mockRecord = { ...record, id: Date.now() };
              mockWaitlist.push(mockRecord);
            });
            console.log('MOCK Waitlist data:', mockWaitlist);
            return Promise.resolve({ data: mockWaitlist, error: null });
          } catch (e) {
            console.error('MOCK Supabase: Error in insert operation', e);
            return Promise.resolve({ 
              data: null, 
              error: { message: 'Error inserting data', details: e.message }
            });
          }
        }
        
        return Promise.resolve({ data, error: null });
      },
      select: (columns) => {
        console.log(`MOCK Supabase: Select ${columns || '*'} from ${table}`);
        
        // For waitlist table, return our mock array
        if (table === 'waitlist') {
          return {
            eq: (column, value) => {
              console.log(`MOCK Supabase: Where ${column} = ${value}`);
              const filteredData = mockWaitlist.filter(item => item[column] === value);
              return Promise.resolve({ data: filteredData, error: null });
            },
            order: (column, { ascending } = { ascending: true }) => {
              console.log(`MOCK Supabase: Order by ${column}`);
              return {
                limit: (num) => {
                  console.log(`MOCK Supabase: Limit ${num}`);
                  return Promise.resolve({ data: mockWaitlist.slice(0, num), error: null });
                }
              };
            },
            limit: (num) => {
              console.log(`MOCK Supabase: Limit ${num}`);
              return Promise.resolve({ data: mockWaitlist.slice(0, num), error: null });
            },
            then: (callback) => {
              return Promise.resolve({ data: mockWaitlist, error: null }).then(callback);
            }
          };
        }
        
        return {
          eq: (column, value) => {
            console.log(`MOCK Supabase: Where ${column} = ${value}`);
            return Promise.resolve({ data: [], error: null });
          },
          order: (column, { ascending } = { ascending: true }) => {
            console.log(`MOCK Supabase: Order by ${column}`);
            return {
              limit: (num) => Promise.resolve({ data: [], error: null })
            };
          },
          limit: (num) => Promise.resolve({ data: [], error: null })
        };
      },
      delete: () => {
        return {
          eq: (column, value) => {
            console.log(`MOCK Supabase: Delete from ${table} where ${column} = ${value}`);
            if (table === 'waitlist') {
              const indexToDelete = mockWaitlist.findIndex(item => item[column] === value);
              if (indexToDelete !== -1) {
                mockWaitlist.splice(indexToDelete, 1);
              }
            }
            return Promise.resolve({ data: null, error: null });
          }
        };
      }
    }),
    auth: {
      signIn: (credentials) => {
        console.log('MOCK Supabase: Auth sign in', credentials);
        return Promise.resolve({ user: { email: 'demo@example.com' }, session: {}, error: null });
      },
      signOut: () => {
        console.log('MOCK Supabase: Auth sign out');
        return Promise.resolve({ error: null });
      }
    },
    functions: {
      invoke: (functionName, options = {}) => {
        console.log(`MOCK Supabase: Function ${functionName} invoked`, options);
        return Promise.resolve({ data: {}, error: null });
      },
    },
  };
}

// Export a function to check connection status
export const checkSupabaseConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { 
      connected: false, 
      message: 'Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.',
      missing: {
        url: !supabaseUrl,
        key: !supabaseAnonKey
      }
    };
  }
  
  try {
    // Try to make a simple request to test the connection
    const { error } = await supabaseClient.from('waitlist').select('count', { count: 'exact', head: true });
    
    if (error) {
      return { 
        connected: false, 
        message: `Connection error: ${error.message}`,
        error
      };
    }
    
    return { 
      connected: true, 
      message: 'Successfully connected to Supabase' 
    };
  } catch (e) {
    return { 
      connected: false, 
      message: `Connection error: ${e.message}`,
      error: e
    };
  }
};

export { supabaseClient };
