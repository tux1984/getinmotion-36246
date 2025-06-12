
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Step {
  title: string;
  description?: string;
}

interface StepsHeaderProps {
  currentStep: number;
  steps: Step[];
}

export const StepsHeader: React.FC<StepsHeaderProps> = ({ currentStep, steps }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Simplified mobile version
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">
            {steps[currentStep]?.title || 'Step'}
          </h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {currentStep + 1}/{steps.length}
          </span>
        </div>
        
        {steps[currentStep]?.description && (
          <p className="text-gray-600 text-sm mb-3">
            {steps[currentStep].description}
          </p>
        )}
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {steps[currentStep]?.title || 'Step'}
        </h2>
        <span className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>
      
      {steps[currentStep]?.description && (
        <p className="text-gray-600 text-sm mb-4">
          {steps[currentStep].description}
        </p>
      )}
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
