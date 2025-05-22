
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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-purple-800 font-semibold text-lg">{t[language].step}</span>
          <motion.div 
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-xl shadow-md shadow-purple-200"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            key={currentStep}
          >
            {Math.ceil(currentStep)}
          </motion.div>
          <span className="text-gray-500 text-lg">{t[language].of} {totalSteps}</span>
        </div>
        
        <motion.span 
          className="font-medium text-lg text-purple-700"
          key={progress}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
      
      <div className="relative">
        {/* Progress bar track */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Step indicators - only showing if we have step labels */}
        {stepLabels && (
          <div className="absolute top-0 left-0 w-full flex justify-between mt-6 px-[1%]">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const isCompleted = i < currentStep - 1;
              const isCurrent = i === Math.floor(currentStep - 1);
              
              return (
                <div key={i} className="flex flex-col items-center">
                  <motion.div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md' 
                        : isCurrent 
                          ? 'bg-purple-100 border-2 border-purple-400 shadow-sm' 
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
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className={`text-sm ${isCurrent ? 'text-purple-600' : 'text-gray-500'}`}>
                        {i + 1}
                      </span>
                    )}
                  </motion.div>
                  
                  {stepLabels[i] && (
                    <span className={`text-xs mt-2 ${
                      isCompleted 
                        ? 'text-purple-600 font-medium' 
                        : isCurrent 
                          ? 'text-purple-600' 
                          : 'text-gray-400'
                    }`}>
                      {stepLabels[i]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
