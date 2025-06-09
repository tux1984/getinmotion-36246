
import React, { useEffect, useState } from 'react';
import { UserProfileData } from '../types/wizardTypes';
import { StepContainer } from '../wizard-components/StepContainer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronRight, Stars, Sparkles, Loader2 } from 'lucide-react';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AIRecommendation {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Alta' | 'Media' | 'Baja';
  timeframe: string;
}

interface ResultsStepProps {
  profileData: UserProfileData;
  scores: CategoryScore;
  recommendedAgents: RecommendedAgents;
  language: 'en' | 'es';
  onComplete: () => void;
  illustration: string;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({ 
  profileData,
  scores,
  recommendedAgents, 
  language,
  onComplete,
  illustration
}) => {
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const t = {
    en: {
      title: "Your Results",
      subtitle: "Based on your responses, we've prepared these insights",
      overallMaturity: "Overall Project Maturity",
      maturityLabel: "Maturity Level",
      categoriesTitle: "Categories",
      recommendedAgents: "Recommended Agents",
      agentRecommendation: "Agent Recommendations",
      aiRecommendations: "AI-Powered Action Plan",
      whyRecommended: "Why recommended:",
      loadingRecommendations: "Generating personalized recommendations...",
      levels: {
        beginner: "Early Stage",
        developing: "Developing", 
        growing: "Growing",
        advanced: "Advanced"
      },
      categoryLabels: {
        ideaValidation: "Idea Validation",
        userExperience: "User Experience", 
        marketFit: "Market Fit",
        monetization: "Monetization"
      },
      agentNames: {
        admin: "Administrative Assistant",
        accounting: "Accounting Agent",
        legal: "Legal Advisor",
        operations: "Operations Manager",
        cultural: "Cultural Creator Agent"
      },
      reasons: {
        admin: "Helps organize your tasks and manage your workflow.",
        accounting: "Assists with finances and pricing strategies.",
        legal: "Provides contract and legal compliance guidance.",
        operations: "Optimizes your production and collaboration processes.",
        cultural: "Specialized assistance for your creative field."
      },
      profileTypeLabels: {
        idea: "for your Creative Idea",
        solo: "for your Solo Creator journey",
        team: "for your Creative Team"
      },
      primaryButtonText: "Activate Your AI Agents",
      secondaryButtonText: "View Dashboard"
    },
    es: {
      title: "Tus Resultados",
      subtitle: "Basados en tus respuestas, hemos preparado estos análisis",
      overallMaturity: "Madurez General del Proyecto",
      maturityLabel: "Nivel de Madurez",
      categoriesTitle: "Categorías",
      recommendedAgents: "Agentes Recomendados",
      agentRecommendation: "Recomendaciones de Agentes",
      aiRecommendations: "Plan de Acción con IA",
      whyRecommended: "Por qué lo recomendamos:",
      loadingRecommendations: "Generando recomendaciones personalizadas...",
      levels: {
        beginner: "Etapa Inicial",
        developing: "Desarrollándose",
        growing: "Creciendo", 
        advanced: "Avanzado"
      },
      categoryLabels: {
        ideaValidation: "Validación de Idea",
        userExperience: "Experiencia de Usuario",
        marketFit: "Ajuste al Mercado",
        monetization: "Monetización"
      },
      agentNames: {
        admin: "Asistente Administrativo",
        accounting: "Agente Contable",
        legal: "Asesor Legal",
        operations: "Gerente de Operaciones",
        cultural: "Agente para Creadores Culturales"
      },
      reasons: {
        admin: "Te ayuda a organizar tus tareas y gestionar tu flujo de trabajo.",
        accounting: "Te asiste con finanzas y estrategias de precios.",
        legal: "Te proporciona orientación sobre contratos y cumplimiento legal.",
        operations: "Optimiza tus procesos de producción y colaboración.",
        cultural: "Asistencia especializada para tu campo creativo."
      },
      profileTypeLabels: {
        idea: "para tu Idea Creativa",
        solo: "para tu camino como Creador Individual",
        team: "para tu Equipo Creativo"
      },
      primaryButtonText: "Activar tus Agentes IA",
      secondaryButtonText: "Ver Dashboard"
    }
  };
  
  // Calculate overall score
  const overallScore = Math.round(
    (scores.ideaValidation + scores.userExperience + scores.marketFit + scores.monetization) / 4
  );
  
  // Determine maturity level
  const getMaturityLevel = () => {
    if (overallScore >= 80) return t[language].levels.advanced;
    if (overallScore >= 60) return t[language].levels.growing;
    if (overallScore >= 40) return t[language].levels.developing;
    return t[language].levels.beginner;
  };
  
  // Get category color
  const getCategoryColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  // Get gradient for score card
  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-50 to-teal-100";
    if (score >= 60) return "from-blue-50 to-indigo-100";
    if (score >= 40) return "from-amber-50 to-orange-100";
    return "from-rose-50 to-pink-100";
  };

  const getRecommendedAgents = () => {
    return Object.keys(recommendedAgents)
      .filter(agent => recommendedAgents[agent as keyof RecommendedAgents])
      .map(agent => ({
        id: agent,
        name: t[language].agentNames[agent as keyof typeof t.en.agentNames],
        reason: t[language].reasons[agent as keyof typeof t.en.reasons]
      }));
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const lowercasePriority = priority.toLowerCase();
    if (lowercasePriority === 'high' || lowercasePriority === 'alta') return 'bg-red-100 text-red-800';
    if (lowercasePriority === 'medium' || lowercasePriority === 'media') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  // Handle navigation to dashboard
  const handleActivateAgents = () => {
    // Complete the wizard first
    onComplete();
    // Navigate to dashboard home
    navigate('/dashboard/home');
  };

  // Fetch AI recommendations
  useEffect(() => {
    const fetchAIRecommendations = async () => {
      try {
        setIsLoadingRecommendations(true);
        
        const { data, error } = await supabase.functions.invoke('ai-recommendations', {
          body: {
            scores,
            profileData,
            language
          }
        });

        if (error) {
          console.error('Error fetching AI recommendations:', error);
          toast({
            title: language === 'en' ? 'Recommendations unavailable' : 'Recomendaciones no disponibles',
            description: language === 'en' 
              ? 'Unable to generate AI recommendations at this time.' 
              : 'No se pudieron generar recomendaciones de IA en este momento.',
            variant: 'destructive'
          });
        } else if (data?.recommendations) {
          setAiRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error('Error fetching AI recommendations:', error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchAIRecommendations();
  }, [scores, profileData, language, toast]);

  // Get subtitle based on profile type
  const getProfileTypeSubtitle = () => {
    if (!profileData.profileType) return "";
    return t[language].profileTypeLabels[profileData.profileType];
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const agentVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        type: "spring",
        stiffness: 100
      }
    })
  };

  // Get industry-specific illustration
  const getIndustryIllustration = () => {
    switch (profileData.industry) {
      case 'music':
        return 'bg-gradient-to-br from-indigo-600 to-purple-500';
      case 'visual-arts':
        return 'bg-gradient-to-br from-amber-500 to-orange-600';
      case 'textile':
        return 'bg-gradient-to-br from-teal-500 to-emerald-600';
      case 'indigenous':
        return 'bg-gradient-to-br from-rose-500 to-pink-600';
      default:
        return 'bg-gradient-to-br from-blue-500 to-indigo-600';
    }
  };
  
  return (
    <StepContainer
      title={t[language].title}
      subtitle={t[language].subtitle}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Left Column - Scores and Character */}
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Character illustration */}
          <motion.div 
            className="flex flex-col justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={illustration} 
              alt="Character illustration" 
              className="w-48 h-48 object-contain"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-4"
            >
              <h3 className="text-xl font-bold text-purple-900">
                {getMaturityLevel()}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {getProfileTypeSubtitle()}
              </p>
            </motion.div>
          </motion.div>

          {/* Score Card */}
          <motion.div 
            variants={itemVariants}
            className={`bg-gradient-to-br ${getScoreGradient(overallScore)} rounded-2xl border border-slate-200/50 shadow-lg p-6 relative overflow-hidden`}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/30 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    {t[language].overallMaturity}
                  </span>
                  <h3 className="text-2xl font-bold mt-1">{getMaturityLevel()}</h3>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-16 h-16 rounded-full ${getScoreGradient(overallScore)} shadow-inner border border-white/50 flex items-center justify-center`}>
                    <span className="text-xl font-extrabold">{overallScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t[language].categoriesTitle}</h4>
                
                <motion.div
                  variants={itemVariants}
                  className="space-y-4"
                >
                  {/* Category Progress Bars */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="text-sm font-medium">{t[language].categoryLabels.ideaValidation}</span>
                      </div>
                      <span className="text-sm font-medium">{scores.ideaValidation}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div 
                        className={`h-full rounded-full ${getCategoryColor(scores.ideaValidation)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores.ideaValidation}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium">{t[language].categoryLabels.userExperience}</span>
                      </div>
                      <span className="text-sm font-medium">{scores.userExperience}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className={`h-full rounded-full ${getCategoryColor(scores.userExperience)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores.userExperience}%` }}
                        transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">{t[language].categoryLabels.marketFit}</span>
                      </div>
                      <span className="text-sm font-medium">{scores.marketFit}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className={`h-full rounded-full ${getCategoryColor(scores.marketFit)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores.marketFit}%` }}
                        transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-medium">{t[language].categoryLabels.monetization}</span>
                      </div>
                      <span className="text-sm font-medium">{scores.monetization}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className={`h-full rounded-full ${getCategoryColor(scores.monetization)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores.monetization}%` }}
                        transition={{ delay: 1.1, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Recommendations */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* AI Recommendations */}
          <motion.div
            variants={itemVariants}
            className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl border border-slate-200/50 shadow-lg p-6 relative overflow-hidden w-full"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 blur-3xl opacity-60"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 blur-3xl opacity-60"></div>
            
            <div className="relative z-10 w-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  {t[language].aiRecommendations}
                </h3>
              </div>

              {isLoadingRecommendations ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">{t[language].loadingRecommendations}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiRecommendations.map((recommendation, index) => (
                    <motion.div 
                      key={index}
                      custom={index}
                      variants={agentVariants}
                      className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/50 hover:shadow-sm hover:border-purple-200/50 transition-all w-full"
                    >
                      <div className="flex gap-3 w-full">
                        <div className="shrink-0">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center">
                            <Stars className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-gray-900 text-sm">{recommendation.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                              {recommendation.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs mb-1">
                            {recommendation.description}
                          </p>
                          <span className="text-xs text-purple-600 font-medium">
                            ⏱️ {recommendation.timeframe}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Agent Recommendations */}
          <motion.div
            variants={itemVariants}
            className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl border border-slate-200/50 shadow-lg p-6 relative overflow-hidden w-full"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-100 blur-3xl opacity-60"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-blue-100 blur-3xl opacity-60"></div>
            
            <div className="relative z-10 w-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 rounded-full ${getIndustryIllustration()} flex items-center justify-center text-white`}>
                  <Stars className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  {t[language].agentRecommendation}
                </h3>
              </div>
              
              <div className="space-y-3 mb-6">
                {getRecommendedAgents().map((agent, index) => (
                  <motion.div 
                    key={agent.id}
                    custom={index}
                    variants={agentVariants}
                    className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 hover:shadow-sm hover:border-indigo-200/50 transition-all w-full"
                  >
                    <div className="flex gap-3 w-full">
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm">{agent.name}</h4>
                        <p className="text-gray-600 text-xs mt-1">
                          {agent.reason}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="w-full">
                <Button 
                  onClick={handleActivateAgents}
                  className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-sm font-medium py-4 group relative overflow-hidden shadow-lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 w-full rounded-md overflow-hidden">
                    <span className="absolute -inset-[50%] top-0 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                      <div className="aspect-square h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                    </span>
                  </span>
                  <span className="relative">{t[language].primaryButtonText}</span>
                  <ChevronRight className="w-4 h-4 relative group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </StepContainer>
  );
};
