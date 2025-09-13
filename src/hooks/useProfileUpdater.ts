import { useState, useCallback } from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { safeSupabase } from '@/utils/supabase-safe';
import { useToast } from '@/hooks/use-toast';

export const useProfileUpdater = () => {
  const { user } = useRobustAuth();
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const updateProfileToTriMedias = useCallback(async () => {
    if (!user) {
      console.warn('No authenticated user found');
      return false;
    }

    try {
      setUpdating(true);
      console.log('🔄 Updating profile to TriMedias...');

      // Clear all cached data first
      localStorage.removeItem('coordinatorTasks');
      localStorage.removeItem('userBusinessProfile');
      localStorage.removeItem('cachedRecommendations');
      localStorage.removeItem('profileData');
      localStorage.removeItem('maturityScores');
      console.log('🧹 Cleared all cached data');

      // Update user_profiles table
      const { error: profileError } = await safeSupabase
        .from('user_profiles')
        .update({
          brand_name: 'TriMedias',
          business_description: 'Empresa especializada en producción de medias de alta calidad',
          business_type: 'manufacturing',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw profileError;
      }

      // Update user_master_context table
      const { error: contextError } = await safeSupabase
        .from('user_master_context')
        .upsert({
          user_id: user.id,
          business_profile: {
            brandName: 'TriMedias',
            businessDescription: 'Empresa especializada en producción de medias de alta calidad',
            businessType: 'manufacturing',
            lastUpdated: new Date().toISOString()
          },
          last_assessment_date: new Date().toISOString(),
          context_version: 1
        }, {
          onConflict: 'user_id'
        });

      if (contextError) {
        console.error('Error updating user context:', contextError);
        throw contextError;
      }

      // Force refresh of maturity scores
      try {
        const { refreshMaturityScores } = await import('@/hooks/useOptimizedMaturityScores');
        refreshMaturityScores();
        console.log('🔄 Triggered maturity scores refresh');
      } catch (err) {
        console.warn('Could not trigger refresh:', err);
      }

      console.log('✅ Profile successfully updated to TriMedias');
      
      toast({
        title: 'Perfil Actualizado',
        description: 'Tu perfil ha sido actualizado correctamente a TriMedias',
      });

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setUpdating(false);
    }
  }, [user, toast]);

  return {
    updateProfileToTriMedias,
    updating
  };
};