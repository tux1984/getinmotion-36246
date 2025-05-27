
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { CategoryScore, ProfileType, RecommendedAgents } from '@/types/dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuestions } from '@/components/maturity/getQuestions';
import { QuestionCard } from '@/components/maturity/QuestionCard';
import { ProgressBar } from '@/components/maturity/ProgressBar';

interface SimpleCulturalMaturityCalculatorProps {
  language: 'en' | 'es';
  onComplete: (scores: CategoryScore, recommendedAgents: RecommendedAgents) => void;
}

const characterImages = [
  "/lovable-uploads/cfd16f14-72a3-4b55-bfd2-67adcd44eb78.png", // Community monster
  "/lovable-uploads/a2ebe4fd-31ed-43ec-9f9f-35fe6b529ad2.png", // Creative monster
  "/lovable-uploads/4da82626-7a63-45bd-a402-64023f2f2d44.png", // Design monster
  "/lovable-uploads/390caed4-1006-489e-9da8-b17d9f8fb814.png", // Finance monster
  "/lovable-uploads/c131a30d-0ce5-4b65-ae3c-5715f73e4f4c.png", // Planning monster
  "/lovable-uploads/aad610ec-9f67-4ed0-93dc-8c2b3e8f98d3.png", // Business monster
  "/lovable-uploads/e5849e7b-cac1-4c76-9858-c7d5222cce96.png", // Analytics monster
];

export const SimpleCulturalMaturityCalculator: React.FC<SimpleCulturalMaturityCalculatorProps> = ({ 
  language, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState<'profileType' | 'questions' | 'results'>('profileType');
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<CategoryScore | null>(null);
  const [recommendedAgents, setRecommendedAgents] = useState<RecommendedAgents | null>(null);
  const { toast } = useToast();

  const translations = {
    en: {
      title: "Cultural Maturity Assessment",
      subtitle: "Let's evaluate your creative project's development stage",
      profileTypeTitle: "Select Your Profile Type",
      profileTypeSubtitle: "Choose the option that best describes your current situation",
      idea: {
        title: "I have an idea",
        description: "I'm in the early stages with a creative concept or business idea I want to develop"
      },
      solo: {
        title: "I work solo",
        description: "I'm an individual creator, freelancer, or solo entrepreneur managing my creative business"
      },
      team: {
        title: "I lead a team",
        description: "I manage a team or organization in the creative or cultural sector"
      },
      next: "Next",
      back: "Back",
      complete: "Complete Assessment",
      selectProfile: "Please select a profile type",
      answerQuestion: "Please answer the question before continuing",
      resultsTitle: "Your Cultural Maturity Results",
      resultsSubtitle: "Here's your assessment with recommended tools",
      primaryRecommendations: "Primary Recommendations",
      secondaryRecommendations: "Secondary Recommendations",
      deeperAnalysis: "Want a deeper analysis?",
      moreQuestions: "Answer more questions for detailed insights",
      finishAssessment: "Finish Assessment"
    },
    es: {
      title: "Evaluación de Madurez Cultural",
      subtitle: "Vamos a evaluar la etapa de desarrollo de tu proyecto creativo",
      profileTypeTitle: "Selecciona Tu Tipo de Perfil",
      profileTypeSubtitle: "Elige la opción que mejor describe tu situación actual",
      idea: {
        title: "Tengo una idea",
        description: "Estoy en las primeras etapas con un concepto creativo o idea de negocio que quiero desarrollar"
      },
      solo: {
        title: "Trabajo solo",
        description: "Soy un creador individual, freelancer o emprendedor solitario que gestiona mi negocio creativo"
      },
      team: {
        title: "Lidero un equipo",
        description: "Gestiono un equipo u organización en el sector creativo o cultural"
      },
      next: "Siguiente",
      back: "Atrás",
      complete: "Completar Evaluación",
      selectProfile: "Por favor selecciona un tipo de perfil",
      answerQuestion: "Por favor responde la pregunta antes de continuar",
      resultsTitle: "Tus Resultados de Madurez Cultural",
      resultsSubtitle: "Aquí está tu evaluación con herramientas recomendadas",
      primaryRecommendations: "Recomendaciones Principales",
      secondaryRecommendations: "Recomendaciones Secundarias",
      deeperAnalysis: "¿Quieres un análisis más profundo?",
      moreQuestions: "Responde más preguntas para obtener información detallada",
      finishAssessment: "Finalizar Evaluación"
    }
  };

  const t = translations[language];
  const questions = profileType ? getQuestions(language, profileType) : [];
  const totalSteps = questions.length + 2; // +2 for profile type and results
  const currentStepNumber = currentStep === 'profileType' ? 1 : 
                           currentStep === 'questions' ? currentQuestionIndex + 2 :
                           totalSteps;

  const calculateScores = (): CategoryScore => {
    const values = Object.values(answers);
    const total = values.reduce((sum, val) => sum + val, 0);
    const maxPossible = questions.length * 3;
    const percentage = (total / maxPossible) * 100;
    
    // Distribute scores across categories based on answers
    return {
      ideaValidation: Math.min(100, Math.round(percentage * 0.8)),
      userExperience: Math.min(100, Math.round(percentage * 0.9)),
      marketFit: Math.min(100, Math.round(percentage * 0.7)),
      monetization: Math.min(100, Math.round(percentage * 0.6))
    };
  };

  const getRecommendations = (scores: CategoryScore): RecommendedAgents => {
    const scoresArray = [
      { category: 'idea-validator', score: scores.ideaValidation },
      { category: 'ux-designer', score: scores.userExperience },
      { category: 'market-analyst', score: scores.marketFit },
      { category: 'finance-advisor', score: scores.monetization }
    ];

    // Sort by lowest scores (areas needing most help)
    scoresArray.sort((a, b) => a.score - b.score);

    return {
      primary: scoresArray.slice(0, 2).map(item => item.category),
      secondary: scoresArray.slice(2, 4).map(item => item.category)
    };
  };

  const handleProfileSelect = (type: ProfileType) => {
    setProfileType(type);
  };

  const handleNext = () => {
    if (currentStep === 'profileType') {
      if (!profileType) {
        toast({
          title: t.selectProfile,
          variant: 'destructive'
        });
        return;
      }
      setCurrentStep('questions');
    } else if (currentStep === 'questions') {
      const currentQuestion = questions[currentQuestionIndex];
      if (!answers[currentQuestion.id]) {
        toast({
          title: t.answerQuestion,
          variant: 'destructive'
        });
        return;
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Calculate final scores and show results
        const finalScores = calculateScores();
        const recommendations = getRecommendations(finalScores);
        setScores(finalScores);
        setRecommendedAgents(recommendations);
        setCurrentStep('results');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'questions' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentStep === 'questions' && currentQuestionIndex === 0) {
      setCurrentStep('profileType');
    } else if (currentStep === 'results') {
      setCurrentStep('questions');
      setCurrentQuestionIndex(questions.length - 1);
    }
  };

  const handleSelectOption = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleComplete = () => {
    if (scores && recommendedAgents) {
      onComplete(scores, recommendedAgents);
    }
  };

  const getCurrentCharacterImage = () => {
    if (currentStep === 'profileType') {
      return characterImages[0];
    } else if (currentStep === 'questions') {
      return characterImages[(currentQuestionIndex % characterImages.length) + 1] || characterImages[1];
    } else {
      return characterImages[6]; // Analytics monster for results
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2 border-purple-100 rounded-3xl shadow-lg bg-white/95 backdrop-blur-sm">
        <CardContent className="pt-8 px-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-purple-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                {t.title}
              </h3>
              <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                {language === 'en' 
                  ? `Step ${currentStepNumber} of ${totalSteps}` 
                  : `Paso ${currentStepNumber} de ${totalSteps}`}
              </span>
            </div>
            
            <ProgressBar current={currentStepNumber} total={totalSteps} />
          </div>

          <div className="flex gap-8 items-start">
            {/* Character Image */}
            <div className="hidden md:block w-1/3">
              <img
                src={getCurrentCharacterImage()}
                alt="Character"
                className="w-full h-auto object-contain max-h-80"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {currentStep === 'profileType' && (
                  <motion.div
                    key="profileType"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xl font-semibold text-purple-900 mb-2">{t.profileTypeTitle}</h4>
                      <p className="text-gray-600 mb-6">{t.profileTypeSubtitle}</p>
                    </div>

                    <div className="grid gap-4">
                      {[
                        { type: 'idea' as ProfileType, data: t.idea },
                        { type: 'solo' as ProfileType, data: t.solo },
                        { type: 'team' as ProfileType, data: t.team }
                      ].map(({ type, data }) => (
                        <motion.div
                          key={type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            profileType === type
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => handleProfileSelect(type)}
                        >
                          <h5 className="font-semibold text-purple-900">{data.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{data.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 'questions' && questions[currentQuestionIndex] && (
                  <motion.div
                    key={`question-${currentQuestionIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <QuestionCard 
                      question={questions[currentQuestionIndex]}
                      selectedValue={answers[questions[currentQuestionIndex].id]}
                      onSelectOption={handleSelectOption}
                    />
                  </motion.div>
                )}

                {currentStep === 'results' && scores && recommendedAgents && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xl font-semibold text-purple-900 mb-2">{t.resultsTitle}</h4>
                      <p className="text-gray-600 mb-6">{t.resultsSubtitle}</p>
                    </div>

                    {/* Scores Display */}
                    <div className="space-y-4">
                      {Object.entries(scores).map(([category, score]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize text-sm font-medium">{category.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-sm font-semibold">{score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-purple-900 mb-2">{t.primaryRecommendations}</h5>
                        <div className="flex flex-wrap gap-2">
                          {recommendedAgents.primary?.map((agent, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {agent.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-purple-900 mb-2">{t.secondaryRecommendations}</h5>
                        <div className="flex flex-wrap gap-2">
                          {recommendedAgents.secondary?.map((agent, index) => (
                            <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                              {agent.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Deeper Analysis Option */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                      <h5 className="font-semibold text-purple-900 mb-2">{t.deeperAnalysis}</h5>
                      <p className="text-sm text-gray-600 mb-3">{t.moreQuestions}</p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleComplete}
                        >
                          {t.finishAssessment}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-indigo-600"
                          onClick={() => {
                            // TODO: Implement extended questions
                            toast({
                              title: "Extended analysis coming soon!",
                              description: "This feature will be available in the next update."
                            });
                          }}
                        >
                          {t.moreQuestions}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-6 pb-4">
            <Button 
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'profileType'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.back}
            </Button>

            {currentStep !== 'results' && (
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 flex items-center gap-2"
              >
                {currentStep === 'questions' && currentQuestionIndex === questions.length - 1 
                  ? t.complete 
                  : t.next}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
