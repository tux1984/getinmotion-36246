
import React from 'react';
import { SimpleCulturalMaturityCalculator } from '@/components/cultural/SimpleCulturalMaturityCalculator';
import { CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { mapToLegacyLanguage } from '@/utils/languageMapper';

interface MaturityStepProps {
  showCalculator: boolean;
  setShowCalculator: (show: boolean) => void;
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

export const MaturityStep: React.FC<MaturityStepProps> = ({ 
  showCalculator, 
  setShowCalculator, 
  onComplete
}) => {
  const { language } = useLanguage();
  const compatibleLanguage = mapToLegacyLanguage(language);
  
  return (
    <div className="w-full">
      {showCalculator ? (
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SimpleCulturalMaturityCalculator 
            language={compatibleLanguage}
            onComplete={onComplete}
          />
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-12 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="animate-spin w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-6"></div>
          <p className="text-xl font-medium text-purple-800">
            {compatibleLanguage === 'en' ? "Processing your answers..." : "Procesando tus respuestas..."}
          </p>
          <p className="text-gray-500 mt-2">
            {compatibleLanguage === 'en' ? "This will only take a moment" : "Esto solo tomará un momento"}
          </p>
        </motion.div>
      )}
    </div>
  );
};
