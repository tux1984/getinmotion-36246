import { useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useProfileSync = () => {
  const { user } = useAuth();

  const syncProfileData = useCallback(async () => {
    if (!user) return;

    try {
      // Get localStorage data
      const maturityData = localStorage.getItem('fused_maturity_calculator_progress');
      const conversationalData = localStorage.getItem('enhanced_conversational_agent_progress');
      
      let profileData = {};
      if (maturityData) {
        const parsed = JSON.parse(maturityData);
        profileData = parsed.profileData || {};
      } else if (conversationalData) {
        const parsed = JSON.parse(conversationalData);
        profileData = parsed.profileData || {};
      }

      // Extract brand name and business description intelligently
      const brandName = 
        (profileData as any)?.brandName || 
        (profileData as any)?.businessName ||
        (profileData as any)?.companyName ||
        null;

      const businessDescription = 
        (profileData as any)?.businessDescription ||
        (profileData as any)?.description ||
        (profileData as any)?.whatDoes ||
        null;

      // Only update if we have meaningful data
      if (brandName || businessDescription) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            brand_name: brandName,
            business_description: businessDescription,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error('Error syncing profile:', error);
        } else {
          console.log('✅ Profile synced successfully:', { brandName, businessDescription });
        }
      }
    } catch (error) {
      console.error('Error in syncProfileData:', error);
    }
  }, [user]);

  // Auto-sync when component mounts or data changes
  useEffect(() => {
    syncProfileData();
  }, [syncProfileData]);

  return { syncProfileData };
};