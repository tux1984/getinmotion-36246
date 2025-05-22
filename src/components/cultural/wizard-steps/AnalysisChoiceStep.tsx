
import React from 'react';
import { UserProfileData } from '../CulturalMaturityWizard';
import { StepContainer } from '../wizard-components/StepContainer';
import { Button } from '@/components/ui/button';
import { Lightbulb, Brain, ArrowRight } from 'lucide-react';

interface AnalysisChoiceStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
}

export const AnalysisChoiceStep: React.FC<AnalysisChoiceStepProps> = ({ 
  profileData, 
  updateProfileData, 
  language 
}) => {
  const t = {
    en: {
      title: "Choose Your Path",
      subtitle: "How would you like to proceed with your assessment?",
      quickTitle: "Quick Recommendation",
      quickDesc: "Get agent recommendations based on what you've told us so far.",
      quickButton: "Quick Recommendation",
      detailedTitle: "Detailed Analysis",
      detailedDesc: "Answer a few more questions for a more tailored experience.",
      detailedButton: "Detailed Analysis"
    },
    es: {
      title: "Elige tu Camino",
      subtitle: "¿Cómo te gustaría continuar con tu evaluación?",
      quickTitle: "Recomendación Rápida",
      quickDesc: "Obtén recomendaciones de agentes basadas en lo que nos has contado hasta ahora.",
      quickButton: "Recomendación Rápida",
      detailedTitle: "Análisis Detallado",
      detailedDesc: "Responde algunas preguntas más para una experiencia más personalizada.",
      detailedButton: "Análisis Detallado"
    }
  };
  
  const handleQuickChoice = () => {
    updateProfileData({ analysisPreference: 'quick' });
  };
  
  const handleDetailedChoice = () => {
    updateProfileData({ analysisPreference: 'detailed' });
  };
  
  return (
    <StepContainer
      title={t[language].title}
      subtitle={t[language].subtitle}
    >
      <div className="flex flex-col md:flex-row gap-6 pt-6">
        <div className="flex-1 bg-indigo-50 rounded-xl p-6 border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all">
          <div className="flex flex-col h-full">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">{t[language].quickTitle}</h3>
            <p className="text-gray-600 mb-6 flex-grow">{t[language].quickDesc}</p>
            <Button 
              className="mt-auto gap-2 bg-indigo-600 hover:bg-indigo-700"
              onClick={handleQuickChoice}
            >
              {t[language].quickButton}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 bg-purple-50 rounded-xl p-6 border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all">
          <div className="flex flex-col h-full">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">{t[language].detailedTitle}</h3>
            <p className="text-gray-600 mb-6 flex-grow">{t[language].detailedDesc}</p>
            <Button 
              className="mt-auto gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={handleDetailedChoice}
            >
              {t[language].detailedButton}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};
