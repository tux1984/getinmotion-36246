
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CategoryScore } from '@/components/maturity/types';
import { ProfileType, RecommendedAgents } from '@/types/dashboard';
import { useMaturityWizard } from './hooks/useMaturityWizard';
import { WizardContent } from './components/WizardContent';

interface AIRecommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Alta' | 'Media' | 'Baja';
  timeframe: string;
}

export const CulturalMaturityWizard: React.FC<{
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, aiRecommendations?: AIRecommendation[]) => void;
}> = ({ onComplete }) => {
  const { language } = useLanguage();
  
  const handleWizardComplete = (scores: CategoryScore, recommendedAgents: RecommendedAgents) => {
    // AI recommendations will be fetched in ResultsStep and passed through completion
    onComplete(scores, recommendedAgents);
  };
  
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
    isCurrentStepValid,
    analysisType,
    handleAnalysisChoice
  } = useMaturityWizard(handleWizardComplete);

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
      handleCompleteWizard={handleWizardComplete}
      analysisType={analysisType}
      handleAnalysisChoice={handleAnalysisChoice}
    />
  );
};
