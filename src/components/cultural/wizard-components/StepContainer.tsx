
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { StepProgress } from './StepProgress';
import { WizardNavigation } from './WizardNavigation';

interface StepContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  illustration?: string;
  industry?: string;
  fullWidth?: boolean;
  currentStep?: number;
  totalSteps?: number;
  language?: 'en' | 'es';
  showNavigation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  currentStepId?: string;
  profileData?: any;
  isStepValid?: boolean;
  stickyHeader?: ReactNode;
}

export const StepContainer: React.FC<StepContainerProps> = ({ 
  title, 
  subtitle,
  children,
  className = "",
  illustration,
  industry,
  fullWidth = false,
  currentStep,
  totalSteps,
  language = 'en',
  showNavigation = false,
  onNext,
  onPrevious,
  isFirstStep = false,
  currentStepId = '',
  profileData,
  isStepValid = true,
  stickyHeader
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`w-full h-full flex flex-col ${className}`}
    >
      {stickyHeader && (
        <div className="sticky top-0 z-10 w-full">
          {stickyHeader}
        </div>
      )}
      
      <div className="flex-1 flex flex-col md:flex-row gap-6 p-4">
        {/* Left column with all content */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Step progress indicator at the top if provided */}
            {currentStep && totalSteps && (
              <div className="mb-6">
                <StepProgress 
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  language={language}
                />
              </div>
            )}
            
            <div className="text-left mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-purple-800 mb-2">
                {title}
              </h2>
              {subtitle && <p className="text-gray-600 text-base">{subtitle}</p>}
            </div>
            
            <div className="flex-1">
              {children}
            </div>
            
            {/* Navigation buttons */}
            {showNavigation && onNext && onPrevious && (
              <div className="mt-8">
                <WizardNavigation 
                  onNext={onNext}
                  onPrevious={onPrevious}
                  isFirstStep={isFirstStep}
                  isLastStep={false}
                  language={language}
                  currentStepId={currentStepId}
                  profileData={profileData}
                  isValid={isStepValid}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Right column with illustration - Fixed width and responsive sizing */}
        {illustration && (
          <div className="w-full md:w-1/2 lg:w-2/5 h-auto md:min-h-[400px] flex justify-center items-center">
            <motion.div 
              className="relative w-full h-full min-h-[300px] md:min-h-[400px]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 100
              }}
            >
              <img 
                src={illustration} 
                alt="Step illustration"
                className="w-full h-full object-cover object-center rounded-xl" 
              />
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
