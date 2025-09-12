import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ylooqmqmoufqtxvetxuj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsb29xbXFtb3VmcXR4dmV0eHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Nzc1ODIsImV4cCI6MjA2MzI1MzU4Mn0.F_FtGBwpHKBpog6Ad4zUjmogRZMLNVgk18rsbMv7JYs";

// Robust Supabase client with JWT corruption detection and recovery
export const robustSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Prevent URL-based corruption
    storageKey: 'supabase.auth.robust.token',
    flowType: 'pkce',
    debug: false // Disable for production
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-robust'
    }
  }
});

// JWT Verification and Recovery System
class JWTManager {
  private isRecovering = false;
  private maxRetries = 3;
  private retryCount = 0;

  async verifyJWTIntegrity(): Promise<boolean> {
    try {
      console.log('🔍 Verificando integridad del JWT...');
      
      // Test server-side authentication with a simple RPC
      const { data, error } = await robustSupabase.rpc('is_admin');
      
      if (error) {
        console.error('❌ JWT verification failed:', error.message);
        return false;
      }
      
      console.log('✅ JWT verificado correctamente');
      this.retryCount = 0; // Reset retry count on success
      return true;
    } catch (error) {
      console.error('❌ JWT verification error:', error);
      return false;
    }
  }

  async forceJWTRegeneration(): Promise<boolean> {
    if (this.isRecovering) {
      console.log('⏳ JWT recovery already in progress...');
      return false;
    }

    this.isRecovering = true;
    this.retryCount++;

    try {
      console.log(`🔄 Iniciando regeneración JWT (intento ${this.retryCount}/${this.maxRetries})...`);
      
      // Step 1: Complete logout to clear corrupted tokens
      await robustSupabase.auth.signOut();
      
      // Step 2: Clear all auth-related storage
      ['supabase.auth.token', 'supabase.auth.robust.token'].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Step 3: Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 4: Force session refresh
      const { data, error } = await robustSupabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ JWT regeneration failed:', error);
        throw error;
      }
      
      // Step 5: Verify the new JWT works
      await new Promise(resolve => setTimeout(resolve, 500));
      const isValid = await this.verifyJWTIntegrity();
      
      if (isValid) {
        console.log('✅ JWT regenerado exitosamente');
        return true;
      } else {
        throw new Error('JWT regenerated but still invalid');
      }
      
    } catch (error) {
      console.error('❌ JWT regeneration error:', error);
      
      if (this.retryCount < this.maxRetries) {
        console.log(`🔄 Reintentando regeneración JWT en 2 segundos...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.forceJWTRegeneration();
      } else {
        console.error('❌ JWT regeneration failed after maximum retries');
        this.forceCompleteReset();
        return false;
      }
    } finally {
      this.isRecovering = false;
    }
  }

  private forceCompleteReset(): void {
    console.log('🔄 Forcing complete authentication reset...');
    
    // Clear everything
    localStorage.clear();
    sessionStorage.clear();
    
    // Force reload to start fresh
    window.location.href = '/login?reset=true';
  }

  async autoRecoverJWT(): Promise<boolean> {
    const isValid = await this.verifyJWTIntegrity();
    
    if (!isValid) {
      console.log('🔧 JWT corruption detected, attempting auto-recovery...');
      return await this.forceJWTRegeneration();
    }
    
    return true;
  }
}

export const jwtManager = new JWTManager();

// Enhanced query wrapper with JWT verification
export const robustQuery = async (operation: () => Promise<any>) => {
  try {
    const result = await operation();
    
    // Check if the error indicates JWT issues
    if (result.error && (
      result.error.message?.includes('JWT') ||
      result.error.message?.includes('authentication') ||
      result.error.message?.includes('unauthorized')
    )) {
      console.log('🔧 JWT error detected, attempting recovery...');
      const recovered = await jwtManager.autoRecoverJWT();
      
      if (recovered) {
        // Retry the operation after recovery
        return await operation();
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ Robust query error:', error);
    throw error;
  }
};