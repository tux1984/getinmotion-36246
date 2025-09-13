// Utility to clear selective system cache
export const clearSystemCache = () => {
  try {
    // Clear specific app cache keys but preserve auth tokens
    localStorage.removeItem('maturity-scores-cache');
    localStorage.removeItem('user-data-cache');
    localStorage.removeItem('tasks-cache');
    localStorage.removeItem('coordinator-cache');
    
    console.log('✅ System cache cleared successfully (preserving auth)');
  } catch (error) {
    console.error('❌ Error clearing system cache:', error);
  }
};

// Clear all cache including auth (only for explicit logout)
export const clearAllCache = () => {
  try {
    // Clear all Supabase related data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('session')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear specific app cache keys
    clearSystemCache();
    
    console.log('✅ All cache cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing all cache:', error);
  }
};

// Clear only on specific events
export const clearOnSystemRepair = () => {
  clearSystemCache();
  // Force reload to ensure clean state
  window.location.reload();
};