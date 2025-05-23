
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  showMaturityStep: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  showMaturityStep
}) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      next: "Next",
      skip: "Skip",
      complete: "Go to Dashboard",
      back: "Back",
    },
    es: {
      next: "Siguiente",
      skip: "Omitir",
      complete: "Ir al Panel",
      back: "Atrás",
    }
  };
  
  const t = translations[language];
  
  if (showMaturityStep) {
    return null; // No buttons during maturity calculation step
  }
  
  return (
    <div className="flex justify-between">
      {currentStep > 0 && (
        <Button 
          variant="outline"
          onClick={onPrevious}
        >
          {t.back}
        </Button>
      )}
      
      <div className="flex-1" />
      
      <Button 
        variant="outline" 
        onClick={onSkip}
        className="mr-2"
      >
        {t.skip}
      </Button>
      
      <Button onClick={onNext}>
        {currentStep < totalSteps - 1 ? t.next : t.complete}
      </Button>
    </div>
  );
};
