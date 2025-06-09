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
import { Separator } from '@/components/ui/separator';

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
    const agents = [];
    
    // Always include essential agents with proper names and descriptions
    if (recommendedAgents.admin) {
      agents.push({
        id: 'admin',
        name: t[language].agentNames.admin,
        reason: t[language].reasons.admin
      });
    }
    
    if (recommendedAgents.cultural) {
      agents.push({
        id: 'cultural',
        name: t[language].agentNames.cultural,
        reason: t[language].reasons.cultural
      });
    }
    
    if (recommendedAgents.accounting) {
      agents.push({
        id: 'accounting',
        name: t[language].agentNames.accounting,
        reason: t[language].reasons.accounting
      });
    }
    
    if (recommendedAgents.legal) {
      agents.push({
        id: 'legal',
        name: t[language].agentNames.legal,
        reason: t[language].reasons.legal
      });
    }
    
    if (recommendedAgents.operations) {
      agents.push({
        id: 'operations',
        name: t[language].agentNames.operations,
        reason: t[language].reasons.operations
      });
    }

    // Add agents from primary array if they exist
    if (recommendedAgents.primary && Array.isArray(recommendedAgents.primary)) {
      recommendedAgents.primary.forEach(agentId => {
        if (!agents.find(a => a.id === agentId)) {
          agents.push({
            id: agentId,
            name: agentId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            reason: language === 'en' 
              ? `Recommended for your creative project development.`
              : `Recomendado para el desarrollo de tu proyecto creativo.`
          });
        }
      });
    }

    return agents;
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
    onComplete();
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
  
  return (
    <StepContainer
      title={t[language].title}
      subtitle={t[language].subtitle}
    >
      <div className="w-full max-w-5xl mx-auto space-y-16">
        {/* Header Section - Centered character and maturity level */}
        <motion.div 
          className="flex flex-col items-center text-center space-y-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center shadow-lg">
            <img 
              src={illustration} 
              alt="Character illustration" 
              className="w-20 h-20 object-contain"
            />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-purple-900">
              {getMaturityLevel()}
            </h2>
            <p className="text-xl text-gray-600">
              {getProfileTypeSubtitle()}
            </p>
          </div>
        </motion.div>

        {/* Main Content - Single Column Layout with Better Spacing */}
        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Overall Score Card - Centered */}
          <motion.div 
            variants={itemVariants}
            className={`bg-gradient-to-br ${getScoreGradient(overallScore)} rounded-3xl border border-slate-200/50 shadow-xl p-10 mx-auto max-w-3xl`}
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                {t[language].overallMaturity}
              </h3>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-purple-900 mb-3">
                    {overallScore}%
                  </div>
                  <div className="text-xl font-semibold text-gray-700">
                    {getMaturityLevel()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Categories Progress - Better Grid Layout */}
            <div className="space-y-8">
              <h4 className="text-2xl font-semibold text-gray-700 text-center mb-8">
                {t[language].categoriesTitle}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(scores).map(([key, score], index) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-base font-medium text-gray-700">
                        {t[language].categoryLabels[key as keyof typeof t[typeof language]['categoryLabels']]}
                      </span>
                      <span className="text-base font-bold text-gray-900">
                        {score}%
                      </span>
                    </div>
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200">
                      <motion.div 
                        className={`h-full rounded-full ${getCategoryColor(score)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: 0.5 + (index * 0.2), duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recommendations Section - Better Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* AI Recommendations */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl border border-slate-200/50 shadow-xl p-8"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  {t[language].aiRecommendations}
                </h3>
              </div>

              {isLoadingRecommendations ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 mr-4" />
                  <span className="text-gray-600 text-lg">{t[language].loadingRecommendations}</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {aiRecommendations.map((recommendation, index) => (
                    <motion.div 
                      key={index}
                      custom={index}
                      variants={agentVariants}
                      className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/50"
                    >
                      <div className="flex gap-4">
                        <div className="shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center">
                            <Stars className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-base">{recommendation.title}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                              {recommendation.priority}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {recommendation.description}
                          </p>
                          <span className="text-sm text-purple-600 font-medium">
                            ⏱️ {recommendation.timeframe}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Separator between sections */}
            <Separator orientation="vertical" className="hidden lg:block mx-auto h-full" />
            <Separator className="lg:hidden my-6" />
            
            {/* Agent Recommendations */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl border border-slate-200/50 shadow-xl p-8"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  <Stars className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  {t[language].agentRecommendation}
                </h3>
              </div>
              
              <div className="space-y-6 mb-10">
                {getRecommendedAgents().map((agent, index) => (
                  <motion.div 
                    key={agent.id}
                    custom={index}
                    variants={agentVariants}
                    className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50"
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-base mb-2">{agent.name}</h4>
                        <p className="text-gray-600 text-sm">
                          {agent.reason}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Button 
                onClick={handleActivateAgents}
                className="w-full gap-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 font-semibold py-6 text-lg shadow-lg"
                size="lg"
              >
                <span>{t[language].primaryButtonText}</span>
                <ChevronRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </StepContainer>
  );
};
