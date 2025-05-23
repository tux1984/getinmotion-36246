
import React, { useState } from 'react';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useLanguage } from '@/context/LanguageContext';
import { useOnboarding } from './hooks/useOnboarding';
import { OnboardingHeader } from './components/OnboardingHeader';
import { StepsHeader } from './components/StepsHeader';
import { OnboardingContent } from './components/OnboardingContent';
import { buildOnboardingSteps } from './utils/stepUtils';

interface OnboardingWizardProps {
  profileType: ProfileType;
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ profileType, onComplete }) => {
  const { language } = useLanguage();
  const [showExtendedQuestions, setShowExtendedQuestions] = useState(false);
  
  const {
    currentStep,
    totalSteps,
    maturityScores,
    handleMaturityComplete,
    handleNext,
    initialRecommendations,
    setInitialRecommendations
  } = useOnboarding({ profileType, onComplete });
  
  // Build steps based on current state
  const steps = buildOnboardingSteps(profileType, language, showExtendedQuestions);

  return (
    <div className="max-w-4xl mx-auto px-0 py-0">
      <OnboardingHeader />
      
      <div className="px-4 py-6">
        <StepsHeader currentStep={currentStep} steps={steps} />
        
        <OnboardingContent
          currentStep={currentStep}
          profileType={profileType}
          language={language}
          showExtendedQuestions={showExtendedQuestions}
          maturityScores={maturityScores}
          initialRecommendations={initialRecommendations}
          handleNext={handleNext}
          handleMaturityComplete={handleMaturityComplete}
          setInitialRecommendations={setInitialRecommendations}
          setShowExtendedQuestions={setShowExtendedQuestions}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};
