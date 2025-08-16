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
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get rich data from localStorage
      const fusedMaturityData = localStorage.getItem('fused_maturity_calculator_progress');
      const conversationalData = localStorage.getItem('enhanced_conversational_agent_progress');
      const calculatorData = localStorage.getItem('profileData');
      
      let profileData: any = {};
      let brandName = existingProfile?.brand_name || '';
      let businessDescription = existingProfile?.business_description || '';
      
      // Extract comprehensive data from localStorage
      if (fusedMaturityData) {
        const data = JSON.parse(fusedMaturityData);
        profileData = data.profileData || {};
        brandName = brandName || profileData.brandName || '';
        businessDescription = businessDescription || profileData.businessDescription || '';
      } else if (conversationalData) {
        const data = JSON.parse(conversationalData);
        profileData = data.profileData || {};
        brandName = brandName || profileData.brandName || '';
        businessDescription = businessDescription || profileData.businessDescription || '';
      } else if (calculatorData) {
        profileData = JSON.parse(calculatorData);
        brandName = brandName || profileData.brandName || '';
        businessDescription = businessDescription || profileData.businessDescription || '';
      }

      // Auto-generate intelligent brand name if missing and we have business description
      if (!brandName && businessDescription) {
        brandName = generateIntelligentBrandName(businessDescription);
        console.log('🎯 Auto-generated brand name:', brandName, 'from description:', businessDescription);
      }

      // Extract additional profile fields
      const fullProfileUpdate = {
        user_id: user.id,
        brand_name: brandName,
        business_description: businessDescription,
        business_type: profileData.businessType || existingProfile?.business_type || null,
        target_market: profileData.targetMarket || existingProfile?.target_market || null,
        current_stage: profileData.currentStage || existingProfile?.current_stage || null,
        business_goals: profileData.businessGoals ? [profileData.businessGoals] : existingProfile?.business_goals || null,
        business_location: profileData.businessLocation || existingProfile?.business_location || null,
        years_in_business: profileData.yearsInBusiness || existingProfile?.years_in_business || null,
        monthly_revenue_goal: profileData.revenueGoal ? parseInt(profileData.revenueGoal) : existingProfile?.monthly_revenue_goal || null,
        updated_at: new Date().toISOString()
      };

      // Sync to database (upsert)
      const { error } = await supabase
        .from('user_profiles')
        .upsert(fullProfileUpdate, { 
          onConflict: 'user_id' 
        });

      if (error) throw error;
      
      console.log('✅ Profile synced successfully', fullProfileUpdate);

      // Clean up task titles if brand name was just generated
      if (brandName && !existingProfile?.brand_name) {
        await cleanupTaskTitles(user.id, brandName);
      }
    } catch (error) {
      console.error('❌ Error syncing profile:', error);
    }
  }, [user]);

  // Function to clean up existing task titles
  const cleanupTaskTitles = async (userId: string, brandName: string) => {
    try {
      console.log('🧹 Cleaning up task titles for user:', userId);
      
      // Get all tasks with array-like titles
      const { data: tasks } = await supabase
        .from('agent_tasks')
        .select('id, title, description')
        .eq('user_id', userId);

      if (!tasks) return;

      const tasksToUpdate = tasks.filter(task => 
        task.title && (
          task.title.includes('[') || 
          task.title.includes('"') ||
          task.title.includes('goal') ||
          task.title.length > 100
        )
      );

      console.log(`🎯 Found ${tasksToUpdate.length} tasks to clean up`);

      for (const task of tasksToUpdate) {
        const { formatTaskTitleForDisplay } = await import('./utils/agentTaskUtils');
        const cleanTitle = formatTaskTitleForDisplay(task.title, brandName);
        
        if (cleanTitle !== task.title) {
          const { error } = await supabase
            .from('agent_tasks')
            .update({ 
              title: cleanTitle,
              updated_at: new Date().toISOString()
            })
            .eq('id', task.id);

          if (error) {
            console.error('❌ Error updating task title:', error);
          } else {
            console.log('✅ Updated task title:', task.title, '→', cleanTitle);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error cleaning up task titles:', error);
    }
  };

  // Auto-sync when component mounts or data changes
  useEffect(() => {
    syncProfileData();
  }, [syncProfileData]);

  return { syncProfileData };
};