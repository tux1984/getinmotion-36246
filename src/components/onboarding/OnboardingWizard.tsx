
import React from 'react';
import { Steps } from '@/components/ui/steps';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useLanguage } from '@/context/LanguageContext';
import { useOnboarding } from './hooks/useOnboarding';
import { WelcomeStep } from './components/WelcomeStep';
import { MaturityStep } from './components/MaturityStep';
import { RecommendedAgentsStep } from './components/RecommendedAgentsStep';
import { CompletionStep } from './components/CompletionStep';
import { NavigationButtons } from './components/NavigationButtons';

interface OnboardingWizardProps {
  profileType: ProfileType;
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ profileType, onComplete }) => {
  const { language } = useLanguage();
  
  const {
    currentStep,
    totalSteps,
    showMaturityCalculator,
    setShowMaturityCalculator,
    maturityScores,
    handleMaturityComplete,
    handleNext,
    handlePrevious,
    handleSkip
  } = useOnboarding({ profileType, onComplete });
  
  const translations = {
    en: {
      welcome: "Welcome to GET IN MOTION",
      welcomeDesc: "Let's set up your workspace based on your project status.",
      calculatingMaturity: "Calculating Project Maturity",
      calculatingMaturityDesc: "Let's evaluate your project's current state to recommend the best tools.",
      recommendingAgents: "Recommending Agents",
      recommendingAgentsDesc: "Based on your project profile and maturity level, we're selecting the best copilots for you.",
      finalizing: "Finalizing Your Workspace",
      finalizingDesc: "We're setting up your personalized dashboard with the recommended tools."
    },
    es: {
      welcome: "Bienvenido a GET IN MOTION",
      welcomeDesc: "Configuremos tu espacio de trabajo según el estado de tu proyecto.",
      calculatingMaturity: "Calculando Madurez del Proyecto",
      calculatingMaturityDesc: "Evaluemos el estado actual de tu proyecto para recomendar las mejores herramientas.",
      recommendingAgents: "Recomendando Agentes",
      recommendingAgentsDesc: "Basado en tu perfil de proyecto y nivel de madurez, estamos seleccionando los mejores copilotos para ti.",
      finalizing: "Finalizando Tu Espacio de Trabajo",
      finalizingDesc: "Estamos configurando tu panel personalizado con las herramientas recomendadas."
    }
  };
  
  const t = translations[language];
  
  const steps = [
    {
      title: t.welcome,
      description: t.welcomeDesc
    },
    {
      title: t.calculatingMaturity,
      description: t.calculatingMaturityDesc
    },
    {
      title: t.recommendingAgents,
      description: t.recommendingAgentsDesc
    },
    {
      title: t.finalizing,
      description: t.finalizingDesc
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Steps currentStep={currentStep} steps={steps} />
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {currentStep === 0 && (
          <WelcomeStep profileType={profileType} />
        )}
        
        {currentStep === 1 && (
          <MaturityStep
            showCalculator={showMaturityCalculator}
            setShowCalculator={setShowMaturityCalculator}
            onComplete={handleMaturityComplete}
          />
        )}
        
        {currentStep === 2 && (
          <RecommendedAgentsStep 
            profileType={profileType}
            maturityScores={maturityScores}
          />
        )}
        
        {currentStep === 3 && (
          <CompletionStep />
        )}
      </div>
      
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        showMaturityStep={currentStep === 1 && showMaturityCalculator}
      />
    </div>
  );
};
