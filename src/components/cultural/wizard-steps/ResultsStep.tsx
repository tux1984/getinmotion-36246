
import React, { useEffect } from 'react';
import { UserProfileData } from '../types/wizardTypes';
import { StepContainer } from '../wizard-components/StepContainer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ChevronRight, Stars } from 'lucide-react';
import { CategoryScore } from '@/components/maturity/types';
import { RecommendedAgents } from '@/types/dashboard';
import { motion } from 'framer-motion';

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
  const t = {
    en: {
      title: "Your Results",
      subtitle: "Based on your responses, we've prepared these insights",
      overallMaturity: "Overall Project Maturity",
      maturityLabel: "Maturity Level",
      categoriesTitle: "Categories",
      recommendedAgents: "Recommended Agents",
      agentRecommendation: "Agent Recommendations",
      whyRecommended: "Why recommended:",
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
      whyRecommended: "Por qué lo recomendamos:",
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Character illustration (visible on medium screens and up) */}
        <motion.div 
          className="col-span-1 hidden md:flex flex-col justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={illustration} 
            alt="Character illustration" 
            className="w-64 h-64 object-contain"
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

        {/* Main content - scores and recommendations */}
        <motion.div 
          className="col-span-1 md:col-span-2 space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Score Card */}
          <motion.div 
            variants={itemVariants}
            className={`bg-gradient-to-br ${getScoreGradient(overallScore)} rounded-2xl border border-slate-200/50 shadow-lg p-8 relative overflow-hidden`}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/30 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    {t[language].overallMaturity}
                  </span>
                  <h3 className="text-3xl font-bold mt-1">{getMaturityLevel()}</h3>
                </div>
                
                {/* Mobile character image */}
                <div className="md:hidden">
                  <img 
                    src={illustration} 
                    alt="Character" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                
                <div className="hidden md:flex items-center">
                  <div className={`w-20 h-20 rounded-full ${getScoreGradient(overallScore)} shadow-inner border border-white/50 flex items-center justify-center`}>
                    <span className="text-2xl font-extrabold">{overallScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">{t[language].categoriesTitle}</h4>
                
                <motion.div
                  variants={itemVariants}
                  className="space-y-5"
                >
                  {/* Category Progress Bars */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span className="text-sm font-medium">{t[language].categoryLabels.ideaValidation}</span>
                      </div>
                      <span className="text-sm font-medium">{scores.ideaValidation}%</span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div 
                        className={`h-full rounded-full ${getCategoryColor(scores.ideaValidation)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores.ideaValidation}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium">{t[language].categoryLabels.userExperience}</span>
                      </div>
                      <span className="text-sm font-medium">{scores.userExperience}%</span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className={`h-full rounded-full ${getCategoryColor(scores.userExperience)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores.userExperience}%` }}
                        transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">{t[language].categoryLabels.marketFit}</span>
                      </div>
                      <span className="text-sm font-medium">{scores.marketFit}%</span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className={`h-full rounded-full ${getCategoryColor(scores.marketFit)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scores.marketFit}%` }}
                        transition={{ delay: 0.9, duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-medium">{t[language].categoryLabels.monetization}</span>
                      </div>
                      <span className="text-sm font-medium">{scores.monetization}%</span>
                    </div>
                    <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
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
          
          {/* Agent Recommendations */}
          <motion.div
            variants={itemVariants}
            className="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl border border-slate-200/50 shadow-lg p-8 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-100 blur-3xl opacity-60"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-blue-100 blur-3xl opacity-60"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-10 h-10 rounded-full ${getIndustryIllustration()} flex items-center justify-center text-white`}>
                  <Stars className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  {t[language].agentRecommendation}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {getRecommendedAgents().map((agent, index) => (
                  <motion.div 
                    key={agent.id}
                    custom={index}
                    variants={agentVariants}
                    className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 hover:shadow-md hover:border-indigo-200/50 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                          <Check className="w-6 h-6" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{agent.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {agent.reason}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button 
                  onClick={onComplete}
                  className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-base font-medium py-6 group relative overflow-hidden shadow-lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 w-full rounded-md overflow-hidden">
                    <span className="absolute -inset-[50%] top-0 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                      <div className="aspect-square h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                    </span>
                  </span>
                  <span className="relative">{t[language].primaryButtonText}</span>
                  <ChevronRight className="w-5 h-5 relative group-hover:translate-x-1 transition-all" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </StepContainer>
  );
};
