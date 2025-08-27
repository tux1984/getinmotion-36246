
import React, { useState } from 'react';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useLanguage } from '@/context/LanguageContext';
import { StreamlinedOnboardingContent } from './components/StreamlinedOnboardingContent';
import { OnboardingHeader } from './components/OnboardingHeader';
import { mapToLegacyLanguage } from '@/utils/languageMapper';

interface StreamlinedOnboardingWizardProps {
  profileType: ProfileType;
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

export const StreamlinedOnboardingWizard: React.FC<StreamlinedOnboardingWizardProps> = ({ 
  profileType, 
  onComplete 
}) => {
  const { language } = useLanguage();
  const compatibleLanguage = mapToLegacyLanguage(language);
  const [currentStep, setCurrentStep] = useState(0);
  const [maturityScores, setMaturityScores] = useState<CategoryScore | null>(null);
  const [analysisType, setAnalysisType] = useState<'quick' | 'deep' | null>(null);
  const [basicRecommendations, setBasicRecommendations] = useState<RecommendedAgents | null>(null);
  const [userProfileData, setUserProfileData] = useState<any>({});

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

  const t = translations[compatibleLanguage];
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
    console.log('Maturity scores completed:', scores);
    setMaturityScores(scores);
    handleNext();
  };

  const handleAnalysisChoice = (type: 'quick' | 'deep') => {
    console.log('Analysis type selected:', type);
    setAnalysisType(type);
    handleNext();
  };

  const handleProfileDataUpdate = (newData: any) => {
    console.log('Updating profile data:', newData);
    setUserProfileData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleComplete = (finalRecommendations: RecommendedAgents) => {
    console.log('Onboarding completed with:', {
      maturityScores,
      finalRecommendations,
      userProfileData
    });
    
    // Save to localStorage for persistence
    localStorage.setItem('userProfileData', JSON.stringify(userProfileData));
    localStorage.setItem('maturityScores', JSON.stringify(maturityScores));
    localStorage.setItem('recommendedAgents', JSON.stringify(finalRecommendations));
    localStorage.setItem('onboardingCompleted', 'true');
    
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
    <div className="w-full">
      <OnboardingHeader />
      
      <div className="px-4 py-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t.steps[currentStep]}
            </h2>
            <span className="text-sm text-gray-500">
              {compatibleLanguage === 'en' ? `Step ${currentStep + 1} of ${totalSteps}` : `Paso ${currentStep + 1} de ${totalSteps}`}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
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
          language={compatibleLanguage}
          maturityScores={maturityScores}
          analysisType={analysisType}
          basicRecommendations={basicRecommendations}
          userProfileData={userProfileData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onMaturityComplete={handleMaturityComplete}
          onAnalysisChoice={handleAnalysisChoice}
          onComplete={handleComplete}
          onProfileDataUpdate={handleProfileDataUpdate}
          setBasicRecommendations={setBasicRecommendations}
        />
      </div>
    </div>
  );
};
