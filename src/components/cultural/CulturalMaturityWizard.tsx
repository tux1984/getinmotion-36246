
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { WizardHeader } from './wizard-components/WizardHeader';
import { StepProgress } from './wizard-components/StepProgress';
import { WizardBackground } from './wizard-components/WizardBackground';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { WizardNavigation } from './wizard-components/WizardNavigation';
import { WizardStepContent } from './wizard-components/WizardStepContent';
import { useMaturityWizard } from './hooks/useMaturityWizard';

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
  
  // Step labels - simplified since we now have many steps
  const stepTypes = {
    en: ['Profile', 'Business', 'Management', 'Analysis', 'Details', 'Results'],
    es: ['Perfil', 'Negocio', 'Gestión', 'Análisis', 'Detalles', 'Resultados']
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto relative">
      <WizardBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 overflow-hidden bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl">
          <WizardHeader 
            step={currentStepNumber} 
            totalSteps={totalSteps} 
            language={language} 
            industry={profileData.industry} 
          />
          
          <CardContent className="p-6 md:p-8 pb-10">
            <StepProgress 
              currentStep={currentStepNumber}
              totalSteps={totalSteps}
              language={language}
            />
            
            <WizardStepContent
              currentStepId={currentStepId}
              profileData={profileData}
              updateProfileData={updateProfileData}
              language={language}
              calculateMaturityScores={calculateMaturityScores}
              getRecommendedAgents={getRecommendedAgents}
              onComplete={handleCompleteWizard}
            />
            
            <WizardNavigation
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirstStep={currentStepNumber === 1}
              isLastStep={currentStepId === 'results'}
              language={language}
              currentStepId={currentStepId}
              profileData={profileData}
              isValid={isCurrentStepValid()}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
