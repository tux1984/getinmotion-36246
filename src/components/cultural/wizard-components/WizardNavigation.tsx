
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { UserProfileData } from '../types/wizardTypes';

interface WizardNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  language: 'en' | 'es';
  currentStepId: string;
  profileData: UserProfileData;
  isValid: boolean;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  language,
  currentStepId,
  profileData,
  isValid
}) => {
  const { toast } = useToast();
  
  const t = {
    en: {
      next: 'Continue',
      previous: 'Back',
      validationError: 'Please answer this question before continuing'
    },
    es: {
      next: 'Continuar',
      previous: 'Atrás',
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
      className="flex justify-between mt-8 md:mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="gap-2 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 px-6 py-2 text-base rounded-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        {t[language].previous}
      </Button>
      
      <motion.div
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={handleNext}
          className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md px-6 py-2 text-base rounded-lg"
        >
          {t[language].next}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
