
import React, { useEffect, useState } from 'react';
import { UserProfileData } from '../types/wizardTypes';
import { StepContainer } from '../wizard-components/StepContainer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Brain, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DynamicQuestion {
  id: string;
  question: string;
  context?: string;
}

interface DynamicQuestionsStepProps {
  profileData: UserProfileData;
  updateProfileData: (data: Partial<UserProfileData>) => void;
  language: 'en' | 'es';
  currentStepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isStepValid: boolean;
}

export const DynamicQuestionsStep: React.FC<DynamicQuestionsStepProps> = ({
  profileData,
  updateProfileData,
  language,
  currentStepNumber,
  totalSteps,
  onNext,
  onPrevious,
  isStepValid
}) => {
  const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();

  const t = {
    en: {
      title: "Let's Dive Deeper",
      subtitle: "Based on your responses, we'd like to understand more about your creative journey",
      loadingQuestions: "AI is generating personalized questions for you...",
      questionOf: "Question {current} of {total}",
      placeholder: "Share your thoughts here...",
      next: "Next Question",
      previous: "Previous Question",
      complete: "Complete Assessment",
      answerRequired: "Please provide an answer before continuing",
      errorGenerating: "Unable to generate questions. Please try again.",
      skipStep: "Skip This Step"
    },
    es: {
      title: "Profundicemos Más",
      subtitle: "Basado en tus respuestas, nos gustaría entender más sobre tu viaje creativo",
      loadingQuestions: "La IA está generando preguntas personalizadas para ti...",
      questionOf: "Pregunta {current} de {total}",
      placeholder: "Comparte tus pensamientos aquí...",
      next: "Siguiente Pregunta",
      previous: "Pregunta Anterior",
      complete: "Completar Evaluación",
      answerRequired: "Por favor proporciona una respuesta antes de continuar",
      errorGenerating: "No se pudieron generar las preguntas. Inténtalo de nuevo.",
      skipStep: "Omitir Este Paso"
    }
  };

  // Generate dynamic questions based on user's profile data
  useEffect(() => {
    const generateDynamicQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        
        const { data, error } = await supabase.functions.invoke('generate-dynamic-questions', {
          body: {
            profileData,
            language
          }
        });

        if (error) {
          console.error('Error generating dynamic questions:', error);
          toast({
            title: t[language].errorGenerating,
            variant: 'destructive'
          });
          // Fallback to next step if questions can't be generated
          onNext();
          return;
        }

        if (data?.questions && Array.isArray(data.questions)) {
          const questionsWithIds = data.questions.map((q: any, index: number) => ({
            id: `dynamic_${index + 1}`,
            question: q.question,
            context: q.context
          }));
          setDynamicQuestions(questionsWithIds);
        } else {
          // No questions generated, skip to next step
          onNext();
        }
      } catch (error) {
        console.error('Error generating dynamic questions:', error);
        toast({
          title: t[language].errorGenerating,
          variant: 'destructive'
        });
        onNext();
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    generateDynamicQuestions();
  }, [profileData, language, toast, onNext]);

  const currentQuestion = dynamicQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === dynamicQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerChange = (value: string) => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: value
      }));
    }
  };

  const handleNext = () => {
    if (!currentQuestion) return;

    const currentAnswer = answers[currentQuestion.id]?.trim();
    if (!currentAnswer) {
      toast({
        title: t[language].answerRequired,
        variant: 'destructive'
      });
      return;
    }

    if (isLastQuestion) {
      // Save all dynamic answers to profile data
      updateProfileData({ 
        dynamicQuestionAnswers: answers 
      });
      onNext();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (isFirstQuestion) {
      onPrevious();
    } else {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    updateProfileData({ 
      dynamicQuestionAnswers: {} 
    });
    onNext();
  };

  if (isLoadingQuestions) {
    return (
      <StepContainer
        title={t[language].title}
        subtitle={t[language].subtitle}
      >
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
          <p className="text-lg text-gray-600 text-center">
            {t[language].loadingQuestions}
          </p>
        </div>
      </StepContainer>
    );
  }

  if (!currentQuestion || dynamicQuestions.length === 0) {
    // Skip if no questions were generated
    onNext();
    return null;
  }

  return (
    <StepContainer
      title={t[language].title}
      subtitle={t[language].subtitle}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-purple-600">
              {t[language].questionOf
                .replace('{current}', (currentQuestionIndex + 1).toString())
                .replace('{total}', dynamicQuestions.length.toString())}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              {t[language].skipStep}
            </Button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / dynamicQuestions.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200/50 shadow-lg p-8 mb-8"
        >
          {/* Context if available */}
          {currentQuestion.context && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-purple-700 italic">
                {currentQuestion.context}
              </p>
            </div>
          )}

          {/* Question */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {currentQuestion.question}
          </h3>

          {/* Answer textarea */}
          <Textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={t[language].placeholder}
            className="min-h-[120px] resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {isFirstQuestion ? 'Back' : t[language].previous}
          </Button>

          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white flex items-center gap-2"
          >
            {isLastQuestion ? t[language].complete : t[language].next}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </StepContainer>
  );
};
