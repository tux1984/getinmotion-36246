import { supabase } from '@/integrations/supabase/client';

// Enhanced user progress detection utility with Supabase verification
export const getUserProgressStatus = async (userId?: string) => {
  try {
    console.log('🔍 Checking user progress status for userId:', userId);
    
    // Check multiple indicators of user progress from localStorage
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const maturityScores = localStorage.getItem('maturityScores');
    const recommendedAgents = localStorage.getItem('recommendedAgents');
    const userProfileData = localStorage.getItem('userProfileData');
    
    console.log('📊 LocalStorage progress indicators:', {
      onboardingCompleted,
      hasMaturityScores: !!maturityScores,
      hasRecommendedAgents: !!recommendedAgents,
      hasUserProfileData: !!userProfileData
    });

    // Primary check: explicit onboarding flag with validation
    if (onboardingCompleted === 'true') {
      console.log('✅ User has explicit onboarding completed flag');
      return {
        hasProgress: true,
        shouldGoToDashboard: true,
        reason: 'onboarding_completed',
        source: 'localStorage'
      };
    }

    // Secondary check: has valid maturity scores
    let hasValidMaturityScores = false;
    if (maturityScores) {
      try {
        const scores = JSON.parse(maturityScores);
        if (scores && typeof scores === 'object' && Object.keys(scores).length > 0) {
          hasValidMaturityScores = true;
          console.log('✅ Found valid maturity scores in localStorage');
          // Auto-mark onboarding as complete
          localStorage.setItem('onboardingCompleted', 'true');
          return {
            hasProgress: true,
            shouldGoToDashboard: true,
            reason: 'has_maturity_scores',
            source: 'localStorage'
          };
        }
      } catch (e) {
        console.warn('⚠️ Error parsing maturity scores from localStorage:', e);
      }
    }

    // Tertiary check: has recommended agents
    let hasValidAgents = false;
    if (recommendedAgents) {
      try {
        const agents = JSON.parse(recommendedAgents);
        if (agents && (Array.isArray(agents) || typeof agents === 'object')) {
          hasValidAgents = true;
          console.log('✅ Found valid recommended agents in localStorage');
          return {
            hasProgress: true,
            shouldGoToDashboard: true,
            reason: 'has_recommended_agents',
            source: 'localStorage'
          };
        }
      } catch (e) {
        console.warn('⚠️ Error parsing recommended agents from localStorage:', e);
      }
    }

    // Profile data check
    if (userProfileData) {
      try {
        const profileData = JSON.parse(userProfileData);
        if (profileData && typeof profileData === 'object' && Object.keys(profileData).length > 0) {
          console.log('✅ Found valid user profile data in localStorage');
          return {
            hasProgress: true,
            shouldGoToDashboard: true,
            reason: 'has_profile_data',
            source: 'localStorage'
          };
        }
      } catch (e) {
        console.warn('⚠️ Error parsing user profile data from localStorage:', e);
      }
    }

    // If userId provided, verify with Supabase as fallback
    if (userId) {
      console.log('🔄 LocalStorage incomplete, checking Supabase for user progress...');
      const supabaseProgress = await checkSupabaseUserProgress(userId);
      
      if (supabaseProgress.hasProgress) {
        console.log('✅ Found user progress in Supabase, recovering localStorage...');
        // Recover localStorage from Supabase data
        if (supabaseProgress.maturityScores) {
          localStorage.setItem('maturityScores', JSON.stringify(supabaseProgress.maturityScores));
        }
        if (supabaseProgress.agents && supabaseProgress.agents.length > 0) {
          // Convert agents array to recommended agents format
          const agentRecommendations = {
            primary: supabaseProgress.agents.map(agent => agent.agent_id),
            secondary: []
          };
          localStorage.setItem('recommendedAgents', JSON.stringify(agentRecommendations));
        }
        localStorage.setItem('onboardingCompleted', 'true');
        
        return {
          hasProgress: true,
          shouldGoToDashboard: true,
          reason: 'recovered_from_supabase',
          source: 'supabase'
        };
      }
    }

    // No progress indicators found - new user
    console.log('❌ No progress indicators found - treating as new user');
    return {
      hasProgress: false,
      shouldGoToDashboard: false,
      reason: 'new_user',
      source: 'none'
    };

  } catch (error) {
    console.error('💥 Error checking user progress status:', error);
    return {
      hasProgress: false,
      shouldGoToDashboard: false,
      reason: 'error',
      source: 'error'
    };
  }
};

// Check Supabase for user progress indicators
const checkSupabaseUserProgress = async (userId: string) => {
  try {
    console.log('🔍 Checking Supabase for user progress:', userId);
    
    // Check for maturity scores
    const { data: maturityData } = await supabase
      .from('user_maturity_scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Check for user agents
    const { data: agentsData } = await supabase
      .from('user_agents')
      .select('agent_id, is_enabled')
      .eq('user_id', userId)
      .eq('is_enabled', true);

    // Check for any tasks (indicates system usage)
    const { data: tasksData } = await supabase
      .from('agent_tasks')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    console.log('📊 Supabase progress check results:', {
      hasMaturityScores: !!maturityData,
      agentsCount: agentsData?.length || 0,
      hasTasks: !!tasksData
    });

    const hasProgress = !!maturityData || (agentsData && agentsData.length > 0) || !!tasksData;
    
    return {
      hasProgress,
      maturityScores: maturityData ? {
        ideaValidation: maturityData.idea_validation,
        userExperience: maturityData.user_experience,
        marketFit: maturityData.market_fit,
        monetization: maturityData.monetization
      } : null,
      agents: agentsData || [],
      hasTasks: !!tasksData
    };
  } catch (error) {
    console.error('💥 Error checking Supabase user progress:', error);
    return { hasProgress: false };
  }
};

// Synchronous version for backward compatibility
export const getUserProgressStatusSync = () => {
  try {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const maturityScores = localStorage.getItem('maturityScores');
    const recommendedAgents = localStorage.getItem('recommendedAgents');
    
    console.log('🔍 Sync progress check:', { onboardingCompleted, hasMaturityScores: !!maturityScores });
    
    if (onboardingCompleted === 'true') {
      return { hasProgress: true, shouldGoToDashboard: true, reason: 'onboarding_completed' };
    }
    
    if (maturityScores) {
      try {
        const scores = JSON.parse(maturityScores);
        if (scores && typeof scores === 'object' && Object.keys(scores).length > 0) {
          localStorage.setItem('onboardingCompleted', 'true');
          return { hasProgress: true, shouldGoToDashboard: true, reason: 'has_maturity_scores' };
        }
      } catch (e) {
        console.warn('Error parsing maturity scores:', e);
      }
    }
    
    return { hasProgress: false, shouldGoToDashboard: false, reason: 'new_user' };
  } catch (error) {
    console.error('Error in sync progress check:', error);
    return { hasProgress: false, shouldGoToDashboard: false, reason: 'error' };
  }
};