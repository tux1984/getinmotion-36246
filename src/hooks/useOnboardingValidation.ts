
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useOnboardingValidation = () => {
  const { user } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateOnboarding = () => {
      console.log('Validating onboarding status...');
      setIsValidating(true);

      try {
        // Check multiple indicators of completed onboarding
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        const maturityScores = localStorage.getItem('maturityScores');
        const recommendedAgents = localStorage.getItem('recommendedAgents');
        const userProfileData = localStorage.getItem('userProfileData');

        console.log('Onboarding validation data:', {
          onboardingCompleted,
          hasMaturityScores: !!maturityScores,
          hasRecommendedAgents: !!recommendedAgents,
          hasUserProfileData: !!userProfileData
        });

        // Primary check: explicit onboarding flag
        if (onboardingCompleted === 'true') {
          console.log('Onboarding marked as completed');
          setHasCompletedOnboarding(true);
          setIsValidating(false);
          return;
        }

        // Secondary check: has maturity scores
        if (maturityScores) {
          try {
            const scores = JSON.parse(maturityScores);
            if (scores && typeof scores === 'object' && Object.keys(scores).length > 0) {
              console.log('Found maturity scores, marking onboarding as complete');
              localStorage.setItem('onboardingCompleted', 'true');
              setHasCompletedOnboarding(true);
              setIsValidating(false);
              return;
            }
          } catch (e) {
            console.warn('Error parsing maturity scores:', e);
          }
        }

        // If no indicators found, onboarding is incomplete
        console.log('No onboarding indicators found');
        setHasCompletedOnboarding(false);
        setIsValidating(false);

      } catch (error) {
        console.error('Error validating onboarding:', error);
        setHasCompletedOnboarding(false);
        setIsValidating(false);
      }
    };

    if (user) {
      validateOnboarding();
    } else {
      setIsValidating(false);
      setHasCompletedOnboarding(false);
    }
  }, [user]);

  const markOnboardingComplete = () => {
    console.log('Manually marking onboarding as complete');
    localStorage.setItem('onboardingCompleted', 'true');
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    console.log('Resetting onboarding status');
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('maturityScores');
    localStorage.removeItem('recommendedAgents');
    localStorage.removeItem('userProfileData');
    setHasCompletedOnboarding(false);
  };

  return {
    hasCompletedOnboarding,
    isValidating,
    markOnboardingComplete,
    resetOnboarding
  };
};
