import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useTaskGenerationControl = () => {
  const { user } = useAuth();
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
      
      // Allow auto-generation only if maturity test has been completed
      const shouldAllow = localStatus === 'true' && hasCompletedMaturity;
      setAllowAutoGeneration(shouldAllow);
      setIsLoading(false);
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