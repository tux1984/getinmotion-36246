
import React, { useState } from 'react';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useLanguage } from '@/context/LanguageContext';
import { StreamlinedOnboardingContent } from './StreamlinedOnboardingContent';
import { OnboardingHeader } from './OnboardingHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface StreamlinedOnboardingWizardProps {
  profileType: ProfileType;
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

export const StreamlinedOnboardingWizard: React.FC<StreamlinedOnboardingWizardProps> = ({ 
  profileType, 
  onComplete 
}) => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const [analysisType, setAnalysisType] = useState<'quick' | 'deep' | null>(null);
  const [basicRecommendations, setBasicRecommendations] = useState<RecommendedAgents | null>(null);

  const translations = {
    en: {
      steps: ['Your Profile', 'Key Questions', 'AI Analysis', 'Your Results'],
      stepDescriptions: [
        'Tell us about your creative venture',
        'Quick assessment of your current status',
        'Personalized AI-powered recommendations',
        'Your customized action plan'
      ]
    },
    es: {
      steps: ['Tu Perfil', 'Preguntas Clave', 'Análisis IA', 'Tus Resultados'],
      stepDescriptions: [
        'Cuéntanos sobre tu emprendimiento creativo',
        'Evaluación rápida de tu estado actual',
        'Recomendaciones personalizadas con IA',
        'Tu plan de acción personalizado'
      ]
    }
  };

  const t = translations[language];
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleMaturityComplete = (scores: CategoryScore) => {
    setMaturityScores(scores);
    handleNext();
  };

  const handleAnalysisChoice = (type: 'quick' | 'deep') => {
    setAnalysisType(type);
    handleNext();
  };

  const handleComplete = (finalRecommendations: RecommendedAgents) => {
    onComplete(
      maturityScores || {
        ideaValidation: 20,
        userExperience: 15,
        marketFit: 10,
        monetization: 5
      },
      finalRecommendations
    );
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'max-w-4xl'} mx-auto`}>
      <OnboardingHeader />
      
      <div className={`${isMobile ? 'px-3 py-4' : 'px-4 py-6'}`}>
        {/* Progress Indicator */}
        <div className={`${isMobile ? 'mb-6' : 'mb-8'}`}>
          <div className={`flex items-center justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
            <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>
              {t.steps[currentStep]}
            </h2>
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 ${
              isMobile ? 'bg-gray-100 px-2 py-1 rounded-full' : ''
            }`}>
              {language === 'en' ? `Step ${currentStep + 1} of ${totalSteps}` : `Paso ${currentStep + 1} de ${totalSteps}`}
            </span>
          </div>
          
          <p className={`text-gray-600 ${isMobile ? 'text-sm mb-3' : 'text-sm mb-4'}`}>
            {t.stepDescriptions[currentStep]}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <StreamlinedOnboardingContent
          currentStep={currentStep}
          profileType={profileType}
          language={language}
          maturityScores={maturityScores}
          analysisType={analysisType}
          basicRecommendations={basicRecommendations}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onMaturityComplete={handleMaturityComplete}
          onAnalysisChoice={handleAnalysisChoice}
          onComplete={handleComplete}
          setBasicRecommendations={setBasicRecommendations}
        />
      </div>
    </div>
  );
};
