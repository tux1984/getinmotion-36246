import React, { useState } from 'react';
import { Steps } from '@/components/ui/steps';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useLanguage } from '@/context/LanguageContext';
import { useOnboarding } from './hooks/useOnboarding';
import { WelcomeStep } from './components/WelcomeStep';
import { MaturityStep } from './components/MaturityStep';
import { RecommendedAgentsStep } from './components/RecommendedAgentsStep';
import { CompletionStep } from './components/CompletionStep';
import { NavigationButtons } from './components/NavigationButtons';
import { ProfileQuestions } from './components/ProfileQuestions';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ComparisonStep } from './components/ComparisonStep';

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
    showMaturityCalculator,
    setShowMaturityCalculator,
    maturityScores,
    handleMaturityComplete,
    handleNext,
    handlePrevious,
    handleSkip,
    initialRecommendations,
    setInitialRecommendations
  } = useOnboarding({ profileType, onComplete });
  
  const translations = {
    en: {
      welcome: "Welcome to GET IN MOTION",
      welcomeDesc: "Let's set up your workspace based on your project status.",
      profileQuestions: "Tell us about your project",
      profileQuestionsDesc: `Let's learn more about your ${profileType === 'idea' ? 'idea' : profileType === 'team' ? 'team' : 'solo project'}.`,
      initialRecommendations: "Your initial recommendations",
      initialRecommendationsDesc: "Based on your profile, here are our initial recommendations for you.",
      extendedQuestions: "Enhanced analysis",
      extendedQuestionsDesc: "Let's dive deeper to provide more personalized recommendations.",
      compareResults: "Compare recommendations",
      compareResultsDesc: "See how additional information refined our recommendations for you.",
      finalizing: "Finalizing Your Workspace",
      finalizingDesc: "We're setting up your personalized dashboard with the recommended tools."
    },
    es: {
      welcome: "Bienvenido a GET IN MOTION",
      welcomeDesc: "Configuremos tu espacio de trabajo según el estado de tu proyecto.",
      profileQuestions: "Cuéntanos sobre tu proyecto",
      profileQuestionsDesc: `Conozcamos más sobre tu ${profileType === 'idea' ? 'idea' : profileType === 'team' ? 'equipo' : 'proyecto individual'}.`,
      initialRecommendations: "Tus recomendaciones iniciales",
      initialRecommendationsDesc: "Basado en tu perfil, aquí están nuestras recomendaciones iniciales para ti.",
      extendedQuestions: "Análisis mejorado",
      extendedQuestionsDesc: "Profundicemos más para brindarte recomendaciones más personalizadas.",
      compareResults: "Comparar recomendaciones",
      compareResultsDesc: "Mira cómo la información adicional refinó nuestras recomendaciones para ti.",
      finalizing: "Finalizando Tu Espacio de Trabajo",
      finalizingDesc: "Estamos configurando tu panel personalizado con las herramientas recomendadas."
    }
  };
  
  const t = translations[language];
  
  // Define steps based on the current flow state
  const steps = [
    {
      title: t.welcome,
      description: t.welcomeDesc
    },
    {
      title: t.profileQuestions,
      description: t.profileQuestionsDesc
    },
    {
      title: showExtendedQuestions ? t.extendedQuestions : t.initialRecommendations,
      description: showExtendedQuestions ? t.extendedQuestionsDesc : t.initialRecommendationsDesc
    },
    {
      title: showExtendedQuestions ? t.compareResults : t.finalizing,
      description: showExtendedQuestions ? t.compareResultsDesc : t.finalizingDesc
    },
    ...(showExtendedQuestions ? [{
      title: t.finalizing,
      description: t.finalizingDesc
    }] : [])
  ];
  
  // Sticky header component with logo and language switcher
  const StickyHeader = () => (
    <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm flex justify-between items-center">
      <div className="flex-shrink-0">
        <MotionLogo variant="dark" size="sm" />
      </div>
      <div className="flex items-center">
        <LanguageSwitcher />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-0 py-0">
      <StickyHeader />
      
      <div className="px-4 py-6">
        <div className="mb-8">
          <Steps currentStep={currentStep} steps={steps} />
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-0 mb-8 overflow-hidden">
          {currentStep === 0 && (
            <WelcomeStep 
              profileType={profileType}
              onNext={handleNext}
              language={language}
            />
          )}
          
          {currentStep === 1 && (
            <ProfileQuestions
              profileType={profileType}
              onComplete={(initialRecs) => {
                setInitialRecommendations(initialRecs);
                handleNext();
              }}
              showExtendedQuestions={false}
              language={language}
            />
          )}
          
          {currentStep === 2 && !showExtendedQuestions && (
            <RecommendedAgentsStep 
              profileType={profileType}
              maturityScores={null}
              initialRecommendations={initialRecommendations}
              onExtendedAnalysisRequested={() => {
                setShowExtendedQuestions(true);
                handleNext();
              }}
              onContinue={handleNext}
              language={language}
            />
          )}
          
          {currentStep === 2 && showExtendedQuestions && (
            <ProfileQuestions
              profileType={profileType}
              onComplete={(extendedRecs) => {
                // Store updated recommendations but keep initial ones for comparison
                setInitialRecommendations(prev => ({
                  ...prev,
                  extended: extendedRecs
                }));
                handleNext();
              }}
              showExtendedQuestions={true}
              language={language}
            />
          )}
          
          {currentStep === 3 && showExtendedQuestions && (
            <ComparisonStep 
              initialRecommendations={initialRecommendations}
              extendedRecommendations={initialRecommendations?.extended || null}
              onContinue={handleNext}
              language={language}
            />
          )}
          
          {((currentStep === 3 && !showExtendedQuestions) || (currentStep === 4 && showExtendedQuestions)) && (
            <CompletionStep 
              language={language}
              onComplete={() => onComplete(
                maturityScores || {
                  ideaValidation: 20,
                  userExperience: 15,
                  marketFit: 10,
                  monetization: 5
                }, 
                showExtendedQuestions && initialRecommendations?.extended 
                  ? initialRecommendations.extended 
                  : initialRecommendations || {
                      admin: true,
                      accounting: profileType !== 'idea',
                      legal: false,
                      operations: profileType === 'team',
                      cultural: true
                    }
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
