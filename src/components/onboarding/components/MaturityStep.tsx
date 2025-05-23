
import React from 'react';
import { ProductMaturityCalculator } from '@/components/ProductMaturityCalculator';
import { CategoryScore } from '@/components/maturity/types';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

interface MaturityStepProps {
  showCalculator: boolean;
  setShowCalculator: (show: boolean) => void;
  onComplete: (scores: CategoryScore) => void;
}

export const MaturityStep: React.FC<MaturityStepProps> = ({ 
  showCalculator, 
  setShowCalculator, 
  onComplete
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="w-full">
      {showCalculator ? (
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ProductMaturityCalculator 
            onComplete={onComplete}
            open={showCalculator}
            onOpenChange={setShowCalculator}
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
            {language === 'en' ? "Processing your answers..." : "Procesando tus respuestas..."}
          </p>
          <p className="text-gray-500 mt-2">
            {language === 'en' ? "This will only take a moment" : "Esto solo tomará un momento"}
          </p>
        </motion.div>
      )}
    </div>
  );
};
