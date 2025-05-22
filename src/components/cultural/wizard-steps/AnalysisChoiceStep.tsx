
import React from 'react';
import { UserProfileData } from '../types/wizardTypes';
import { StepContainer } from '../wizard-components/StepContainer';
import { Button } from '@/components/ui/button';
import { Lightbulb, Brain, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <motion.div 
        className="flex flex-col lg:flex-row gap-8 pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-indigo-50 rounded-2xl p-8 border border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all"
        >
          <div className="flex flex-col h-full">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Lightbulb className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-indigo-800">{t[language].quickTitle}</h3>
            <p className="text-gray-600 mb-8 flex-grow text-lg">{t[language].quickDesc}</p>
            <Button 
              className="mt-auto gap-3 bg-indigo-600 hover:bg-indigo-700 text-lg py-6 px-8 rounded-xl"
              onClick={handleQuickChoice}
            >
              {t[language].quickButton}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-purple-50 rounded-2xl p-8 border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all"
        >
          <div className="flex flex-col h-full">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-purple-800">{t[language].detailedTitle}</h3>
            <p className="text-gray-600 mb-8 flex-grow text-lg">{t[language].detailedDesc}</p>
            <Button 
              className="mt-auto gap-3 bg-purple-600 hover:bg-purple-700 text-lg py-6 px-8 rounded-xl"
              onClick={handleDetailedChoice}
            >
              {t[language].detailedButton}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </StepContainer>
  );
};
