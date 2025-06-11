
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { DashboardBackground } from '@/components/dashboard/DashboardBackground';
import { NewDashboardHeader } from '@/components/dashboard/NewDashboardHeader';
import { StreamlinedOnboardingWizard } from '@/components/onboarding/StreamlinedOnboardingWizard';
import { SimpleCulturalMaturityCalculator } from '@/components/cultural/SimpleCulturalMaturityCalculator';
import { useState, useEffect } from 'react';

const MaturityCalculator = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [profileType, setProfileType] = useState<'idea' | 'solo' | 'team'>('solo');

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  const handleMaturityCalculatorClick = () => {
    navigate('/dashboard/maturity-calculator');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents) => {
    // Save to localStorage
    localStorage.setItem('maturityScores', JSON.stringify(scores));
    localStorage.setItem('recommendedAgents', JSON.stringify(recommendedAgents));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleStandaloneComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents) => {
    // For standalone calculator usage
    localStorage.setItem('maturityScores', JSON.stringify(scores));
    localStorage.setItem('recommendedAgents', JSON.stringify(recommendedAgents));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <DashboardBackground>
      <NewDashboardHeader 
        onMaturityCalculatorClick={handleMaturityCalculatorClick}
        onAgentManagerClick={handleBackToDashboard}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 pt-32">
        {showOnboarding ? (
          <StreamlinedOnboardingWizard
            profileType={profileType}
            onComplete={handleComplete}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
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
