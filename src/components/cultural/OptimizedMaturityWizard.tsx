import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import { CategoryScore } from '@/types/dashboard';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  category: keyof CategoryScore;
  options: { value: number; label: string }[];
}

const questions: Question[] = [
  {
    id: 'validation_1',
    question: '¿Qué tan validada está tu idea de negocio?',
    category: 'ideaValidation',
    options: [
      { value: 1, label: 'Solo es una idea en mi mente' },
      { value: 2, label: 'He hablado con algunos conocidos' },
      { value: 3, label: 'He hecho encuestas básicas' },
      { value: 4, label: 'Tengo feedback de clientes potenciales' },
      { value: 5, label: 'Tengo pruebas de mercado exitosas' }
    ]
  },
  {
    id: 'ux_1',
    question: '¿Cómo defines la experiencia de usuario actual?',
    category: 'userExperience',
    options: [
      { value: 1, label: 'No tengo producto aún' },
      { value: 2, label: 'Prototipo básico sin testing' },
      { value: 3, label: 'Producto funcional básico' },
      { value: 4, label: 'Producto con feedback de usuarios' },
      { value: 5, label: 'Experiencia optimizada y validada' }
    ]
  },
  {
    id: 'market_1',
    question: '¿Qué tan bien conoces tu mercado objetivo?',
    category: 'marketFit',
    options: [
      { value: 1, label: 'Tengo una idea general' },
      { value: 2, label: 'He investigado competidores' },
      { value: 3, label: 'Conozco mi segmento objetivo' },
      { value: 4, label: 'He validado el tamaño del mercado' },
      { value: 5, label: 'Tengo estrategia de penetración clara' }
    ]
  },
  {
    id: 'monetization_1',
    question: '¿Cuál es el estado de tu modelo de monetización?',
    category: 'monetization',
    options: [
      { value: 1, label: 'No he definido cómo generar ingresos' },
      { value: 2, label: 'Tengo ideas de modelos de negocio' },
      { value: 3, label: 'He definido mi modelo principal' },
      { value: 4, label: 'Tengo múltiples fuentes planificadas' },
      { value: 5, label: 'Estoy generando ingresos consistentes' }
    ]
  }
];

interface OptimizedMaturityWizardProps {
  onComplete: (scores: CategoryScore) => void;
}

export const OptimizedMaturityWizard: React.FC<OptimizedMaturityWizardProps> = ({ onComplete }) => {
  const { user } = useRobustAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = useCallback((questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeWizard();
    }
  }, [currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const completeWizard = useCallback(() => {
    const scores: CategoryScore = {
      ideaValidation: Math.round(answers.validation_1 * 20) || 20,
      userExperience: Math.round(answers.ux_1 * 20) || 20,
      marketFit: Math.round(answers.market_1 * 20) || 20,
      monetization: Math.round(answers.monetization_1 * 20) || 20
    };

    setIsCompleted(true);
    toast.success('Test de madurez completado exitosamente');
    
    setTimeout(() => {
      onComplete(scores);
    }, 1500);
  }, [answers, onComplete]);

  const canProceed = answers[currentQuestion?.id] !== undefined;

  if (isCompleted) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">¡Test Completado!</h3>
        <p className="text-muted-foreground">
          Calculando tus puntuaciones de madurez...
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Test de Madurez Cultural</h2>
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} de {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-6">{currentQuestion.question}</h3>
        
        <RadioGroup
          value={answers[currentQuestion.id]?.toString() || ''}
          onValueChange={(value) => handleAnswer(currentQuestion.id, parseInt(value))}
          className="space-y-3"
        >
          {currentQuestion.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value.toString()} id={`${currentQuestion.id}_${option.value}`} />
              <Label 
                htmlFor={`${currentQuestion.id}_${option.value}`} 
                className="text-sm leading-relaxed cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Anterior
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed}
        >
          {currentStep === questions.length - 1 ? 'Completar' : 'Siguiente'}
        </Button>
      </div>
    </Card>
  );
};