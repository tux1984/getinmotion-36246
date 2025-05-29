
import React from 'react';
import { ProgressBar } from '@/components/maturity/ProgressBar';
import { ExitDialog } from './ExitDialog';
import { MobileHeader } from './MobileHeader';

interface CalculatorHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  language: 'en' | 'es';
  onExit: () => void;
  isMobile: boolean;
}

export const CalculatorHeader: React.FC<CalculatorHeaderProps> = ({
  title,
  currentStep,
  totalSteps,
  language,
  onExit,
  isMobile
}) => {
  if (isMobile) {
    return (
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-purple-100">
        <MobileHeader 
          title={title}
          currentStep={currentStep}
          totalSteps={totalSteps}
          language={language}
        />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-purple-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          {title}
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            {language === 'en' 
              ? `Step ${currentStep} of ${totalSteps}` 
              : `Paso ${currentStep} de ${totalSteps}`}
          </span>
          <ExitDialog language={language} onExit={onExit} />
        </div>
      </div>
      
      <ProgressBar current={currentStep} total={totalSteps} />
    </div>
  );
};
