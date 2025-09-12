
import { useState, useEffect } from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { getUserProgressStatusSync } from '@/utils/userProgress';

export const useOnboardingValidation = () => {
  const { user } = useRobustAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateOnboarding = () => {
      console.log('Validating onboarding status...');
      setIsValidating(true);

      try {
        // Use the synchronous progress status function for immediate results
        const progressStatus = getUserProgressStatusSync();
        console.log('Onboarding validation using sync status:', progressStatus);

        setHasCompletedOnboarding(progressStatus.shouldGoToDashboard);
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
