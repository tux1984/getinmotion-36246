import { useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Generate intelligent brand name from business description
const generateIntelligentBrandName = (businessDescription?: string): string => {
  if (!businessDescription) return 'Tu Emprendimiento';
  
  const desc = businessDescription.toLowerCase();
  
  // Music industry patterns
  if (desc.includes('música') || desc.includes('musical') || desc.includes('artista') || desc.includes('canciones')) {
    return 'Tu Sello Musical';
  }
  if (desc.includes('producción musical') || desc.includes('productor')) {
    return 'Tu Productora Musical';
  }
  
  // Creative industries
  if (desc.includes('artesanía') || desc.includes('artesanal')) {
    return 'Tu Taller Artesanal';
  }
  if (desc.includes('diseño') || desc.includes('creativo')) {
    return 'Tu Estudio Creativo';
  }
  
  // Services
  if (desc.includes('consultoría') || desc.includes('consultor')) {
    return 'Tu Consultoría';
  }
  if (desc.includes('agencia') || desc.includes('marketing')) {
    return 'Tu Agencia';
  }
  
  // Tech/digital
  if (desc.includes('app') || desc.includes('software') || desc.includes('tecnología')) {
    return 'Tu Startup';
  }
  
  // Default intelligent fallback
  if (desc.includes('negocio')) return 'Tu Negocio';
  if (desc.includes('empresa')) return 'Tu Empresa';
  if (desc.includes('proyecto')) return 'Tu Proyecto';
  
  return 'Tu Emprendimiento';
};

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
      const extractedBrandName = 
        (profileData as any)?.brandName || 
        (profileData as any)?.businessName ||
        (profileData as any)?.companyName ||
        null;

      const businessDescription = 
        (profileData as any)?.businessDescription ||
        (profileData as any)?.description ||
        (profileData as any)?.whatDoes ||
        (profileData as any)?.businessIdea ||
        null;

      // Auto-generate intelligent brand name if missing
      const brandName = extractedBrandName || generateIntelligentBrandName(businessDescription);

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