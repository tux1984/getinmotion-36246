
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface WizardNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  language: 'en' | 'es';
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  language
}) => {
  const t = {
    en: {
      next: 'Continue',
      previous: 'Back',
    },
    es: {
      next: 'Continuar',
      previous: 'Atrás',
    }
  };

  if (isLastStep) {
    return null;
  }
  
  return (
    <motion.div 
      className="flex justify-between mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
      >
        <ArrowLeft className="w-4 h-4" />
        {t[language].previous}
      </Button>
      <Button
        onClick={onNext}
        className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md px-6 py-6 text-lg rounded-xl"
      >
        {t[language].next}
        <ArrowRight className="w-5 h-5" />
      </Button>
    </motion.div>
  );
};
