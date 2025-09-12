import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { detectArtisanProfile, detectCraftType } from '@/utils/artisanDetection';
import { CraftType } from '@/types/artisan';

export const useArtisanDetection = () => {
  const [isArtisan, setIsArtisan] = useState<boolean | null>(null);
  const [craftType, setCraftType] = useState<CraftType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkArtisanStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user already has an artisan shop
        const { data: shopData } = await supabase
          .from('artisan_shops')
          .select('craft_type')
          .eq('user_id', user.id as any)
          .single();

        if (shopData) {
          setIsArtisan(true);
          setCraftType((shopData as any).craft_type as CraftType);
          setLoading(false);
          return;
        }

        // Check user profile and master context for artisan indicators
        const [profileResult, contextResult] = await Promise.all([
          supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id as any)
            .single(),
          supabase
            .from('user_master_context')
            .select('*')
            .eq('user_id', user.id as any)
            .single()
        ]);

        const profileData = profileResult.data as any;
        const contextData = contextResult.data as any;

        // Combine all user data for detection
        const combinedData = {
          ...(profileData || {}),
          ...(typeof contextData?.business_profile === 'object' ? contextData.business_profile : {}),
          ...(typeof contextData?.business_context === 'object' ? contextData.business_context : {}),
          specificAnswers: {
            ...(typeof contextData?.business_profile === 'object' ? contextData.business_profile : {}),
            ...(typeof contextData?.task_generation_context === 'object' ? contextData.task_generation_context : {})
          }
        };

        const detectedIsArtisan = detectArtisanProfile(combinedData);
        const detectedCraftType = detectCraftType(combinedData);

        setIsArtisan(detectedIsArtisan);
        setCraftType(detectedCraftType);

      } catch (error) {
        console.error('Error checking artisan status:', error);
        setIsArtisan(false);
        setCraftType(null);
      } finally {
        setLoading(false);
      }
    };

    checkArtisanStatus();
  }, [user]);

  return {
    isArtisan,
    craftType,
    loading,
    refreshDetection: () => {
      setLoading(true);
      // Re-trigger the effect
      setIsArtisan(null);
    }
  };
};