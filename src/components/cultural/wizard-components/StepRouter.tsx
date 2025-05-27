
import React from 'react';
import { ProfileTypeStep } from '../wizard-steps/ProfileTypeStep';
import { ProfileQuestionsStep } from '../wizard-steps/ProfileQuestionsStep';
import { ResultsStep } from '../wizard-steps/ResultsStep';
import { CulturalProfileStep } from '../wizard-steps/CulturalProfileStep';
import { BusinessMaturityStep } from '../wizard-steps/BusinessMaturityStep';
import { ManagementStyleStep } from '../wizard-steps/ManagementStyleStep';
import { BifurcationStep } from '../wizard-steps/BifurcationStep';
import { ExtendedQuestionsStep } from '../wizard-steps/ExtendedQuestionsStep';
import { QuestionStep } from './QuestionStep';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/types/wizardTypes';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { getQuestions } from '../wizard-questions/index';
import { getStepImage } from './CharacterImageSelector';

interface StepRouterProps {
  currentStepId: WizardStepId;
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  calculateMaturityScores: () => CategoryScore;
  getRecommendedAgents: (scores: CategoryScore) => RecommendedAgents;
  onComplete: () => void;
  currentStepNumber: number;
  totalSteps: number;
  handleNext: () => void;
  handlePrevious: () => void;
  isCurrentStepValid: () => boolean;
  analysisType?: 'quick' | 'deep' | null;
  handleAnalysisChoice?: (type: 'quick' | 'deep') => void;
}

export const StepRouter: React.FC<StepRouterProps> = ({
  currentStepId,
  profileData,
  updateProfileData,
  language,
  calculateMaturityScores,
  getRecommendedAgents,
  onComplete,
  currentStepNumber,
  totalSteps,
  handleNext,
  handlePrevious,
  isCurrentStepValid,
  analysisType,
  handleAnalysisChoice
}) => {
  // Get question configuration based on current step
  const questions = getQuestions(language);
  const questionConfig = questions[currentStepId];

  // Render content based on the current step
  if (currentStepId === 'profileType') {
    return (
      <ProfileTypeStep
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        isStepValid={isCurrentStepValid()}
      />
    );
  }
  
  if (currentStepId === 'culturalProfile') {
    return (
      <CulturalProfileStep
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        isStepValid={isCurrentStepValid()}
      />
    );
  }
  
  if (currentStepId === 'businessMaturity') {
    return (
      <BusinessMaturityStep
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isStepValid={isCurrentStepValid()}
      />
    );
  }
  
  if (currentStepId === 'managementStyle') {
    return (
      <ManagementStyleStep
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isStepValid={isCurrentStepValid()}
      />
    );
  }
  
  if (currentStepId === 'bifurcation') {
    return (
      <BifurcationStep
        profileData={profileData}
        language={language}
        selectedAnalysisType={analysisType}
        onAnalysisChoice={handleAnalysisChoice!}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
      />
    );
  }
  
  if (currentStepId === 'extendedQuestions') {
    return (
      <ExtendedQuestionsStep
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isStepValid={isCurrentStepValid()}
      />
    );
  }
  
  if (currentStepId === 'profileQuestions') {
    return (
      <ProfileQuestionsStep
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isStepValid={isCurrentStepValid()}
        illustration={getStepImage(currentStepId, calculateMaturityScores)}
      />
    );
  }

  if (currentStepId === 'results') {
    return (
      <ResultsStep 
        profileData={profileData}
        scores={calculateMaturityScores()}
        recommendedAgents={getRecommendedAgents(calculateMaturityScores())}
        language={language}
        onComplete={onComplete}
        illustration={getStepImage(currentStepId, calculateMaturityScores)}
      />
    );
  }
  
  if (questionConfig) {
    return (
      <QuestionStep 
        question={questionConfig}
        profileData={profileData}
        updateProfileData={updateProfileData}
        language={language}
        industry={profileData.industry}
        illustration={getStepImage(currentStepId, calculateMaturityScores)}
        currentStepNumber={currentStepNumber}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirstStep={currentStepNumber === 1}
        currentStepId={currentStepId}
        isStepValid={isCurrentStepValid()}
      />
    );
  }
  
  return null;
};
