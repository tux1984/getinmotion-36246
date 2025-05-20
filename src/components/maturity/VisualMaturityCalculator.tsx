
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, ArrowRight, Lightbulb, User, Users } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    value: number;
    icon?: React.ReactNode;
  }[];
}

interface VisualMaturityCalculatorProps {
  language: 'en' | 'es';
  profileType?: 'idea' | 'solo' | 'team';
  onComplete: (scores: Record<string, number>, total: number) => void;
}

const getQuestions = (language: 'en' | 'es', profileType?: 'idea' | 'solo' | 'team'): Question[] => {
  // Common questions for all profiles
  const commonQuestions = {
    en: [
      {
        id: 'vision',
        question: 'How clear is your project vision?',
        options: [
          { id: 'vision-1', text: 'Just starting to form ideas', value: 1, icon: <Lightbulb size={20} /> },
          { id: 'vision-2', text: 'I have a general direction', value: 2, icon: <Lightbulb size={20} /> },
          { id: 'vision-3', text: 'Very clear and documented', value: 3, icon: <Lightbulb size={20} /> }
        ]
      },
      {
        id: 'audience',
        question: 'How well do you know your audience?',
        options: [
          { id: 'audience-1', text: 'Not sure who they are yet', value: 1, icon: <User size={20} /> },
          { id: 'audience-2', text: 'Have a general idea', value: 2, icon: <User size={20} /> },
          { id: 'audience-3', text: 'Clear understanding with data', value: 3, icon: <Users size={20} /> }
        ]
      }
    ],
    es: [
      {
        id: 'vision',
        question: '¿Qué tan clara es la visión de tu proyecto?',
        options: [
          { id: 'vision-1', text: 'Recién empiezo a formar ideas', value: 1, icon: <Lightbulb size={20} /> },
          { id: 'vision-2', text: 'Tengo una dirección general', value: 2, icon: <Lightbulb size={20} /> },
          { id: 'vision-3', text: 'Muy clara y documentada', value: 3, icon: <Lightbulb size={20} /> }
        ]
      },
      {
        id: 'audience',
        question: '¿Qué tan bien conoces a tu audiencia?',
        options: [
          { id: 'audience-1', text: 'Aún no estoy seguro/a quiénes son', value: 1, icon: <User size={20} /> },
          { id: 'audience-2', text: 'Tengo una idea general', value: 2, icon: <User size={20} /> },
          { id: 'audience-3', text: 'Entendimiento claro con datos', value: 3, icon: <Users size={20} /> }
        ]
      }
    ]
  };

  // Profile-specific questions
  const profileQuestions = {
    idea: {
      en: [
        {
          id: 'research',
          question: 'Have you done market research?',
          options: [
            { id: 'research-1', text: 'Not yet', value: 1 },
            { id: 'research-2', text: 'Some basic research', value: 2 },
            { id: 'research-3', text: 'Extensive research', value: 3 }
          ]
        }
      ],
      es: [
        {
          id: 'research',
          question: '¿Has realizado investigación de mercado?',
          options: [
            { id: 'research-1', text: 'Todavía no', value: 1 },
            { id: 'research-2', text: 'Algo de investigación básica', value: 2 },
            { id: 'research-3', text: 'Investigación extensa', value: 3 }
          ]
        }
      ]
    },
    solo: {
      en: [
        {
          id: 'processes',
          question: 'Do you have defined workflows?',
          options: [
            { id: 'processes-1', text: 'Ad-hoc as I go', value: 1 },
            { id: 'processes-2', text: 'Some processes defined', value: 2 },
            { id: 'processes-3', text: 'Well-documented processes', value: 3 }
          ]
        }
      ],
      es: [
        {
          id: 'processes',
          question: '¿Tienes flujos de trabajo definidos?',
          options: [
            { id: 'processes-1', text: 'Improvisados sobre la marcha', value: 1 },
            { id: 'processes-2', text: 'Algunos procesos definidos', value: 2 },
            { id: 'processes-3', text: 'Procesos bien documentados', value: 3 }
          ]
        }
      ]
    },
    team: {
      en: [
        {
          id: 'team',
          question: 'How organized is your team?',
          options: [
            { id: 'team-1', text: 'We're figuring it out', value: 1 },
            { id: 'team-2', text: 'Some structure but could improve', value: 2 },
            { id: 'team-3', text: 'Clear roles and responsibilities', value: 3 }
          ]
        }
      ],
      es: [
        {
          id: 'team',
          question: '¿Qué tan organizado está tu equipo?',
          options: [
            { id: 'team-1', text: 'Estamos resolviéndolo', value: 1 },
            { id: 'team-2', text: 'Algo de estructura pero podríamos mejorar', value: 2 },
            { id: 'team-3', text: 'Roles y responsabilidades claras', value: 3 }
          ]
        }
      ]
    }
  };

  // Combine common questions with profile-specific questions if a profile type is provided
  let questions = [...commonQuestions[language]];
  
  if (profileType && profileQuestions[profileType]) {
    questions = [...questions, ...profileQuestions[profileType][language]];
  }

  return questions;
};

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

  return (
    <div className="w-full max-w-3xl mx-auto">
      {!isCompleted ? (
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
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 ease-out"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="py-4">
              <h4 className="text-lg font-medium mb-4">{currentQuestion.question}</h4>
              
              <RadioGroup>
                <div className="grid gap-4">
                  {currentQuestion.options.map(option => (
                    <div 
                      key={option.id}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${answers[currentQuestion.id] === option.value 
                          ? 'border-purple-400 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-200'}`}
                      onClick={() => handleSelectOption(currentQuestion.id, option.value)}
                    >
                      <RadioGroupItem 
                        value={option.id} 
                        id={option.id}
                        checked={answers[currentQuestion.id] === option.value}
                        className="mr-3"
                      />
                      <div className="flex items-center flex-1">
                        {option.icon && <span className="mr-3 text-purple-600">{option.icon}</span>}
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                      {answers[currentQuestion.id] === option.value && (
                        <CheckCircle2 className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            
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
      ) : (
        <div className="text-center p-8">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Assessment Completed!' : '¡Evaluación Completada!'}
          </h3>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Your results are being analyzed...' 
              : 'Tus resultados están siendo analizados...'}
          </p>
        </div>
      )}
    </div>
  );
};
