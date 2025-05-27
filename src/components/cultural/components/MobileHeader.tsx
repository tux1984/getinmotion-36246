
import React from 'react';
import { ProgressBar } from '@/components/maturity/ProgressBar';

interface MobileHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  language: 'en' | 'es';
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  currentStep,
  totalSteps,
  language
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-purple-100 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-purple-900 truncate flex-1 mr-2">
          {title}
        </h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
          {language === 'en' 
            ? `${currentStep}/${totalSteps}` 
            : `${currentStep}/${totalSteps}`}
        </span>
      </div>
      
      <ProgressBar current={currentStep} total={totalSteps} />
    </div>
  );
};
