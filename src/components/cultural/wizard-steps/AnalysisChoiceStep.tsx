
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfileData } from '../types/wizardTypes';
import { StepContainer } from '../wizard-components/StepContainer';
import { StepProgress } from '../wizard-components/StepProgress';
import { WizardNavigation } from '../wizard-components/WizardNavigation';

interface AnalysisChoiceStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  currentStepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isStepValid: boolean;
}

export const AnalysisChoiceStep: React.FC<AnalysisChoiceStepProps> = ({
  profileData,
  updateProfileData,
  language,
  currentStepNumber,
  totalSteps,
  onNext,
  onPrevious,
  isStepValid,
}) => {
  const translations = {
    en: {
      title: "Choose Analysis Type",
      subtitle: "Select the level of detail you want for your maturity assessment",
      quick: {
        title: "Quick Analysis",
        description: "A simplified assessment with essential recommendations. Takes about 2 minutes."
      },
      detailed: {
        title: "Detailed Analysis",
        description: "A comprehensive assessment with in-depth recommendations. Takes about 5 minutes."
      }
    },
    es: {
      title: "Elige el Tipo de Análisis",
      subtitle: "Selecciona el nivel de detalle que deseas para tu evaluación de madurez",
      quick: {
        title: "Análisis Rápido",
        description: "Una evaluación simplificada con recomendaciones esenciales. Toma alrededor de 2 minutos."
      },
      detailed: {
        title: "Análisis Detallado",
        description: "Una evaluación completa con recomendaciones en profundidad. Toma alrededor de 5 minutos."
      }
    }
  };

  const t = translations[language];

  const handleSelectAnalysisType = (type: 'quick' | 'detailed') => {
    updateProfileData({ analysisPreference: type });
  };

  return (
    <StepContainer title={t.title} subtitle={t.subtitle}>
      <div className="flex flex-col space-y-8 w-full max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <StepProgress 
            currentStep={currentStepNumber} 
            totalSteps={totalSteps}
            language={language}
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-900 mt-6">{t.title}</h2>
          <p className="text-lg text-gray-600 mt-2">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Quick Analysis Option */}
          <AnalysisCard 
            title={t.quick.title}
            description={t.quick.description}
            isSelected={profileData.analysisPreference === 'quick'}
            onClick={() => handleSelectAnalysisType('quick')}
            image="/lovable-uploads/e5849e7b-cac1-4c76-9858-c7d5222cce96.png" // Analytics monster
          />

          {/* Detailed Analysis Option */}
          <AnalysisCard 
            title={t.detailed.title}
            description={t.detailed.description}
            isSelected={profileData.analysisPreference === 'detailed'}
            onClick={() => handleSelectAnalysisType('detailed')}
            image="/lovable-uploads/a2ebe4fd-31ed-43ec-9f9f-35fe6b529ad2.png" // Creative monster
          />
        </div>

        <WizardNavigation
          onNext={onNext}
          onPrevious={onPrevious}
          isFirstStep={false}
          isLastStep={false}
          language={language}
          currentStepId="analysisChoice"
          profileData={profileData}
          isValid={isStepValid}
        />
      </div>
    </StepContainer>
  );
};

interface AnalysisCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  image: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  description,
  isSelected,
  onClick,
  image
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'ring-4 ring-purple-500 bg-white shadow-purple-300'
          : 'bg-white hover:shadow-xl'
      }`}
      onClick={onClick}
    >
      <div className="h-32 sm:h-40 overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <img
          src={image}
          alt={title}
          className="w-28 h-28 object-contain transform transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-lg font-bold text-purple-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        
        {isSelected && (
          <div className="absolute top-3 right-3 bg-purple-600 text-white p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
};
