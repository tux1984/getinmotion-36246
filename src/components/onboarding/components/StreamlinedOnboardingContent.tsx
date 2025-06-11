
import React from 'react';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { StreamlinedWelcomeStep } from './StreamlinedWelcomeStep';
import { StreamlinedMaturityStep } from './StreamlinedMaturityStep';
import { StreamlinedAIAnalysisStep } from './StreamlinedAIAnalysisStep';
import { StreamlinedResultsStep } from './StreamlinedResultsStep';

interface StreamlinedOnboardingContentProps {
  currentStep: number;
  profileType: ProfileType;
  language: 'en' | 'es';
  maturityScores: CategoryScore | null;
  analysisType: 'quick' | 'deep' | null;
  basicRecommendations: RecommendedAgents | null;
  onNext: () => void;
  onPrevious: () => void;
  onMaturityComplete: (scores: CategoryScore) => void;
  onAnalysisChoice: (type: 'quick' | 'deep') => void;
  onComplete: (recommendations: RecommendedAgents) => void;
  setBasicRecommendations: (recommendations: RecommendedAgents) => void;
}

export const StreamlinedOnboardingContent: React.FC<StreamlinedOnboardingContentProps> = ({
  currentStep,
  profileType,
  language,
  maturityScores,
  analysisType,
  basicRecommendations,
  onNext,
  onPrevious,
  onMaturityComplete,
  onAnalysisChoice,
  onComplete,
  setBasicRecommendations
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {currentStep === 0 && (
        <StreamlinedWelcomeStep
          profileType={profileType}
          language={language}
          onNext={onNext}
        />
      )}

      {currentStep === 1 && (
        <StreamlinedMaturityStep
          profileType={profileType}
          language={language}
          onComplete={onMaturityComplete}
          onPrevious={onPrevious}
          setBasicRecommendations={setBasicRecommendations}
        />
      )}

      {currentStep === 2 && (
        <StreamlinedAIAnalysisStep
          profileType={profileType}
          maturityScores={maturityScores}
          language={language}
          onAnalysisChoice={onAnalysisChoice}
          onComplete={onNext}
          onPrevious={onPrevious}
          analysisType={analysisType}
        />
      )}

      {currentStep === 3 && (
        <StreamlinedResultsStep
          maturityScores={maturityScores}
          basicRecommendations={basicRecommendations}
          analysisType={analysisType}
          language={language}
          onComplete={onComplete}
          onPrevious={onPrevious}
        />
      )}
    </div>
  );
};
