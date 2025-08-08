import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, ArrowRight, ArrowLeft, Brain, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationBlock } from '../types/conversationalTypes';
import { UserProfileData } from '../../types/wizardTypes';
import { QuestionRenderer } from './QuestionRenderer';

interface IntelligentConversationFlowProps {
  block: ConversationBlock;
  profileData: UserProfileData;
  language: 'en' | 'es';
  onAnswer: (questionId: string, answer: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  businessType?: string;
}

export const IntelligentConversationFlow: React.FC<IntelligentConversationFlowProps> = ({
  block,
  profileData,
  language,
  onAnswer,
  onNext,
  onPrevious,
  updateProfileData,
  businessType = 'creative'
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset question index when block changes
  useEffect(() => {
    console.log('IntelligentConversationFlow: Block changed', { 
      blockId: block.id, 
      questionsLength: block.questions?.length 
    });
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
  }, [block.id]);


  const translations = {
    en: {
      next: "Next",
      previous: "Previous", 
      whatIsThis: "What is this?",
      lastQuestion: "Continue to next section"
    },
    es: {
      next: "Siguiente",
      previous: "Anterior",
      whatIsThis: "¿Qué es esto?",
      lastQuestion: "Continuar a la siguiente sección"
    }
  };

  const t = translations[language];
  
  // Defensive checks
  if (!block || !block.questions || block.questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse">
          <Brain className="w-8 h-8 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            {language === 'es' ? 'Preparando preguntas inteligentes...' : 'Preparing intelligent questions...'}
          </p>
        </div>
      </div>
    );
  }
  
  const currentQuestion = block.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === block.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  if (!currentQuestion) {
    console.error('IntelligentConversationFlow: currentQuestion is undefined');
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">
          {language === 'es' ? 'Error cargando pregunta. Por favor recarga la página.' : 'Error loading question. Please refresh the page.'}
        </p>
      </div>
    );
  }

  const handleQuestionAnswer = (answer: any) => {
    console.log('IntelligentConversationFlow: handleQuestionAnswer', { 
      questionId: currentQuestion.id, 
      answer 
    });
    
    onAnswer(currentQuestion.id, answer);
    
    // No auto-advance - let user control navigation with buttons
    // This improves UX by removing confusion between auto-advance and manual buttons
  };

  const evaluateConditionalLogic = (question: any, answer: any, profileData: UserProfileData): boolean => {
    // Implement conditional logic based on question dependencies
    if (question.showIf) {
      const condition = question.showIf;
      const fieldValue = profileData[condition.field];
      
      // Evaluate condition
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'includes':
          return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        default:
          return true;
      }
    }
    
    return true; // No conditional logic, proceed normally
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onNext();
    } else {
      // Check if next question should be shown based on conditional logic
      let nextIndex = currentQuestionIndex + 1;
      while (nextIndex < block.questions.length) {
        const nextQuestion = block.questions[nextIndex];
        if (evaluateConditionalLogic(nextQuestion, null, profileData)) {
          break;
        }
        nextIndex++;
      }
      
      if (nextIndex >= block.questions.length) {
        onNext(); // No more valid questions, go to next section
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      onPrevious();
    } else {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const isQuestionAnswered = (question: any) => {
    const fieldValue = profileData[question.fieldName];
    
    // Handle different question types
    if (question.type === 'multiple-choice' && Array.isArray(fieldValue)) {
      return fieldValue.length > 0;
    }
    
    if (question.type === 'slider' || question.type === 'rating') {
      return fieldValue !== undefined && fieldValue !== null && fieldValue > 0;
    }
    
    if (question.type === 'text-input' || question.type === 'text' || question.type === 'textarea') {
      return fieldValue !== undefined && fieldValue !== null && 
             typeof fieldValue === 'string' && fieldValue.trim() !== '';
    }
    
    if (question.type === 'yes-no') {
      return fieldValue !== undefined && fieldValue !== null;
    }
    
    // For single-choice questions
    return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >

      {/* Strategic Context */}
      {block.strategicContext && (
        <div className="px-6 py-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">
                {language === 'es' ? 'Por qué pregunto esto:' : 'Why I\'m asking this:'}
              </strong>{' '}
              {block.strategicContext}
            </p>
          </div>
        </div>
      )}

      {/* Question Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {language === 'es' ? 'Pregunta' : 'Question'} {currentQuestionIndex + 1} {language === 'es' ? 'de' : 'of'} {block.questions.length}
                </span>
                {currentQuestion.explanation && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="text-xs"
                  >
                    {t.whatIsThis}
                  </Button>
                )}
              </div>
              
              <h4 className="text-lg font-semibold text-foreground mb-3">
                {currentQuestion.question}
              </h4>
              
              {/* Question Explanation */}
              <AnimatePresence>
                {showExplanation && currentQuestion.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-4 bg-accent/10 rounded-lg border border-accent/20"
                  >
                    <p className="text-sm text-muted-foreground">
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Question Renderer */}
            <QuestionRenderer
              question={currentQuestion}
              value={profileData[currentQuestion.fieldName]}
              onAnswer={handleQuestionAnswer}
              language={language}
            />
          </motion.div>
        </AnimatePresence>
      </div>


      {/* Enhanced Navigation */}
      <div className="px-6 py-4 bg-muted/20 border-t border-border/50">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion && currentQuestionIndex === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.previous}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} / {block.questions.length}
            </span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentQuestionIndex + 1) / block.questions.length) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {currentQuestion.required && !isQuestionAnswered(currentQuestion) && (
              <span className="text-xs text-destructive font-medium">
                {language === 'es' ? 'Respuesta requerida' : 'Answer required'}
              </span>
            )}
            <Button
              onClick={handleNext}
              disabled={currentQuestion.required && !isQuestionAnswered(currentQuestion)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastQuestion ? t.lastQuestion : t.next}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};