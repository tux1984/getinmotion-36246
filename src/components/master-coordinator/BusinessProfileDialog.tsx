import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageCircle, 
  Send, 
  CheckCircle,
  ArrowRight,
  Target,
  Building,
  Users,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserBusinessProfile } from '@/hooks/useUserBusinessProfile';

interface BusinessProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'en' | 'es';
}

interface Question {
  id: string;
  question: string;
  category: string;
  followUp?: string;
}

export const BusinessProfileDialog: React.FC<BusinessProfileDialogProps> = ({
  open,
  onOpenChange,
  language
}) => {
  const { user } = useAuth();
  const { businessProfile } = useUserBusinessProfile();
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'completion'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const translations = {
    en: {
      title: 'Tell me about your business',
      subtitle: 'Help me understand your business better to provide more personalized recommendations',
      intro: {
        title: 'Let\'s dive deeper into your business',
        description: 'I\'ll ask you a few intelligent questions to better understand your unique situation and generate more targeted tasks for your growth.',
        benefits: [
          'Get more personalized task recommendations',
          'Unlock industry-specific strategies',
          'Receive targeted growth opportunities',
          'Build a comprehensive business profile'
        ],
        startButton: 'Start Business Deep Dive'
      },
      questions: {
        progress: 'Question {{current}} of {{total}}',
        nextButton: 'Next Question',
        previousButton: 'Previous',
        finishButton: 'Complete Profile',
        placeholder: 'Type your answer here...',
        skipButton: 'Skip this question'
      },
      completion: {
        title: 'Profile Enhanced Successfully!',
        description: 'Your business profile has been updated. I\'ll now generate new personalized tasks based on your insights.',
        tasksGenerated: 'New tasks will appear in your coordinator shortly',
        closeButton: 'Close'
      },
      generating: 'Generating intelligent questions...'
    },
    es: {
      title: 'Cuéntame sobre tu negocio',
      subtitle: 'Ayúdame a entender mejor tu negocio para brindarte recomendaciones más personalizadas',
      intro: {
        title: 'Profundicemos en tu negocio',
        description: 'Te haré algunas preguntas inteligentes para entender mejor tu situación única y generar tareas más específicas para tu crecimiento.',
        benefits: [
          'Obtén recomendaciones de tareas más personalizadas',
          'Desbloquea estrategias específicas de la industria',
          'Recibe oportunidades de crecimiento dirigidas',
          'Construye un perfil empresarial completo'
        ],
        startButton: 'Comenzar Análisis Profundo'
      },
      questions: {
        progress: 'Pregunta {{current}} de {{total}}',
        nextButton: 'Siguiente Pregunta',
        previousButton: 'Anterior',
        finishButton: 'Completar Perfil',
        placeholder: 'Escribe tu respuesta aquí...',
        skipButton: 'Saltar esta pregunta'
      },
      completion: {
        title: '¡Perfil Mejorado Exitosamente!',
        description: 'Tu perfil empresarial ha sido actualizado. Ahora generaré nuevas tareas personalizadas basadas en tus insights.',
        tasksGenerated: 'Las nuevas tareas aparecerán en tu coordinador pronto',
        closeButton: 'Cerrar'
      },
      generating: 'Generando preguntas inteligentes...'
    }
  };

  const t = translations[language];

  const generateIntelligentQuestions = async () => {
    setIsGeneratingQuestions(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-intelligent-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessDetails: {
            businessModel: businessProfile?.businessModel,
            businessStage: businessProfile?.businessStage,
            currentChannels: businessProfile?.currentChannels,
            primaryGoals: businessProfile?.primaryGoals,
            businessDescription: businessProfile?.businessDescription,
            brandName: businessProfile?.brandName,
            businessLocation: businessProfile?.businessLocation
          },
          language,
          context: 'business_deep_dive'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const formattedQuestions = data.questions.map((q: any, index: number) => ({
          id: `q_${index}`,
          question: q.question || q,
          category: q.category || 'general',
          followUp: q.followUp
        }));
        setQuestions(formattedQuestions);
        setCurrentStep('questions');
      } else {
        // Fallback questions if API fails
        setQuestions(getFallbackQuestions());
        setCurrentStep('questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setQuestions(getFallbackQuestions());
      setCurrentStep('questions');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const getFallbackQuestions = (): Question[] => {
    const fallbackQuestions = language === 'en' ? [
      {
        id: 'target_audience',
        question: 'Who is your ideal customer? Describe them in detail.',
        category: 'audience'
      },
      {
        id: 'unique_value',
        question: 'What makes your business unique compared to competitors?',
        category: 'positioning'
      },
      {
        id: 'biggest_challenge',
        question: 'What is the biggest challenge you face in growing your business right now?',
        category: 'challenges'
      },
      {
        id: 'revenue_goals',
        question: 'What are your revenue goals for the next 6 months?',
        category: 'goals'
      },
      {
        id: 'marketing_channels',
        question: 'Which marketing channels work best for reaching your customers?',
        category: 'marketing'
      }
    ] : [
      {
        id: 'target_audience',
        question: '¿Quién es tu cliente ideal? Descríbelo en detalle.',
        category: 'audiencia'
      },
      {
        id: 'unique_value',
        question: '¿Qué hace único a tu negocio comparado con la competencia?',
        category: 'posicionamiento'
      },
      {
        id: 'biggest_challenge',
        question: '¿Cuál es el mayor desafío que enfrentas para hacer crecer tu negocio ahora?',
        category: 'desafíos'
      },
      {
        id: 'revenue_goals',
        question: '¿Cuáles son tus objetivos de ingresos para los próximos 6 meses?',
        category: 'objetivos'
      },
      {
        id: 'marketing_channels',
        question: '¿Qué canales de marketing funcionan mejor para llegar a tus clientes?',
        category: 'marketing'
      }
    ];

    return fallbackQuestions;
  };

  const handleAnswerSubmit = () => {
    if (currentAnswer.trim()) {
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestionIndex].id]: currentAnswer.trim()
      }));
      setCurrentAnswer('');
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        handleCompletion();
      }
    }
  };

  const handleCompletion = async () => {
    // Save answers to user profile
    try {
      const updatedProfile = {
        ...businessProfile,
        specificAnswers: {
          ...businessProfile?.specificAnswers,
          businessDeepDive: answers,
          lastDeepDiveDate: new Date().toISOString()
        }
      };

      // Save to localStorage for immediate use
      localStorage.setItem('businessDeepDiveAnswers', JSON.stringify(answers));
      
      setCurrentStep('completion');
    } catch (error) {
      console.error('Error saving profile:', error);
      setCurrentStep('completion');
    }
  };

  const renderIntro = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t.intro.title}
          </h3>
          <p className="text-muted-foreground">
            {t.intro.description}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {t.intro.benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">{benefit}</span>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={generateIntelligentQuestions}
        disabled={isGeneratingQuestions}
        className="w-full"
        size="lg"
      >
        {isGeneratingQuestions ? (
          <>
            <Brain className="w-4 h-4 mr-2 animate-pulse" />
            {t.generating}
          </>
        ) : (
          <>
            <Target className="w-4 h-4 mr-2" />
            {t.intro.startButton}
          </>
        )}
      </Button>
    </motion.div>
  );

  const renderQuestions = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {t.questions.progress
                .replace('{{current}}', (currentQuestionIndex + 1).toString())
                .replace('{{total}}', questions.length.toString())}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {currentQuestion.category}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">
              {currentQuestion.question}
            </h3>
            {currentQuestion.followUp && (
              <p className="text-sm text-muted-foreground">
                {currentQuestion.followUp}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={t.questions.placeholder}
            className="min-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleAnswerSubmit();
              }
            }}
          />

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              size="sm"
            >
              {t.questions.previousButton}
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                  } else {
                    handleCompletion();
                  }
                }}
                size="sm"
              >
                {t.questions.skipButton}
              </Button>

              <Button
                onClick={handleAnswerSubmit}
                disabled={!currentAnswer.trim()}
                size="sm"
              >
                {currentQuestionIndex === questions.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t.questions.finishButton}
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t.questions.nextButton}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    );
  };

  const renderCompletion = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          {t.completion.title}
        </h3>
        <p className="text-muted-foreground">
          {t.completion.description}
        </p>
      </div>

      <Card className="p-4 bg-primary/5 border-primary/20">
        <p className="text-sm text-primary font-medium">
          {t.completion.tasksGenerated}
        </p>
      </Card>

      <Button
        onClick={() => onOpenChange(false)}
        className="w-full"
        size="lg"
      >
        {t.completion.closeButton}
      </Button>
    </motion.div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription>
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {currentStep === 'intro' && renderIntro()}
          {currentStep === 'questions' && renderQuestions()}
          {currentStep === 'completion' && renderCompletion()}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};