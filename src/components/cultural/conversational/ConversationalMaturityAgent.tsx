import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { UserProfileData } from '../types/wizardTypes';
import { AgentHeader } from './components/AgentHeader';
import { ConversationFlow } from './components/ConversationFlow';
import { ProgressSaving } from './components/ProgressSaving';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useConversationalAgent } from './hooks/useConversationalAgent';

interface AIQuestion {
  question: string;
  context: string;
}

interface ConversationalMaturityAgentProps {
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, profileData: UserProfileData, aiQuestions?: AIQuestion[]) => void;
  language: 'en' | 'es';
}

export const ConversationalMaturityAgent: React.FC<ConversationalMaturityAgentProps> = ({
  onComplete,
  language
}) => {
  const {
    currentBlock,
    profileData,
    insights,
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
    getBlockProgress
  } = useConversationalAgent(language, onComplete);

  const [showResults, setShowResults] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Auto-save progress
  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      saveProgress();
    }
  }, [profileData, saveProgress]);

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
          <p className="text-muted-foreground">Loading conversation blocks...</p>
        </div>
      </motion.div>
    );
  }

  if (showResults) {
    return (
      <ResultsDisplay
        profileData={profileData}
        maturityLevel={maturityLevel}
        personalizedTasks={personalizedTasks}
        language={language}
        onComplete={completeAssessment}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto min-h-screen"
    >
      {/* Agent Header */}
      <AgentHeader
        language={language}
        currentBlock={currentBlock}
        progress={getBlockProgress()}
      />

      {/* Progress Saving Indicator */}
      <ProgressSaving language={language} />

      {/* Main Conversation Flow */}
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <ConversationFlow
            key={currentBlock.id}
            block={currentBlock}
            profileData={profileData}
            insights={insights}
            language={language}
            onAnswer={answerQuestion}
            onNext={goToNextBlock}
            onPrevious={goToPreviousBlock}
            updateProfileData={updateProfileData}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};