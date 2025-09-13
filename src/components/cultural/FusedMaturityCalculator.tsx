import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { UserProfileData } from './types/wizardTypes';
import { AgentHeader } from './conversational/components/AgentHeader';
import { IntelligentConversationFlow } from './conversational/components/IntelligentConversationFlow';
import { CreativeResultsDisplay } from './conversational/components/CreativeResultsDisplay';
import { useFusedMaturityAgent } from './hooks/useFusedMaturityAgent';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';

interface AIQuestion {
  question: string;
  context: string;
}

interface FusedMaturityCalculatorProps {
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, profileData: UserProfileData, aiQuestions?: AIQuestion[]) => void;
}

export const FusedMaturityCalculator: React.FC<FusedMaturityCalculatorProps> = ({
  onComplete
}) => {
  const { language } = useLanguage();
  const compatibleLanguage = mapToLegacyLanguage(language);
  
  const {
    currentBlock,
    profileData,
    isCompleted,
    maturityLevel,
    personalizedTasks,
    updateProfileData,
    answerQuestion,
    goToNextBlock,
    goToPreviousBlock,
    saveProgress,
    loadProgress,
    completeAssessment,
    getBlockProgress,
    businessType
  } = useFusedMaturityAgent(compatibleLanguage, onComplete);

  const [showResults, setShowResults] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Show results when completed
  useEffect(() => {
    if (isCompleted) {
      setShowResults(true);
    }
  }, [isCompleted]);

  // Show loading if currentBlock is not available
  if (!currentBlock) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto min-h-screen p-8"
      >
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-muted-foreground mt-4">
            Preparing your personalized experience...
          </p>
        </div>
      </motion.div>
    );
  }

  if (showResults) {
    return (
        <CreativeResultsDisplay
          profileData={profileData}
          maturityLevel={maturityLevel}
          personalizedTasks={personalizedTasks}
          language={compatibleLanguage}
          businessType={businessType}
          onComplete={completeAssessment}
        />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto min-h-screen px-4 sm:px-6"
    >
      {/* Clean Agent Header */}
      <AgentHeader
        language={compatibleLanguage}
        currentBlock={currentBlock}
        progress={getBlockProgress().percentage}
        businessType={businessType}
      />

      {/* Main Intelligent Conversation Flow */}
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-border/50">
        <AnimatePresence mode="wait">
            <IntelligentConversationFlow
              key={currentBlock.id}
              block={currentBlock}
              profileData={profileData}
              language={compatibleLanguage}
              onAnswer={answerQuestion}
              onNext={goToNextBlock}
              onPrevious={goToPreviousBlock}
              updateProfileData={updateProfileData}
              businessType={businessType}
            />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};