
import React from 'react';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { CulturalMaturityWizard } from '@/components/cultural/CulturalMaturityWizard';
import { StreamlinedAnalysisStep } from './StreamlinedAnalysisStep';
import { StreamlinedResultsStep } from './StreamlinedResultsStep';
import { ProfileSetupStep } from './ProfileSetupStep';


interface StreamlinedOnboardingContentProps {
  currentStep: number;
  profileType: ProfileType;
  language: 'en' | 'es';
  maturityScores: CategoryScore | null;
  analysisType: 'quick' | 'deep' | null;
  basicRecommendations: RecommendedAgents | null;
  userProfileData: any;
  onNext: () => void;
  onPrevious: () => void;
  onMaturityComplete: (scores: CategoryScore) => void;
  onAnalysisChoice: (type: 'quick' | 'deep') => void;
  onComplete: (recommendations: RecommendedAgents) => void;
  onProfileDataUpdate: (data: any) => void;
  setBasicRecommendations: (recommendations: RecommendedAgents) => void;
}

export const StreamlinedOnboardingContent: React.FC<StreamlinedOnboardingContentProps> = ({
  currentStep,
  profileType,
  language,
  maturityScores,
  analysisType,
  basicRecommendations,
  userProfileData,
  onNext,
  onPrevious,
  onMaturityComplete,
  onAnalysisChoice,
  onComplete,
  onProfileDataUpdate,
  setBasicRecommendations
}) => {
  switch (currentStep) {
    case 0:
      return (
        <ProfileSetupStep
          profileType={profileType}
          language={language}
          onNext={onNext}
          onProfileDataUpdate={onProfileDataUpdate}
          profileData={userProfileData}
        />
      );

    case 1:
      return (
        <div className="w-full">
          <CulturalMaturityWizard
            onComplete={(scores, recommendedAgents, profileData) => {
              console.log('Cultural wizard completed with:', { scores, recommendedAgents, profileData });
              // Update profile data with cultural wizard results
              if (profileData) {
                onProfileDataUpdate(profileData);
              }
              onMaturityComplete(scores);
            }}
          />
        </div>
      );

    case 2:
      return (
        <StreamlinedAnalysisStep
          language={language}
          maturityScores={maturityScores}
          profileData={userProfileData}
          onAnalysisChoice={onAnalysisChoice}
          onNext={onNext}
          onPrevious={onPrevious}
          setBasicRecommendations={setBasicRecommendations}
        />
      );

    case 3:
      return (
        <StreamlinedResultsStep
          maturityScores={maturityScores}
          basicRecommendations={basicRecommendations}
          analysisType={analysisType}
          language={language}
          profileData={userProfileData}
          onComplete={onComplete}
          onPrevious={onPrevious}
        />
      );

    default:
      return null;
  }
};
