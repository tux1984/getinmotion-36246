
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
  navigationSlot?: ReactNode;
}

export const MobileWizardLayout: React.FC<MobileWizardLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  title,
  subtitle,
  language,
  navigationSlot
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="px-4 py-3">
          {/* Top Row: Logo and Language Switcher */}
          <div className="flex justify-between items-center mb-3">
            <MotionLogo variant="dark" size="sm" />
            <LanguageSwitcher />
          </div>
          
          {/* Title and Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                {currentStep}/{totalSteps}
              </span>
            </div>
            
            {subtitle && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
            
            <Progress value={progressPercentage} className="h-2 bg-gray-100" />
          </div>
        </div>
      </div>

      {/* Content Area with top padding for fixed header - Single Column Layout */}
      <div className="flex-1 pt-28 pb-24">
        {/* Main Content - Single Column */}
        <div className="px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      {navigationSlot && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4">
            {navigationSlot}
          </div>
        </div>
      )}
    </div>
  );
};
