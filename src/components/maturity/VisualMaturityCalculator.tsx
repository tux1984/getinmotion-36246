
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import { Language, ProfileType } from './types';
import { getQuestions } from './getQuestions';
import { ProgressBar } from './ProgressBar';
import { QuestionCard } from './QuestionCard';
import { CompletionScreen } from './CompletionScreen';

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

  const currentQuestion = questions[currentStep];

  if (isCompleted) {
    return <CompletionScreen language={language} />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-2 border-indigo-100 shadow-lg bg-white">
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-medium text-gray-900">
                {language === 'en' ? 'Maturity Assessment' : 'Evaluación de Madurez'}
              </h3>
              <span className="text-sm text-gray-500">
                {language === 'en' 
                  ? `Step ${currentStep + 1} of ${questions.length}` 
                  : `Paso ${currentStep + 1} de ${questions.length}`}
              </span>
            </div>
            
            <ProgressBar current={currentStep + 1} total={questions.length} />
          </div>
          
          <QuestionCard 
            question={currentQuestion}
            selectedValue={answers[currentQuestion.id]}
            onSelectOption={handleSelectOption}
          />
          
          <div className="flex justify-end pt-4 pb-2">
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {currentStep < questions.length - 1 
                ? (language === 'en' ? 'Next' : 'Siguiente')
                : (language === 'en' ? 'Complete' : 'Completar')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
