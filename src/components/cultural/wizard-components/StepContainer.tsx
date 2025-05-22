
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
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left column with question content */}
        <div className="flex-1">
          <div className="text-left mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-2">
              {title}
            </h2>
            {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
          </div>
          
          <div className="w-full">
            {children}
          </div>
        </div>
        
        {/* Right column with illustration */}
        {illustration && (
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
            <div className="rounded-xl overflow-hidden shadow-md">
              <img 
                src={illustration} 
                alt="Step illustration"
                className="w-full h-auto object-cover" 
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
