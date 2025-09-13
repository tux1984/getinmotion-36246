import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatTaskTitleForDisplay } from './utils/agentTaskUtils';

/**
 * Hook to automatically clean up task titles with JSON arrays
 * This runs automatically when the user logs in and has a valid brand name
 */
export const useTaskTitleCleanup = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const cleanupTaskTitles = async () => {
      try {
        // Get user profile to check for brand name
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('brand_name, business_description')
          .eq('user_id', user.id)
          .single();

        if (!profile?.brand_name) return; // Skip if no brand name

        // Get all tasks that might need cleaning
        const { data: tasks } = await supabase
          .from('agent_tasks')
          .select('id, title')
          .eq('user_id', user.id);

        if (!tasks) return;

        // Filter tasks that need cleaning (contain arrays or are too long)
        const tasksToClean = tasks.filter(task => 
          task.title && (
            task.title.includes('[') || 
            task.title.includes('"') ||
            task.title.includes('goal') ||
            task.title.length > 100
          )
        );

        if (tasksToClean.length === 0) return;

        console.log(`🧹 Cleaning up ${tasksToClean.length} task titles`);

        // Clean each task title
        for (const task of tasksToClean) {
          const cleanedTitle = formatTaskTitleForDisplay(task.title, profile.brand_name);
          
          if (cleanedTitle !== task.title) {
            await supabase
              .from('agent_tasks')
              .update({ 
                title: cleanedTitle,
                updated_at: new Date().toISOString()
              })
              .eq('id', task.id);

            console.log('✅ Cleaned task title:', task.title, '→', cleanedTitle);
          }
        }
      } catch (error) {
        console.error('❌ Error cleaning task titles:', error);
      }
    };

    // Run cleanup after a short delay to ensure profile is synced
    const timer = setTimeout(cleanupTaskTitles, 2000);
    
    return () => clearTimeout(timer);
  }, [user]);
};