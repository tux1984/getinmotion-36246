import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, Lightbulb } from 'lucide-react';

interface LocalIntelligentQuestionsProps {
  language: 'en' | 'es';
  onAnswersCompleted?: (answers: Record<string, string>) => void;
}

interface Question {
  id: string;
  question: string;
  type: 'text' | 'select';
  options?: string[];
  followUp?: string;
}

export const LocalIntelligentQuestions: React.FC<LocalIntelligentQuestionsProps> = ({
  language,
  onAnswersCompleted
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  const translations = {
    en: {
      title: 'Smart Business Questions',
      subtitle: 'Help us understand your business better',
      next: 'Next',
      finish: 'Finish',
      previous: 'Previous',
      placeholder: 'Your answer...',
      selectOption: 'Select an option...',
      thanksTitle: 'Thank you!',
      thanksMessage: 'Your answers will help us create better recommendations.',
      restart: 'Answer More Questions'
    },
    es: {
      title: 'Preguntas Inteligentes de Negocio',
      subtitle: 'Ayúdanos a entender mejor tu negocio',
      next: 'Siguiente',
      finish: 'Finalizar',
      previous: 'Anterior',
      placeholder: 'Tu respuesta...',
      selectOption: 'Selecciona una opción...',
      thanksTitle: '¡Gracias!',
      thanksMessage: 'Tus respuestas nos ayudarán a crear mejores recomendaciones.',
      restart: 'Responder Más Preguntas'
    }
  };

  const questions: Question[] = language === 'es' ? [
    {
      id: 'business_type',
      question: '¿Qué tipo de negocio tienes o quieres crear?',
      type: 'text',
      followUp: 'Excelente, esto nos ayuda a personalizar nuestras recomendaciones.'
    },
    {
      id: 'target_audience',
      question: '¿Quién es tu cliente ideal?',
      type: 'select',
      options: ['Jóvenes (18-30)', 'Adultos (30-50)', 'Familias', 'Empresas', 'Adultos mayores', 'Todos los públicos'],
      followUp: 'Perfecto, conocer tu audiencia es clave para el éxito.'
    },
    {
      id: 'main_challenge',
      question: '¿Cuál es tu mayor desafío empresarial actual?',
      type: 'select',
      options: ['Encontrar clientes', 'Precios y costos', 'Marketing digital', 'Gestión del tiempo', 'Competencia', 'Finanzas'],
      followUp: 'Entendemos este desafío, trabajemos juntos para resolverlo.'
    },
    {
      id: 'business_stage',
      question: '¿En qué etapa está tu negocio?',
      type: 'select',
      options: ['Solo una idea', 'Empezando', 'Ya tengo clientes', 'Creciendo', 'Establecido'],
      followUp: 'Esta información es muy valiosa para crear tu plan personalizado.'
    },
    {
      id: 'goals',
      question: '¿Cuál es tu principal objetivo para los próximos 3 meses?',
      type: 'text',
      followUp: '¡Excelente objetivo! Te ayudaremos a alcanzarlo paso a paso.'
    }
  ] : [
    {
      id: 'business_type',
      question: 'What type of business do you have or want to create?',
      type: 'text',
      followUp: 'Great, this helps us personalize our recommendations.'
    },
    {
      id: 'target_audience',
      question: 'Who is your ideal customer?',
      type: 'select',
      options: ['Young adults (18-30)', 'Adults (30-50)', 'Families', 'Businesses', 'Seniors', 'General public'],
      followUp: 'Perfect, knowing your audience is key to success.'
    },
    {
      id: 'main_challenge',
      question: 'What is your biggest business challenge right now?',
      type: 'select',
      options: ['Finding customers', 'Pricing & costs', 'Digital marketing', 'Time management', 'Competition', 'Finances'],
      followUp: 'We understand this challenge, let\'s work together to solve it.'
    },
    {
      id: 'business_stage',
      question: 'What stage is your business in?',
      type: 'select',
      options: ['Just an idea', 'Getting started', 'Have customers', 'Growing', 'Established'],
      followUp: 'This information is very valuable for creating your personalized plan.'
    },
    {
      id: 'goals',
      question: 'What is your main goal for the next 3 months?',
      type: 'text',
      followUp: 'Excellent goal! We\'ll help you achieve it step by step.'
    }
  ];

  const t = translations[language];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isComplete = currentQuestionIndex >= questions.length;

  const handleNext = () => {
    if (currentAnswer.trim()) {
      const newAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
      setAnswers(newAnswers);
      
      if (isLastQuestion) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        onAnswersCompleted?.(newAnswers);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentAnswer('');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevQuestion = questions[currentQuestionIndex - 1];
      setCurrentAnswer(answers[prevQuestion.id] || '');
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer('');
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t.thanksTitle}</h3>
            <p className="text-muted-foreground mb-6">{t.thanksMessage}</p>
          </div>
          <Button onClick={handleRestart} variant="outline">
            {t.restart}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          {t.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">
              {currentQuestion.question}
            </h3>
            
            {currentQuestion.type === 'text' ? (
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={t.placeholder}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground min-h-[100px] resize-none"
              />
            ) : (
              <select
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">{t.selectOption}</option>
                {currentQuestion.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestionIndex === 0}
            >
              {t.previous}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!currentAnswer.trim()}
              className="flex items-center gap-2"
            >
              {isLastQuestion ? t.finish : t.next}
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};