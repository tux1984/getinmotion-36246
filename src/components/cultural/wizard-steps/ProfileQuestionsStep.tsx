
import React from 'react';
import { motion } from 'framer-motion';
import { IdeaProfileQuestions } from '@/components/onboarding/components/questions/IdeaProfileQuestions';
import { SoloProfileQuestions } from '@/components/onboarding/components/questions/SoloProfileQuestions';
import { TeamProfileQuestions } from '@/components/onboarding/components/questions/TeamProfileQuestions';
import { StepContainer } from '../wizard-components/StepContainer';
import { StepProgress } from '../wizard-components/StepProgress';
import { WizardNavigation } from '../wizard-components/WizardNavigation';
import { UserProfileData } from '../types/wizardTypes';

interface ProfileQuestionsStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  currentStepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isStepValid: boolean;
  illustration: string;
}

export const ProfileQuestionsStep: React.FC<ProfileQuestionsStepProps> = ({
  profileData,
  updateProfileData,
  language,
  currentStepNumber,
  totalSteps,
  onNext,
  onPrevious,
  isStepValid,
  illustration,
}) => {
  // Handle answers from profile-specific question components
  const handleAnswer = (questionId: string, value: any) => {
    updateProfileData({ [questionId]: value });
  };
  
  const translations = {
    en: {
      title: "Profile Questions",
      subtitle: "Tell us about your creative project",
      idea: "Idea Development",
      solo: "Solo Creator",
      team: "Team Management",
      next: "Next",
      previous: "Previous",
      complete: "Complete"
    },
    es: {
      title: "Preguntas de Perfil",
      subtitle: "Cuéntanos sobre tu proyecto creativo",
      idea: "Desarrollo de Ideas",
      solo: "Creador Individual",
      team: "Gestión de Equipo",
      next: "Siguiente",
      previous: "Anterior",
      complete: "Completar"
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
      <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <StepProgress 
            currentStep={currentStepNumber} 
            totalSteps={totalSteps}
            language={language}
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-900 mt-6">{getTitle()}</h2>
          <p className="text-lg text-gray-600 mt-2">{t.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 hidden md:block">
            <div className="flex justify-center items-center h-full">
              <motion.img
                src={illustration}
                alt="Character illustration"
                className="w-48 h-48 object-contain"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              {profileData.profileType === 'idea' && (
                <IdeaProfileQuestions
                  currentQuestionIndex={0}
                  showExtendedQuestions={true}
                  answers={profileData}
                  onAnswer={handleAnswer}
                  language={language}
                />
              )}
              
              {profileData.profileType === 'solo' && (
                <SoloProfileQuestions
                  currentQuestionIndex={0}
                  showExtendedQuestions={true}
                  answers={profileData}
                  onAnswer={handleAnswer}
                  language={language}
                />
              )}
              
              {profileData.profileType === 'team' && (
                <TeamProfileQuestions
                  currentQuestionIndex={0}
                  showExtendedQuestions={true}
                  answers={profileData}
                  onAnswer={handleAnswer}
                  language={language}
                />
              )}
            </div>
          </div>
        </div>
        
        <WizardNavigation
          onNext={onNext}
          onPrevious={onPrevious}
          isFirstStep={false}
          isLastStep={false}
          language={language}
          currentStepId="profileQuestions"
          profileData={profileData}
          isValid={isStepValid}
        />
      </div>
    </StepContainer>
  );
};
