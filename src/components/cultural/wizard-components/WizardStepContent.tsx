import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfileData } from '../types/wizardTypes';
import { WizardStepId } from '../hooks/useMaturityWizard';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { StepContentRenderer, pageVariants } from './StepContentRenderer';

interface AIRecommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Alta' | 'Media' | 'Baja';
  timeframe: string;
}

interface WizardStepContentProps {
  currentStepId: WizardStepId;
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  calculateMaturityScores: () => CategoryScore;
  getRecommendedAgents: (scores: CategoryScore) => RecommendedAgents;
  onComplete: (scores?: CategoryScore, recommendedAgents?: RecommendedAgents, aiRecommendations?: AIRecommendation[]) => void;
  currentStepNumber: number;
  totalSteps: number;
  handleNext: () => void;
  handlePrevious: () => void;
  isCurrentStepValid: () => boolean;
  // New props for bifurcation
  showBifurcation?: boolean;
  analysisType?: 'quick' | 'deep' | null;
  handleAnalysisChoice?: (type: 'quick' | 'deep') => void;
}

export const WizardStepContent: React.FC<WizardStepContentProps> = (props) => {
  return (
    <motion.div
      key={props.currentStepId}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="w-full min-h-[400px]"
    >
      <StepContentRenderer {...props} />
    </motion.div>
  );
};
