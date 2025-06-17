
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { StreamlinedOnboardingWizard } from '@/components/onboarding/StreamlinedOnboardingWizard';
import { SimpleCulturalMaturityCalculator } from '@/components/cultural/SimpleCulturalMaturityCalculator';
import { useState } from 'react';

const MaturityCalculator = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [profileType, setProfileType] = useState<'idea' | 'solo' | 'team'>('solo');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  const handleMaturityCalculatorClick = () => {
    navigate('/maturity-calculator');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard/home');
  };

  const handleComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents) => {
    console.log('MaturityCalculator: Onboarding completed, navigating to dashboard');
    
    setTimeout(() => {
      navigate('/dashboard/home', { replace: true });
    }, 100);
  };

  const handleStandaloneComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents) => {
    console.log('MaturityCalculator: Standalone calculator completed');
    
    setTimeout(() => {
      navigate('/dashboard/home', { replace: true });
    }, 100);
  };

  return (
    <DashboardBackground>
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onAgentManagerClick={handleBackToDashboard}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 pt-20">
        {showOnboarding ? (
          <StreamlinedOnboardingWizard
            profileType={profileType}
            onComplete={handleComplete}
          />
        ) : (
          <div className="w-full">
            <SimpleCulturalMaturityCalculator
              language={language}
              onComplete={handleStandaloneComplete}
            />
          </div>
        )}
      </div>
    </DashboardBackground>
  );
};

export default MaturityCalculator;
