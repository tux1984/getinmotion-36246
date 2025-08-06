import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { UserProfileData } from '../../types/wizardTypes';
import { AgentHeader } from './AgentHeader';
import { IntelligentConversationFlow } from './IntelligentConversationFlow';
import { ProgressSaving } from './ProgressSaving';
import { CreativeResultsDisplay } from './CreativeResultsDisplay';
import { useEnhancedConversationalAgent } from '../hooks/useEnhancedConversationalAgent';

interface AIQuestion {
  question: string;
  context: string;
}

interface EnhancedConversationalAgentProps {
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents, profileData: UserProfileData, aiQuestions?: AIQuestion[]) => void;
  language: 'en' | 'es';
}

export const EnhancedConversationalAgent: React.FC<EnhancedConversationalAgentProps> = ({
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
    getBlockProgress,
    isGenerating,
    generateContextualQuestions,
    personalizationCount,
    currentPersonalizationContext,
    businessType,
    agentPersonality
  } = useEnhancedConversationalAgent(language, onComplete);

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
          <div className="animate-pulse">
            <div className="h-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-muted-foreground mt-4">
            {language === 'es' ? 'Preparando tu experiencia personalizada...' : 'Preparing your personalized experience...'}
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
        language={language}
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
      className="max-w-4xl mx-auto min-h-screen"
    >
      {/* Enhanced Agent Header with personality */}
      <AgentHeader
        language={language}
        currentBlock={currentBlock}
        progress={getBlockProgress().percentage}
        businessType={businessType}
        agentPersonality={agentPersonality}
        personalizationCount={personalizationCount}
      />

      {/* Progress Saving Indicator */}
      <ProgressSaving language={language} />

      {/* Main Intelligent Conversation Flow */}
      <div className="bg-background/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-border/50">
        <AnimatePresence mode="wait">
          <IntelligentConversationFlow
            key={currentBlock.id}
            block={currentBlock}
            profileData={profileData}
            insights={insights}
            language={language}
            onAnswer={answerQuestion}
            onNext={goToNextBlock}
            onPrevious={goToPreviousBlock}
            updateProfileData={updateProfileData}
            isGenerating={isGenerating}
            generateContextualQuestions={generateContextualQuestions}
            personalizationCount={personalizationCount}
            currentPersonalizationContext={currentPersonalizationContext}
            businessType={businessType}
            agentPersonality={agentPersonality}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};