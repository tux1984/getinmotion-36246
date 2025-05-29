
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Question, ProfileType, CategoryScore, CalculatorStep } from '@/components/maturity/types';
import { getQuestions } from '@/components/maturity/getQuestions';
import { QuestionCard } from '@/components/maturity/QuestionCard';
import { CheckboxQuestionCard } from '@/components/maturity/CheckboxQuestionCard';
import { MaturityResults } from '@/components/maturity/MaturityResults';

interface SimpleCulturalMaturityCalculatorProps {
  profileType: ProfileType;
  onComplete?: (scores: CategoryScore) => void;
  onBack?: () => void;
}

export const SimpleCulturalMaturityCalculator = ({ 
  profileType, 
  onComplete, 
  onBack 
}: SimpleCulturalMaturityCalculatorProps) => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<CalculatorStep>('ideaValidation');
  const [answers, setAnswers] = useState<Record<string, number | string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [categoryQuestions, setCategoryQuestions] = useState<Question[]>([]);
  const [showResults, setShowResults] = useState(false);

  const steps: CalculatorStep[] = ['ideaValidation', 'userExperience', 'marketFit', 'monetization', 'results'];
  const currentStepIndex = steps.indexOf(currentStep);

  const translations = {
    en: {
      title: 'Cultural Project Maturity Calculator',
      steps: {
        ideaValidation: 'Idea Validation',
        userExperience: 'User Experience',
        marketFit: 'Market Fit',
        monetization: 'Monetization',
        results: 'Results'
      },
      navigation: {
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish Assessment',
        restart: 'Restart Calculator'
      },
      progress: 'Progress',
      question: 'Question',
      of: 'of'
    },
    es: {
      title: 'Calculadora de Madurez de Proyectos Culturales',
      steps: {
        ideaValidation: 'Validación de Idea',
        userExperience: 'Experiencia de Usuario',
        marketFit: 'Ajuste al Mercado',
        monetization: 'Monetización',
        results: 'Resultados'
      },
      navigation: {
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        finish: 'Finalizar Evaluación',
        restart: 'Reiniciar Calculadora'
      },
      progress: 'Progreso',
      question: 'Pregunta',
      of: 'de'
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (currentStep !== 'results') {
      const questions = getQuestions(profileType, language);
      setCategoryQuestions(questions);
      setCurrentQuestionIndex(0);
    }
  }, [currentStep, profileType, language]);

  const handleSelectOption = (questionId: string, value: number | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateCategoryScore = (stepAnswers: Record<string, number | string[]>): number => {
    const validAnswers = Object.values(stepAnswers).filter((answer): answer is number => 
      typeof answer === 'number'
    );
    
    if (validAnswers.length === 0) return 0;
    
    const sum = validAnswers.reduce((acc, curr) => acc + curr, 0);
    const maxPossible = validAnswers.length * 3;
    return Math.round((sum / maxPossible) * 100);
  };

  const getCurrentStepAnswers = (): Record<string, number | string[]> => {
    const stepPrefix = `${profileType}_${currentStep}`;
    return Object.entries(answers)
      .filter(([key]) => key.startsWith(stepPrefix))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  };

  const canProceedToNext = (): boolean => {
    if (currentStep === 'results') return false;
    
    const currentQuestion = categoryQuestions[currentQuestionIndex];
    if (!currentQuestion) return false;
    
    return answers[currentQuestion.id] !== undefined;
  };

  const handleNext = () => {
    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < steps.length - 1) {
        setCurrentStep(steps[nextStepIndex]);
      } else {
        setCurrentStep('results');
        setShowResults(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setCurrentStep(prevStep);
      const prevQuestions = getQuestions(profileType, language);
      setCurrentQuestionIndex(prevQuestions.length - 1);
    }
  };

  const handleFinish = () => {
    const stepAnswers = getCurrentStepAnswers();
    
    // Convert mixed answers to numeric for calculation
    const numericAnswers: Record<string, number> = {};
    Object.entries(answers).forEach(([key, value]) => {
      if (typeof value === 'number') {
        numericAnswers[key] = value;
      } else if (Array.isArray(value)) {
        // For multi-select, use the length as the score
        numericAnswers[key] = Math.min(value.length, 3);
      }
    });
    
    const scores: CategoryScore = {
      ideaValidation: calculateCategoryScore(
        Object.fromEntries(
          Object.entries(numericAnswers).filter(([key]) => key.includes('ideaValidation'))
        )
      ),
      userExperience: calculateCategoryScore(
        Object.fromEntries(
          Object.entries(numericAnswers).filter(([key]) => key.includes('userExperience'))
        )
      ),
      marketFit: calculateCategoryScore(
        Object.fromEntries(
          Object.entries(numericAnswers).filter(([key]) => key.includes('marketFit'))
        )
      ),
      monetization: calculateCategoryScore(
        Object.fromEntries(
          Object.entries(numericAnswers).filter(([key]) => key.includes('monetization'))
        )
      )
    };
    
    onComplete?.(scores);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep('ideaValidation');
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const totalQuestions = steps.slice(0, -1).reduce((total, step) => {
    return total + getQuestions(profileType, language).length;
  }, 0);

  const completedQuestions = steps.slice(0, currentStepIndex).reduce((total, step) => {
    return total + getQuestions(profileType, language).length;
  }, 0) + currentQuestionIndex;

  const progressPercentage = Math.round((completedQuestions / totalQuestions) * 100);

  if (showResults) {
    // Convert mixed answers to numeric for results calculation
    const numericAnswers: Record<string, number> = {};
    Object.entries(answers).forEach(([key, value]) => {
      if (typeof value === 'number') {
        numericAnswers[key] = value;
      } else if (Array.isArray(value)) {
        // For multi-select, use the length as the score
        numericAnswers[key] = Math.min(value.length, 3);
      }
    });

    const scores: CategoryScore = {
      ideaValidation: calculateCategoryScore(
        Object.fromEntries(
          Object.entries(numericAnswers).filter(([key]) => key.includes('ideaValidation'))
        )
      ),
      userExperience: calculateCategoryScore(
        Object.fromEntries(
          Object.entries(numericAnswers).filter(([key]) => key.includes('userExperience'))
        )
      ),
      marketFit: calculateCategoryScore(
        Object.fromEntries(
          Object.entries(numericAnswers).filter(([key]) => key.includes('marketFit'))
        )
      ),
      monetization: calculateCategoryScore(
        Object.fromEntries(
          Object.entries(numericAnswers).filter(([key]) => key.includes('monetization'))
        )
      )
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-purple-800">
              {t.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MaturityResults 
              score={scores}
              profileType={profileType}
              language={language}
            />
            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={handleRestart} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t.navigation.restart}
              </Button>
              <Button onClick={handleFinish}>
                {t.navigation.finish}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = categoryQuestions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl font-bold text-purple-800">
              {t.title}
            </CardTitle>
            {onBack && (
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.navigation.back}
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t.progress}: {progressPercentage}%</span>
              <span>
                {t.question} {completedQuestions + 1} {t.of} {totalQuestions}
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            
            <div className="flex flex-wrap gap-2">
              {steps.slice(0, -1).map((step, index) => (
                <Badge 
                  key={step}
                  variant={index < currentStepIndex ? "default" : 
                          index === currentStepIndex ? "secondary" : "outline"}
                  className={index === currentStepIndex ? "bg-purple-100 text-purple-800" : ""}
                >
                  {t.steps[step]}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentQuestion.type === 'checkbox' ? (
            <CheckboxQuestionCard
              question={currentQuestion}
              selectedValues={answers[currentQuestion.id] as string[] || []}
              onSelectOption={(values) => handleSelectOption(currentQuestion.id, values)}
            />
          ) : (
            <QuestionCard
              question={currentQuestion}
              selectedValue={answers[currentQuestion.id] as number}
              onSelectOption={(value) => handleSelectOption(currentQuestion.id, value)}
            />
          )}
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentStepIndex === 0 && currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.navigation.previous}
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!canProceedToNext()}
            >
              {currentQuestionIndex === categoryQuestions.length - 1 && currentStepIndex === steps.length - 2
                ? t.navigation.finish
                : t.navigation.next}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
