
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  language: 'en' | 'es';
}

export const StepProgress: React.FC<StepProgressProps> = ({ 
  currentStep, 
  totalSteps,
  stepLabels,
  language 
}) => {
  const progress = Math.round((currentStep / totalSteps) * 100);
  
  const t = {
    en: {
      step: "Step",
      of: "of"
    },
    es: {
      step: "Paso",
      of: "de"
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>{t[language].step} {Math.ceil(currentStep)} {t[language].of} {totalSteps}</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      
      <div className="relative">
        {/* Progress bar track */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between mt-4 px-[1%]">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === Math.floor(currentStep - 1);
            
            return (
              <div key={i} className="flex flex-col items-center">
                <motion.div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                      : isCurrent 
                        ? 'bg-emerald-100 border-2 border-emerald-400' 
                        : 'bg-gray-100 border-2 border-gray-200'
                  }`}
                  initial={false}
                  animate={
                    isCompleted 
                      ? { scale: [1.2, 1], backgroundColor: '#10b981' } 
                      : isCurrent 
                        ? { scale: [1, 1.1, 1] } 
                        : { scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <span className={`text-xs ${isCurrent ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {i + 1}
                    </span>
                  )}
                </motion.div>
                
                {stepLabels && (
                  <span className={`text-xs mt-1 ${
                    isCompleted 
                      ? 'text-emerald-600 font-medium' 
                      : isCurrent 
                        ? 'text-emerald-600' 
                        : 'text-gray-400'
                  }`}>
                    {stepLabels[i]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
