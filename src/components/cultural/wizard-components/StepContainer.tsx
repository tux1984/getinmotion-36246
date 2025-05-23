
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
      className={`w-full max-w-5xl mx-auto ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column with all content */}
        <div className="flex-1 flex flex-col">
          <div className="text-left mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-2">
              {title}
            </h2>
            {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
          </div>
          
          <div className="flex-1">
            {children}
          </div>
        </div>
        
        {/* Right column with illustration */}
        {illustration && (
          <div className="w-full md:w-2/5 h-auto">
            <div className="rounded-2xl overflow-hidden shadow-lg h-full">
              <img 
                src={illustration} 
                alt="Step illustration"
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
