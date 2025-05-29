
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionCard } from '@/components/maturity/QuestionCard';
import { ProfileTypeSelector } from './ProfileTypeSelector';
import { BifurcationChoice } from './BifurcationChoice';
import { ResultsDisplay } from './ResultsDisplay';
import { OptimizedCharacterImage } from './OptimizedCharacterImage';
import { useIsMobile } from '@/hooks/use-mobile';

interface StepContentContainerProps {
  currentStep: string;
  currentQuestionIndex: number;
  questions: any[];
  extendedQuestions: any[];
  profileType: any;
  answers: any;
  extendedAnswers: any;
  analysisType: 'quick' | 'deep' | null;
  scores: any;
  recommendedAgents: any;
  language: 'en' | 'es';
  t: any;
  characterImage: string;
  nextCharacterImage?: string;
  onProfileSelect: (type: any) => void;
  onSelectOption: (id: string, value: number) => void;
  onAnalysisChoice: (type: 'quick' | 'deep') => void;
  onComplete: () => void;
}

export const StepContentContainer: React.FC<StepContentContainerProps> = ({
  currentStep,
  currentQuestionIndex,
  questions,
  extendedQuestions,
  profileType,
  answers,
  extendedAnswers,
  analysisType,
  scores,
  recommendedAgents,
  language,
  t,
  characterImage,
  nextCharacterImage,
  onProfileSelect,
  onSelectOption,
  onAnalysisChoice,
  onComplete
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex gap-6 items-start ${isMobile ? 'flex-col gap-4' : ''}`}>
      {/* Character Image - Smaller on desktop, hidden on mobile */}
      {!isMobile && (
        <div className="w-1/4 flex-shrink-0">
          <OptimizedCharacterImage
            src={characterImage}
            alt="Character"
            preloadNext={nextCharacterImage}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {currentStep === 'profileType' && (
            <motion.div
              key="profileType"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileTypeSelector
                profileType={profileType}
                onSelect={onProfileSelect}
                t={t}
              />
            </motion.div>
          )}

          {currentStep === 'questions' && questions[currentQuestionIndex] && (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QuestionCard 
                question={questions[currentQuestionIndex]}
                selectedValue={answers[questions[currentQuestionIndex].id]}
                onSelectOption={onSelectOption}
              />
            </motion.div>
          )}

          {currentStep === 'bifurcation' && (
            <motion.div
              key="bifurcation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <BifurcationChoice
                language={language}
                selectedType={analysisType}
                onSelect={onAnalysisChoice}
              />
            </motion.div>
          )}

          {currentStep === 'extendedQuestions' && extendedQuestions[currentQuestionIndex] && (
            <motion.div
              key={`extended-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <QuestionCard 
                question={extendedQuestions[currentQuestionIndex]}
                selectedValue={extendedAnswers[extendedQuestions[currentQuestionIndex].id]}
                onSelectOption={onSelectOption}
              />
            </motion.div>
          )}

          {currentStep === 'results' && scores && recommendedAgents && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ResultsDisplay
                scores={scores}
                recommendedAgents={recommendedAgents}
                t={t}
                language={language}
                onComplete={onComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
