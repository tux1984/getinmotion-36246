
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StepContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  illustration?: string;
  industry?: string;
  fullWidth?: boolean;
}

export const StepContainer: React.FC<StepContainerProps> = ({ 
  title, 
  subtitle,
  children,
  className = "",
  illustration,
  industry,
  fullWidth = false
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`w-full max-w-4xl mx-auto ${className}`}
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-2">
          {title}
        </h2>
        {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
      </div>
      
      <div className="w-full">
        {children}
      </div>
      
      {illustration && (
        <div className="mt-6 flex justify-center">
          <img 
            src={illustration} 
            alt="Step illustration"
            className="max-h-40 opacity-70" 
          />
        </div>
      )}
    </motion.div>
  );
};
