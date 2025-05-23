
import React, { useEffect } from 'react';
import { ProductMaturityCalculator } from '@/components/ProductMaturityCalculator';
import { CategoryScore } from '@/components/maturity/types';
import { useLanguage } from '@/context/LanguageContext';

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
        <div className="max-w-4xl mx-auto">
          <ProductMaturityCalculator 
            onComplete={onComplete}
            open={showCalculator}
            onOpenChange={setShowCalculator}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">
            {language === 'en' ? "Processing your answers..." : "Procesando tus respuestas..."}
          </p>
        </div>
      )}
    </div>
  );
};
