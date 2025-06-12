
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { MotionLogo } from '@/components/MotionLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Progress } from '@/components/ui/progress';

interface MobileWizardLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  language: 'en' | 'es';
  showCharacter?: boolean;
  characterImage?: string;
  navigationSlot?: ReactNode;
}

export const MobileWizardLayout: React.FC<MobileWizardLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  title,
  subtitle,
  language,
  showCharacter = false,
  characterImage,
  navigationSlot
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <MotionLogo variant="dark" size="sm" />
            <LanguageSwitcher />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-gray-900 truncate flex-1 mr-2">
                {title}
              </h1>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
                {currentStep}/{totalSteps}
              </span>
            </div>
            
            {subtitle && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
            
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Character Image - Mobile */}
      {showCharacter && characterImage && (
        <div className="px-4 py-4 bg-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <img 
              src={characterImage} 
              alt="Cultural assessment guide"
              className="w-32 h-auto rounded-lg shadow-sm"
            />
          </motion.div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 min-h-[400px]"
        >
          {children}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      {navigationSlot && (
        <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3">
            {navigationSlot}
          </div>
        </div>
      )}
    </div>
  );
};
