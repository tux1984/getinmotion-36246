
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { useMaturityWizard } from './hooks/useMaturityWizard';
import { WizardContent } from './components/WizardContent';

export const CulturalMaturityWizard: React.FC<{
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}> = ({ onComplete }) => {
  const { language } = useLanguage();
  
  const {
    currentStepId,
    profileData,
    totalSteps,
    currentStepNumber,
    updateProfileData,
    handleNext,
    handlePrevious,
    calculateMaturityScores,
    getRecommendedAgents,
    handleCompleteWizard,
    isCurrentStepValid
  } = useMaturityWizard(onComplete);

  return (
    <WizardContent
      currentStepId={currentStepId}
      currentStepNumber={currentStepNumber}
      totalSteps={totalSteps}
      profileData={profileData}
      language={language}
      isCurrentStepValid={isCurrentStepValid}
      updateProfileData={updateProfileData}
      handleNext={handleNext}
      handlePrevious={handlePrevious}
      calculateMaturityScores={calculateMaturityScores}
      getRecommendedAgents={getRecommendedAgents}
      handleCompleteWizard={handleCompleteWizard}
    />
  );
};
