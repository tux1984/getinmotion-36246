
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
  isStepValid = true
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`w-full h-full flex flex-col ${className}`}
    >
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
      
      <div className="flex-1 flex flex-col md:flex-row gap-8">
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
          
          {/* Navigation buttons at the bottom of left column if needed */}
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
