
import React from 'react';
import { motion } from 'framer-motion';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  language: 'en' | 'es';
}

export const StepProgress: React.FC<StepProgressProps> = ({ 
  currentStep, 
  totalSteps,
  language 
}) => {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-500 font-medium">
          {currentStep} of {totalSteps}
        </p>
      </div>
      
      <div className="flex w-full">
        {/* Step indicators */}
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < currentStep - 1;
          const isCurrent = i === currentStep - 1;
          const isLast = i === totalSteps - 1;
          
          return (
            <div 
              key={i} 
              className="relative flex-1 flex items-center"
            >
              {/* Step circle */}
              <motion.div 
                className={`h-2 w-2 rounded-full ${
                  isCompleted || isCurrent 
                    ? 'bg-teal-500' 
                    : 'bg-gray-200'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Connecting line */}
              {!isLast && (
                <div className="flex-1 h-[2px] mx-1">
                  <motion.div 
                    className={`h-full ${
                      isCompleted ? 'bg-teal-500' : 'bg-gray-200'
                    }`}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
