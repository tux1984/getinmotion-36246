// Utility to clear all system cache for fresh start
export const clearSystemCache = () => {
  try {
    // Clear all Supabase related data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth') || key.includes('session')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear specific app cache keys
    localStorage.removeItem('maturity-scores-cache');
    localStorage.removeItem('user-data-cache');
    localStorage.removeItem('tasks-cache');
    localStorage.removeItem('coordinator-cache');
    
    console.log('✅ System cache cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing system cache:', error);
  }
};

// Clear only on specific events
export const clearOnSystemRepair = () => {
  clearSystemCache();
  // Force reload to ensure clean state
  window.location.reload();
};