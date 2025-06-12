
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface MobileWizardNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  language: 'en' | 'es';
  isValid: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

export const MobileWizardNavigation: React.FC<MobileWizardNavigationProps> = ({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  language,
  isValid,
  nextLabel,
  previousLabel
}) => {
  const { toast } = useToast();
  
  const t = {
    en: {
      next: nextLabel || 'Continue',
      previous: previousLabel || 'Back',
      finish: 'Finish',
      validationError: 'Please answer this question before continuing'
    },
    es: {
      next: nextLabel || 'Continuar',
      previous: previousLabel || 'Atrás',
      finish: 'Finalizar',
      validationError: 'Por favor responde esta pregunta antes de continuar'
    }
  };

  const handleNext = () => {
    if (!isValid) {
      toast({
        title: t[language].validationError,
        variant: "destructive"
      });
      return;
    }
    onNext();
  };

  if (isLastStep) {
    return null;
  }
  
  return (
    <motion.div 
      className="flex justify-between items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="flex items-center gap-2 px-6 py-3 text-base min-h-[52px] flex-1 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 disabled:opacity-50"
        size="lg"
      >
        <ArrowLeft className="w-4 h-4" />
        {t[language].previous}
      </Button>
      
      <Button
        onClick={handleNext}
        className="flex items-center gap-2 px-6 py-3 text-base min-h-[52px] flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md"
        size="lg"
      >
        {t[language].next}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};
