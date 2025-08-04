// User progress detection utility
export const getUserProgressStatus = () => {
  try {
    // Check multiple indicators of user progress
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const maturityScores = localStorage.getItem('maturityScores');
    const recommendedAgents = localStorage.getItem('recommendedAgents');
    const userProfileData = localStorage.getItem('userProfileData');
    
    console.log('Checking user progress status:', {
      onboardingCompleted,
      hasMaturityScores: !!maturityScores,
      hasRecommendedAgents: !!recommendedAgents,
      hasUserProfileData: !!userProfileData
    });

    // Primary check: explicit onboarding flag
    if (onboardingCompleted === 'true') {
      return {
        hasProgress: true,
        shouldGoToDashboard: true,
        reason: 'onboarding_completed'
      };
    }

    // Secondary check: has maturity scores (indicates completed assessment)
    if (maturityScores) {
      try {
        const scores = JSON.parse(maturityScores);
        if (scores && typeof scores === 'object' && Object.keys(scores).length > 0) {
          // Mark onboarding as complete since they have scores
          localStorage.setItem('onboardingCompleted', 'true');
          return {
            hasProgress: true,
            shouldGoToDashboard: true,
            reason: 'has_maturity_scores'
          };
        }
      } catch (e) {
        console.warn('Error parsing maturity scores:', e);
      }
    }

    // Tertiary check: has recommended agents (indicates system usage)
    if (recommendedAgents) {
      try {
        const agents = JSON.parse(recommendedAgents);
        if (agents && Array.isArray(agents) && agents.length > 0) {
          return {
            hasProgress: true,
            shouldGoToDashboard: true,
            reason: 'has_recommended_agents'
          };
        }
      } catch (e) {
        console.warn('Error parsing recommended agents:', e);
      }
    }

    // Check if user has profile data (indicates some interaction)
    if (userProfileData) {
      try {
        const profileData = JSON.parse(userProfileData);
        if (profileData && typeof profileData === 'object' && Object.keys(profileData).length > 0) {
          return {
            hasProgress: true,
            shouldGoToDashboard: true,
            reason: 'has_profile_data'
          };
        }
      } catch (e) {
        console.warn('Error parsing user profile data:', e);
      }
    }

    // No progress indicators found - new user
    return {
      hasProgress: false,
      shouldGoToDashboard: false,
      reason: 'new_user'
    };

  } catch (error) {
    console.error('Error checking user progress status:', error);
    return {
      hasProgress: false,
      shouldGoToDashboard: false,
      reason: 'error'
    };
  }
};