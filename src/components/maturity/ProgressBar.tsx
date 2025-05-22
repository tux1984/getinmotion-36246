
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100);
  
  // Generate step dots
  const steps = Array.from({ length: total }, (_, i) => i + 1);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          {steps.map(step => (
            <motion.div
              key={step}
              className={`relative rounded-full ${
                step <= current ? 'bg-purple-500' : 'bg-gray-200'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: step === current ? 1 : 0.8,
                backgroundColor: step === current 
                  ? ['rgb(168, 85, 247)', 'rgb(139, 92, 246)', 'rgb(168, 85, 247)'] 
                  : step < current 
                    ? 'rgb(168, 85, 247)' 
                    : 'rgb(229, 231, 235)'
              }}
              transition={{
                duration: step === current ? 1.5 : 0.3,
                repeat: step === current ? Infinity : 0,
                repeatType: "reverse"
              }}
              style={{
                width: step === current ? 12 : 8, 
                height: step === current ? 12 : 8
              }}
            >
              {step === current && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
        <span className="font-medium text-sm text-purple-700">
          {percentage}%
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
