import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRobustAuth } from '@/hooks/useRobustAuth';

export const useUserProfileCreation = () => {
  const { user, session } = useRobustAuth();

  const ensureUserProfile = useCallback(async () => {
    if (!user?.id || !session?.access_token) {
      console.log('🚫 Profile creation: No valid session');
      return;
    }

    try {
      console.log('🔍 Checking user profile for:', user.id);
      
      // First, check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Error checking user profile:', checkError);
        return;
      }

      if (existingProfile) {
        console.log('✅ User profile already exists');
        return;
      }

      console.log('📝 Creating user profile...');
      
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          full_name: user.email?.split('@')[0] || 'Usuario',
          language_preference: 'es'
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating user profile:', createError);
        return;
      }

      console.log('✅ User profile created successfully:', newProfile.id);
    } catch (error) {
      console.error('❌ Unexpected error in profile creation:', error);
    }
  }, [user?.id, session?.access_token, user?.email]);

  // Auto-create profile when user authenticates
  useEffect(() => {
    if (user?.id && session?.access_token) {
      // Small delay to allow auth state to fully settle
      const timeoutId = setTimeout(ensureUserProfile, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [user?.id, session?.access_token, ensureUserProfile]);

  return {
    ensureUserProfile
  };
};