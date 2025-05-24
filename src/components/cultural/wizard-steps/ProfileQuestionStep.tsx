
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IdeaProfileQuestions } from '@/components/onboarding/components/questions/IdeaProfileQuestions';
import { SoloProfileQuestions } from '@/components/onboarding/components/questions/SoloProfileQuestions';
import { TeamProfileQuestions } from '@/components/onboarding/components/questions/TeamProfileQuestions';
import { StepContainer } from '../wizard-components/StepContainer';
import { StepProgress } from '../wizard-components/StepProgress';
import { WizardNavigation } from '../wizard-components/WizardNavigation';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/types/wizardTypes';

interface ProfileQuestionStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  currentStepNumber: number;
  totalSteps: number;
  currentStepId: WizardStepId;
  onNext: () => void;
  onPrevious: () => void;
  isStepValid: boolean;
}

export const ProfileQuestionStep: React.FC<ProfileQuestionStepProps> = ({
  profileData,
  updateProfileData,
  language,
  currentStepNumber,
  totalSteps,
  currentStepId,
  onNext,
  onPrevious,
  isStepValid,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Handle answers from profile-specific question components
  const handleAnswer = (questionId: string, value: any) => {
    updateProfileData({ [questionId]: value });
  };
  
  // Determine if we need to show extended questions based on analysisChoice
  const showExtendedQuestions = profileData.analysisPreference === 'detailed';
  
  const translations = {
    en: {
      title: "Profile Questions",
      subtitle: "Tell us about your creative project",
      idea: "Idea Development",
      solo: "Solo Creator",
      team: "Team Management"
    },
    es: {
      title: "Preguntas de Perfil",
      subtitle: "Cuéntanos sobre tu proyecto creativo",
      idea: "Desarrollo de Ideas",
      solo: "Creador Individual",
      team: "Gestión de Equipo"
    }
  };
  
  const t = translations[language];
  
  // Get the title based on profile type
  const getTitle = () => {
    switch (profileData.profileType) {
      case 'idea': return t.idea;
      case 'solo': return t.solo;
      case 'team': return t.team;
      default: return t.title;
    }
  };
  
  return (
    <StepContainer title={getTitle()} subtitle={t.subtitle}>
      <div className="flex flex-col space-y-8 w-full max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <StepProgress 
            currentStep={currentStepNumber} 
            totalSteps={totalSteps}
            language={language}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          {profileData.profileType === 'idea' && (
            <IdeaProfileQuestions
              currentQuestionIndex={currentQuestionIndex}
              showExtendedQuestions={showExtendedQuestions}
              answers={profileData}
              onAnswer={handleAnswer}
              language={language}
            />
          )}
          
          {profileData.profileType === 'solo' && (
            <SoloProfileQuestions
              currentQuestionIndex={currentQuestionIndex}
              showExtendedQuestions={showExtendedQuestions}
              answers={profileData}
              onAnswer={handleAnswer}
              language={language}
            />
          )}
          
          {profileData.profileType === 'team' && (
            <TeamProfileQuestions
              currentQuestionIndex={currentQuestionIndex}
              showExtendedQuestions={showExtendedQuestions}
              answers={profileData}
              onAnswer={handleAnswer}
              language={language}
            />
          )}
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(prev => prev - 1);
              } else {
                onPrevious();
              }
            }}
            className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          >
            {language === 'en' ? 'Previous' : 'Anterior'}
          </button>
          
          <button
            onClick={() => {
              // Determine if there are more questions in the current profile component
              const maxQuestions = profileData.profileType === 'idea' 
                ? 5 // Number of basic questions in IdeaProfileQuestions
                : profileData.profileType === 'solo'
                  ? 5 // Number of basic questions in SoloProfileQuestions
                  : 5; // Number of basic questions in TeamProfileQuestions
                  
              if (currentQuestionIndex < maxQuestions - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
              } else {
                // Move to the next wizard step
                onNext();
                // Reset question index for when user comes back
                setCurrentQuestionIndex(0);
              }
            }}
            className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            disabled={!isStepValid}
          >
            {language === 'en' ? 'Next' : 'Siguiente'}
          </button>
        </div>
        
        <WizardNavigation
          onNext={onNext}
          onPrevious={onPrevious}
          isFirstStep={false}
          isLastStep={false}
          language={language}
          currentStepId={currentStepId}
          profileData={profileData}
          isValid={isStepValid}
        />
      </div>
    </StepContainer>
  );
};
