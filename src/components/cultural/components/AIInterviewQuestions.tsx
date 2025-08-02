import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AIQuestion {
  question: string;
  context: string;
}

interface AIInterviewQuestionsProps {
  questions: AIQuestion[];
  language: 'en' | 'es';
  isLoading?: boolean;
  onAnswersSubmit?: (answers: { question: string; answer: string }[]) => void;
}

export const AIInterviewQuestions: React.FC<AIInterviewQuestionsProps> = ({
  questions,
  language,
  isLoading = false,
  onAnswersSubmit
}) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const t = {
    en: {
      title: "Business Interview",
      subtitle: "Help us understand your venture better",
      noQuestions: "No questions available at this time",
      loading: "Preparing interview questions...",
      answerPlaceholder: "Your answer...",
      submitAnswers: "Submit Answers",
      optional: "Optional"
    },
    es: {
      title: "Entrevista de Negocio",
      subtitle: "Ayúdanos a entender mejor tu emprendimiento",
      noQuestions: "No hay preguntas disponibles en este momento",
      loading: "Preparando preguntas de entrevista...",
      answerPlaceholder: "Tu respuesta...",
      submitAnswers: "Enviar Respuestas",
      optional: "Opcional"
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({ ...prev, [index]: value }));
  };

  const handleSubmit = () => {
    if (onAnswersSubmit) {
      const formattedAnswers = questions.map((question, index) => ({
        question: question.question,
        answer: answers[index] || ''
      }));
      onAnswersSubmit(formattedAnswers);
    }
  };

  const hasAnswers = Object.values(answers).some(answer => answer.trim() !== '');

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-8"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          <span className="text-primary font-medium">{t[language].loading}</span>
        </div>
      </motion.div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-8 text-center"
      >
        <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">{t[language].noQuestions}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-8"
    >
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {t[language].title}
            </h3>
            <p className="text-sm text-muted-foreground">{t[language].subtitle}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="p-5 rounded-xl bg-muted/50 border border-border/30"
          >
            <div className="mb-3">
              <h4 className="font-medium text-foreground mb-1">
                {question.question}
              </h4>
              <p className="text-xs text-muted-foreground">
                {question.context} • {t[language].optional}
              </p>
            </div>
            
            <Textarea
              placeholder={t[language].answerPlaceholder}
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="min-h-[80px] resize-none bg-background/60 border-border/50 focus:border-primary/50"
            />
          </motion.div>
        ))}
        
        {hasAnswers && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end pt-4"
          >
            <Button 
              onClick={handleSubmit}
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{t[language].submitAnswers}</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};