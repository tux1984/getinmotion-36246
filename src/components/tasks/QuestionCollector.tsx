import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AgentTask } from '@/hooks/types/agentTaskTypes';
import { MessageCircle, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

interface QuestionCollectorProps {
  task: AgentTask;
  onComplete: (answers: Array<{question: string, answer: string}>) => void;
  onBack: () => void;
}

interface IntelligentQuestion {
  question: string;
  context: string;
  category: string;
  type: 'text' | 'number' | 'url' | 'email';
}

export const QuestionCollector: React.FC<QuestionCollectorProps> = ({
  task,
  onComplete,
  onBack
}) => {
  const { user } = useRobustAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<IntelligentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Array<{question: string, answer: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);

  const translations = {
    en: {
      loading: 'Generating intelligent questions...',
      yourAnswer: 'Your answer',
      next: 'Next Question',
      previous: 'Previous',
      complete: 'Complete Collection',
      questionOf: 'Question {current} of {total}',
      answerRequired: 'Please provide an answer to continue',
      generatingNext: 'Analyzing your answer...',
      finalStep: 'Final question - we have enough information!'
    },
    es: {
      loading: 'Generando preguntas inteligentes...',
      yourAnswer: 'Tu respuesta',
      next: 'Siguiente Pregunta',
      previous: 'Anterior',
      complete: 'Completar Recolección',
      questionOf: 'Pregunta {current} de {total}',
      answerRequired: 'Por favor proporciona una respuesta para continuar',
      generatingNext: 'Analizando tu respuesta...',
      finalStep: '¡Última pregunta - tenemos suficiente información!'
    }
  };

  const t = translations[language];

  useEffect(() => {
    generateInitialQuestions();
  }, []);

  const generateInitialQuestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'generate_intelligent_questions',
          userId: user?.id,
          userProfile: {
            taskId: task.id,
            agentId: task.agent_id,
            taskTitle: task.title,
            taskDescription: task.description
          }
        }
      });

      if (error) throw error;

      const intelligentQuestions: IntelligentQuestion[] = data.questions.map((q: any) => ({
        question: q.question,
        context: q.context,
        category: q.category || 'general',
        type: q.type || 'text'
      }));

      setQuestions(intelligentQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: 'Error',
        description: language === 'en' ? 'Error generating questions' : 'Error al generar preguntas',
        variant: 'destructive',
      });
      
      // Fallback questions
      setQuestions([
        {
          question: language === 'en' 
            ? `Tell me more details about ${task.title}` 
            : `Cuéntame más detalles sobre ${task.title}`,
          context: 'General information gathering',
          category: 'overview',
          type: 'text'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNextQuestion = async (previousAnswers: Array<{question: string, answer: string}>) => {
    setIsGeneratingNext(true);
    try {
      const { data, error } = await supabase.functions.invoke('master-agent-coordinator', {
        body: {
          action: 'generate_intelligent_questions',
          userId: user?.id,
          userProfile: {
            taskId: task.id,
            agentId: task.agent_id,
            taskTitle: task.title,
            taskDescription: task.description,
            previousAnswers: previousAnswers
          }
        }
      });

      if (error) throw error;

      if (data.questions && data.questions.length > 0) {
        const newQuestion: IntelligentQuestion = {
          question: data.questions[0].question,
          context: data.questions[0].context,
          category: data.questions[0].category || 'followup',
          type: data.questions[0].type || 'text'
        };
        
        setQuestions(prev => [...prev, newQuestion]);
      }
    } catch (error) {
      console.error('Error generating next question:', error);
    } finally {
      setIsGeneratingNext(false);
    }
  };

  const handleNext = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: 'Error',
        description: t.answerRequired,
        variant: 'destructive',
      });
      return;
    }

    const newAnswer = {
      question: questions[currentQuestionIndex].question,
      answer: currentAnswer.trim()
    };

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = newAnswer;
    setAnswers(updatedAnswers);

    // If we're at the last question and have enough answers (3+), allow completion
    if (currentQuestionIndex === questions.length - 1 && updatedAnswers.length >= 3) {
      onComplete(updatedAnswers);
      return;
    }

    // If we need more questions, generate the next one
    if (currentQuestionIndex === questions.length - 1) {
      await generateNextQuestion(updatedAnswers);
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setCurrentAnswer(updatedAnswers[currentQuestionIndex + 1]?.answer || '');
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setCurrentAnswer(answers[currentQuestionIndex - 1]?.answer || '');
    }
  };

  const handleComplete = () => {
    if (!currentAnswer.trim()) {
      toast({
        title: 'Error',
        description: t.answerRequired,
        variant: 'destructive',
      });
      return;
    }

    const finalAnswers = [...answers];
    finalAnswers[currentQuestionIndex] = {
      question: questions[currentQuestionIndex].question,
      answer: currentAnswer.trim()
    };

    onComplete(finalAnswers);
  };

  if (isLoading) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1 && answers.length >= 2;
  const canComplete = answers.length >= 3 || (answers.length >= 2 && isLastQuestion);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          {t.questionOf
            .replace('{current}', (currentQuestionIndex + 1).toString())
            .replace('{total}', Math.max(questions.length, currentQuestionIndex + 1).toString())
          }
        </span>
        {isLastQuestion && (
          <span className="text-sm text-primary font-medium">{t.finalStep}</span>
        )}
      </div>

      <Card className="p-6 border-border bg-card">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">{currentQuestion?.question}</h3>
              {currentQuestion?.context && (
                <p className="text-sm text-muted-foreground mb-4">{currentQuestion.context}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">{t.yourAnswer}</label>
            {currentQuestion?.type === 'text' ? (
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={language === 'en' ? 'Write your answer here...' : 'Escribe tu respuesta aquí...'}
                rows={4}
                className="resize-none"
              />
            ) : (
              <Input
                type={currentQuestion?.type === 'number' ? 'number' : currentQuestion?.type === 'email' ? 'email' : 'text'}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={language === 'en' ? 'Your answer...' : 'Tu respuesta...'}
              />
            )}
          </div>
        </div>
      </Card>

      {isGeneratingNext && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.generatingNext}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-between">
        <Button 
          variant="outline" 
          onClick={currentQuestionIndex === 0 ? onBack : handlePrevious}
          disabled={isGeneratingNext}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentQuestionIndex === 0 ? (language === 'en' ? 'Back' : 'Volver') : t.previous}
        </Button>

        <div className="flex gap-3">
          {canComplete && (
            <Button 
              onClick={handleComplete}
              disabled={!currentAnswer.trim() || isGeneratingNext}
              className="bg-primary hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {t.complete}
            </Button>
          )}
          
          {!isLastQuestion && (
            <Button 
              onClick={handleNext}
              disabled={!currentAnswer.trim() || isGeneratingNext}
              variant={canComplete ? "outline" : "default"}
            >
              {t.next}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};