import { useState, useEffect } from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';

export const useTaskGenerationControl = () => {
  const { user } = useRobustAuth();
  const [allowAutoGeneration, setAllowAutoGeneration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAutoGenerationStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const checkAutoGenerationStatus = () => {
    try {
      // Check localStorage first for quick response
      const localStatus = localStorage.getItem('allowTaskAutoGeneration');
      const hasCompletedMaturity = localStorage.getItem('onboardingCompleted') === 'true';
      
      console.log('🔍 Checking task generation status:', { localStatus, hasCompletedMaturity });
      
      // Force activation if maturity has been completed but auto-generation not enabled
      if (hasCompletedMaturity && localStatus !== 'true') {
        console.log('⚡ Force-enabling task generation after maturity completion');
        localStorage.setItem('allowTaskAutoGeneration', 'true');
        setAllowAutoGeneration(true);
        setIsLoading(false);
        return;
      }
      
      // Allow auto-generation only if maturity test has been completed
      const shouldAllow = localStatus === 'true' && hasCompletedMaturity;
      setAllowAutoGeneration(shouldAllow);
      setIsLoading(false);
      
      console.log('📊 Task generation status result:', { shouldAllow, localStatus, hasCompletedMaturity });
    } catch (error) {
      console.error('Error checking auto-generation status:', error);
      setAllowAutoGeneration(false);
      setIsLoading(false);
    }
  };

  const enableAutoGeneration = () => {
    console.log('✅ Enabling automatic task generation');
    localStorage.setItem('allowTaskAutoGeneration', 'true');
    setAllowAutoGeneration(true);
  };

  const disableAutoGeneration = () => {
    console.log('🚫 Disabling automatic task generation');
    localStorage.setItem('allowTaskAutoGeneration', 'false');
    setAllowAutoGeneration(false);
  };

  const resetGenerationControl = () => {
    console.log('🔄 Resetting task generation control');
    localStorage.removeItem('allowTaskAutoGeneration');
    setAllowAutoGeneration(false);
  };

  return {
    allowAutoGeneration,
    isLoading,
    enableAutoGeneration,
    disableAutoGeneration,
    resetGenerationControl,
    checkAutoGenerationStatus
  };
};