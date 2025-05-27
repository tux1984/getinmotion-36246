
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Brain } from 'lucide-react';
import { UserProfileData } from '../types/wizardTypes';

interface BifurcationStepProps {
  profileData: UserProfileData;
  language: 'en' | 'es';
  selectedAnalysisType: 'quick' | 'deep' | null;
  onAnalysisChoice: (type: 'quick' | 'deep') => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStepNumber: number;
  totalSteps: number;
}

export const BifurcationStep: React.FC<BifurcationStepProps> = ({
  language,
  selectedAnalysisType,
  onAnalysisChoice,
  onNext,
  onPrevious,
  currentStepNumber,
  totalSteps
}) => {
  const translations = {
    en: {
      title: "Choose Your Analysis Type",
      subtitle: "Do you want a quick recommendation or would you prefer a deeper analysis?",
      quickTitle: "Quick Recommendation",
      quickDesc: "Get 2-3 personalized agents based on your current answers",
      deepTitle: "Deep Analysis", 
      deepDesc: "Answer additional questions for a more detailed recommendation",
      previous: "Back",
      continue: "Continue"
    },
    es: {
      title: "Elegí tu Tipo de Análisis",
      subtitle: "¿Querés una recomendación rápida o preferís un análisis más profundo?",
      quickTitle: "Recomendación Rápida",
      quickDesc: "Obtené 2-3 agentes personalizados basados en tus respuestas actuales",
      deepTitle: "Análisis Profundo",
      deepDesc: "Respondé preguntas adicionales para una recomendación más detallada",
      previous: "Atrás",
      continue: "Continuar"
    }
  };

  const t = translations[language];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            {language === 'en' ? `Step ${currentStepNumber} of ${totalSteps}` : `Paso ${currentStepNumber} de ${totalSteps}`}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-purple-800 mb-4">{t.title}</h2>
        <p className="text-lg text-gray-600">{t.subtitle}</p>
      </div>

      {/* Analysis Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8 mb-12"
      >
        {/* Quick Analysis */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnalysisChoice('quick')}
          className={`p-8 rounded-2xl border-2 transition-all text-left ${
            selectedAnalysisType === 'quick' 
              ? 'border-purple-500 bg-purple-50 shadow-lg' 
              : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              selectedAnalysisType === 'quick' ? 'bg-purple-500' : 'bg-purple-100'
            }`}>
              <Zap className={`h-8 w-8 ${
                selectedAnalysisType === 'quick' ? 'text-white' : 'text-purple-500'
              }`} />
            </div>
            <h3 className="text-xl font-bold text-purple-800 mb-3">{t.quickTitle}</h3>
            <p className="text-gray-600 leading-relaxed">{t.quickDesc}</p>
          </div>
        </motion.button>

        {/* Deep Analysis */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAnalysisChoice('deep')}
          className={`p-8 rounded-2xl border-2 transition-all text-left ${
            selectedAnalysisType === 'deep' 
              ? 'border-purple-500 bg-purple-50 shadow-lg' 
              : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              selectedAnalysisType === 'deep' ? 'bg-purple-500' : 'bg-purple-100'
            }`}>
              <Brain className={`h-8 w-8 ${
                selectedAnalysisType === 'deep' ? 'text-white' : 'text-purple-500'
              }`} />
            </div>
            <h3 className="text-xl font-bold text-purple-800 mb-3">{t.deepTitle}</h3>
            <p className="text-gray-600 leading-relaxed">{t.deepDesc}</p>
          </div>
        </motion.button>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="px-6 py-3"
        >
          {t.previous}
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!selectedAnalysisType}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3"
        >
          {t.continue}
        </Button>
      </div>
    </div>
  );
};
