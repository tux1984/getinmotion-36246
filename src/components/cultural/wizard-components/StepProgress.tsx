
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
      step: "Question",
      of: "of"
    },
    es: {
      step: "Pregunta",
      of: "de"
    }
  };
  
  return (
    <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-purple-100">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-purple-800 font-semibold text-lg">{t[language].step}</span>
          <motion.div 
            className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-md shadow-sm"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            key={currentStep}
          >
            {Math.ceil(currentStep)}
          </motion.div>
          <span className="text-gray-500 text-sm md:text-base">{t[language].of} {totalSteps}</span>
        </div>
        
        <motion.span 
          className="font-medium text-sm md:text-base text-purple-700"
          key={progress}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
      
      <div className="flex w-full justify-between relative">
        {/* Line container */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        
        {/* Step indicators */}
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < currentStep - 1;
          const isCurrent = i === Math.floor(currentStep - 1);
          
          return (
            <div 
              key={i} 
              className="z-10 flex flex-col items-center"
              style={{ width: `${100 / Math.max(totalSteps - 1, 1)}%`, flexShrink: 0 }}
            >
              {/* Colored line before current dot */}
              {i > 0 && (
                <motion.div 
                  className="absolute h-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 z-0" 
                  style={{ 
                    left: `${(100 / Math.max(totalSteps - 1, 1)) * (i - 1)}%`, 
                    width: `${100 / Math.max(totalSteps - 1, 1)}%`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: i < currentStep ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                />
              )}
              
              <motion.div 
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-sm shadow-purple-200' 
                    : isCurrent 
                      ? 'bg-white border-2 border-purple-500' 
                      : 'bg-gray-100 border-2 border-gray-200'
                }`}
                initial={false}
                animate={
                  isCompleted 
                    ? { scale: [1.2, 1], backgroundColor: '#8B5CF6' } 
                    : isCurrent 
                      ? { scale: [1, 1.1, 1] } 
                      : { scale: 1 }
                }
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <span className={`text-xs ${isCurrent ? 'text-purple-600' : 'text-gray-500'}`}>
                    {i + 1}
                  </span>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
