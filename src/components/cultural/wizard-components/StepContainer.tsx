
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StepContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}

export const StepContainer: React.FC<StepContainerProps> = ({ 
  title, 
  subtitle,
  children,
  className = ""
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
          {title}
        </h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
};
