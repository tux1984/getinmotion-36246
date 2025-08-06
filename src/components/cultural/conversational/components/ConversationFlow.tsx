import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, HelpCircle, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationBlock, QuestionType } from '../types/conversationalTypes';
import { UserProfileData } from '../../types/wizardTypes';
import { QuestionRenderer } from './QuestionRenderer';
import { InsightDisplay } from './InsightDisplay';

interface ConversationFlowProps {
  block: ConversationBlock;
  profileData: UserProfileData;
  insights: string[];
  language: 'en' | 'es';
  onAnswer: (questionId: string, answer: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  isGenerating?: boolean;
  generateContextualQuestions?: (params: any) => Promise<any[]>;
}

export const ConversationFlow: React.FC<ConversationFlowProps> = ({
  block,
  profileData,
  insights,
  language,
  onAnswer,
  onNext,
  onPrevious,
  updateProfileData,
  isGenerating = false,
  generateContextualQuestions
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset question index when block changes
  useEffect(() => {
    console.log('ConversationFlow: Block changed, resetting question index', { 
      blockId: block.id, 
      questionsLength: block.questions?.length 
    });
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
  }, [block.id]);

  const translations = {
    en: {
      next: "Continue",
      previous: "Previous",
      whatIsThis: "What is this?",
      insight: "Agent Insight",
      lastQuestion: "Complete this section"
    },
    es: {
      next: "Continuar",
      previous: "Anterior",
      whatIsThis: "¿Qué es esto?",
      insight: "Insight del Agente",
      lastQuestion: "Completar esta sección"
    }
  };

  const t = translations[language];
  
  // Add defensive checks to prevent undefined errors
  if (!block || !block.questions || block.questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Loading questions...</p>
      </div>
    );
  }
  
  const currentQuestion = block.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === block.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  // Additional check for currentQuestion
  if (!currentQuestion) {
    console.error('ConversationFlow: currentQuestion is undefined', {
      currentQuestionIndex,
      totalQuestions: block.questions.length,
      blockId: block.id
    });
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Error loading question. Please refresh the page.</p>
      </div>
    );
  }

  const handleQuestionAnswer = (answer: any) => {
    console.log('ConversationFlow: handleQuestionAnswer', { 
      currentQuestionIndex, 
      totalQuestions: block.questions.length,
      isLastQuestion,
      blockId: block.id 
    });
    
    onAnswer(currentQuestion.id, answer);
    
    // Strict validation before setTimeout to prevent index overflow
    if (!isLastQuestion && currentQuestionIndex + 1 < block.questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => {
          const newIndex = prev + 1;
          console.log('ConversationFlow: Setting new question index via setTimeout', { prev, newIndex, maxIndex: block.questions.length - 1 });
          // Additional safety check in case state changed during timeout
          if (newIndex < block.questions.length) {
            return newIndex;
          }
          return prev; // Don't change if it would exceed bounds
        });
      }, 800);
    }
  };

  const handleNext = () => {
    console.log('ConversationFlow: handleNext', { 
      currentQuestionIndex, 
      isLastQuestion, 
      totalQuestions: block.questions.length 
    });
    
    if (isLastQuestion) {
      // Reset question index when moving to next block
      setCurrentQuestionIndex(0);
      onNext();
    } else if (currentQuestionIndex + 1 < block.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    console.log('ConversationFlow: handlePrevious', { 
      currentQuestionIndex, 
      isFirstQuestion 
    });
    
    if (isFirstQuestion) {
      // Reset question index when moving to previous block
      setCurrentQuestionIndex(0);
      onPrevious();
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isQuestionAnswered = () => {
    const fieldName = currentQuestion.fieldName;
    return profileData[fieldName as keyof UserProfileData] !== undefined;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="bg-muted/50 rounded-2xl rounded-tl-none p-4 flex-1">
            <p className="text-foreground font-medium mb-2">{block.agentMessage}</p>
            <p className="text-muted-foreground text-sm">{block.strategicContext}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-muted-foreground hover:text-foreground mb-4"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          {t.whatIsThis}
        </Button>

        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
          >
            <p className="text-sm text-blue-700 dark:text-blue-300">{currentQuestion.explanation}</p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h3 className="text-xl font-semibold text-foreground mb-4">
          {currentQuestion.question}
        </h3>

        <QuestionRenderer
          question={currentQuestion}
          value={profileData[currentQuestion.fieldName as keyof UserProfileData]}
          onChange={handleQuestionAnswer}
          language={language}
        />
      </motion.div>

      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-muted-foreground">{t.insight}</span>
          </div>
          <InsightDisplay insights={insights} language={language} />
        </motion.div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 && block.id === 'whatYouDo'}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.previous}
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{currentQuestionIndex + 1} / {block.questions.length}</span>
        </div>

        <Button
          onClick={handleNext}
          disabled={!isQuestionAnswered()}
          className="flex items-center gap-2"
        >
          {isLastQuestion ? t.lastQuestion : t.next}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};