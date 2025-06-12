import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';
import { Language, ProfileType } from './types';
import { getQuestions } from './getQuestions';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { CompletionScreen } from './CompletionScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileWizardLayout } from '../cultural/components/MobileWizardLayout';
import { MobileWizardNavigation } from '../cultural/wizard-components/MobileWizardNavigation';

interface VisualMaturityCalculatorProps {
  language: Language;
  profileType?: ProfileType;
  onComplete: (scores: Record<string, number>, total: number) => void;
}

export const VisualMaturityCalculator: React.FC<VisualMaturityCalculatorProps> = ({ 
  language, 
  profileType,
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const questions = getQuestions(language, profileType);

  const handleSelectOption = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    
    if (!answers[currentQuestion.id]) {
      toast({
        title: language === 'en' ? 'Please select an option' : 'Por favor, selecciona una opción',
        variant: 'destructive'
      });
      return;
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate total score
      const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
      const maxPossibleScore = questions.length * 3; // Assuming 3 is max value
      const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);
      
      // Call the completion callback with scores
      onComplete(answers, percentageScore);
      setIsCompleted(true);
      
      toast({
        title: language === 'en' ? 'Assessment completed!' : '¡Evaluación completada!',
        description: language === 'en' 
          ? `Your maturity score: ${percentageScore}%` 
          : `Tu puntuación de madurez: ${percentageScore}%`
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Convert the Question type from getQuestions to match QuestionCard's expected format
  const adaptQuestionForCard = (question: any) => ({
    id: question.id,
    title: question.question, // Map 'question' property to 'title'
    subtitle: undefined,
    options: question.options
  });

  const currentQuestion = adaptQuestionForCard(questions[currentStep]);

  if (isCompleted) {
    return <CompletionScreen language={language} />;
  }

  // Mobile Layout
  if (isMobile) {
    const navigationSlot = (
      <MobileWizardNavigation
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirstStep={currentStep === 0}
        isLastStep={currentStep >= questions.length - 1}
        language={language}
        isValid={!!answers[currentQuestion.id]}
        nextLabel={currentStep < questions.length - 1 
          ? (language === 'en' ? 'Next' : 'Siguiente')
          : (language === 'en' ? 'Complete' : 'Completar')}
      />
    );

    return (
      <MobileWizardLayout
        currentStep={currentStep + 1}
        totalSteps={questions.length}
        title={language === 'en' ? 'Cultural Maturity Assessment' : 'Evaluación de Madurez Cultural'}
        language={language}
        navigationSlot={navigationSlot}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard 
              question={currentQuestion}
              selectedValue={answers[currentQuestion.id]}
              onSelectOption={handleSelectOption}
            />
          </motion.div>
        </AnimatePresence>
      </MobileWizardLayout>
    );
  }

  // Desktop Layout - keep existing
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-2 border-purple-100 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm">
        <CardContent className="pt-8 px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-purple-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                {language === 'en' ? 'Cultural Maturity Assessment' : 'Evaluación de Madurez Cultural'}
              </h3>
              <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                {language === 'en' 
                  ? `Question ${currentStep + 1} of ${questions.length}` 
                  : `Pregunta ${currentStep + 1} de ${questions.length}`}
              </span>
            </div>
            
            <ProgressBar current={currentStep + 1} total={questions.length} />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard 
                question={currentQuestion}
                selectedValue={answers[currentQuestion.id]}
                onSelectOption={handleSelectOption}
              />
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-end pt-6 pb-4">
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-lg px-6 py-6 rounded-xl shadow-md shadow-purple-200 hover:shadow-lg hover:shadow-purple-300 transition-all"
            >
              {currentStep < questions.length - 1 
                ? (language === 'en' ? 'Next Question' : 'Siguiente Pregunta')
                : (language === 'en' ? 'Complete Assessment' : 'Completar Evaluación')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
