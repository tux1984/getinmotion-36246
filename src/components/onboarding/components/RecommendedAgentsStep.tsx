
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CategoryScore, ProfileType, RecommendedAgents } from '@/types/dashboard';
import { useLanguage } from '@/context/LanguageContext';
import { Brain, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface RecommendedAgentsStepProps {
  profileType: ProfileType;
  maturityScores: CategoryScore | null;
  onExtendedAnalysisRequested?: () => void;
  initialRecommendations?: RecommendedAgents;
}

export const RecommendedAgentsStep: React.FC<RecommendedAgentsStepProps> = ({ 
  profileType, 
  maturityScores,
  onExtendedAnalysisRequested,
  initialRecommendations
}) => {
  const { language } = useLanguage();
  const showDeeperAnalysisOption = !!onExtendedAnalysisRequested;
  const hasInitialRecommendations = !!initialRecommendations;
  
  const currentRecommendations = maturityScores ? {
    admin: true,
    accounting: maturityScores.monetization > 20 || profileType === 'team',
    legal: maturityScores.marketFit > 35,
    operations: maturityScores.marketFit > 50 || profileType === 'team',
    cultural: true
  } : initialRecommendations || {
    admin: true,
    accounting: profileType === 'team' || profileType === 'solo',
    legal: profileType === 'team',
    operations: profileType === 'team',
    cultural: true
  };
  
  const agentDescriptions = {
    en: {
      admin: {
        title: "Administrative Assistant",
        description: "Helps with day-to-day tasks, scheduling, and general organization.",
        ideal: "Everyone"
      },
      accounting: {
        title: "Financial Advisor",
        description: "Assists with budgeting, expense tracking, and financial planning.",
        ideal: "Solo creators and teams"
      },
      legal: {
        title: "Legal Guide",
        description: "Provides guidance on contracts, intellectual property, and regulations.",
        ideal: "Growing businesses and teams"
      },
      operations: {
        title: "Operations Manager",
        description: "Helps streamline processes, workflows, and team coordination.",
        ideal: "Teams and businesses with multiple people"
      },
      cultural: {
        title: "Creative Guide",
        description: "Specializes in cultural and creative industries specific needs.",
        ideal: "All creative professionals"
      }
    },
    es: {
      admin: {
        title: "Asistente Administrativo",
        description: "Ayuda con tareas diarias, programación y organización general.",
        ideal: "Todos"
      },
      accounting: {
        title: "Asesor Financiero",
        description: "Asiste con presupuestos, seguimiento de gastos y planificación financiera.",
        ideal: "Creadores individuales y equipos"
      },
      legal: {
        title: "Guía Legal",
        description: "Proporciona orientación sobre contratos, propiedad intelectual y regulaciones.",
        ideal: "Negocios y equipos en crecimiento"
      },
      operations: {
        title: "Gerente de Operaciones",
        description: "Ayuda a optimizar procesos, flujos de trabajo y coordinación de equipos.",
        ideal: "Equipos y negocios con varias personas"
      },
      cultural: {
        title: "Guía Creativo",
        description: "Se especializa en necesidades específicas de industrias culturales y creativas.",
        ideal: "Todos los profesionales creativos"
      }
    }
  };

  const t = {
    en: {
      title: "Recommended Agents for You",
      subtitle: hasInitialRecommendations 
        ? "Based on your profile, these agents can help you right away" 
        : "Based on your project profile and maturity level, we recommend these AI copilots",
      deeperAnalysis: "Want more accurate recommendations?",
      deeperAnalysisDesc: "Take a deeper assessment to get more personalized agent recommendations.",
      deeperButton: "Take Extended Analysis",
      idealFor: "Ideal for",
      continue: "Continue"
    },
    es: {
      title: "Agentes Recomendados para Ti",
      subtitle: hasInitialRecommendations 
        ? "Según tu perfil, estos agentes pueden ayudarte de inmediato" 
        : "Según el perfil y nivel de madurez de tu proyecto, recomendamos estos copilotos de IA",
      deeperAnalysis: "¿Quieres recomendaciones más precisas?",
      deeperAnalysisDesc: "Realiza una evaluación más profunda para obtener recomendaciones de agentes más personalizadas.",
      deeperButton: "Realizar Análisis Extendido",
      idealFor: "Ideal para",
      continue: "Continuar"
    }
  };
  
  const descriptions = agentDescriptions[language];

  return (
    <div className="max-w-4xl mx-auto py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-2 text-purple-800">{t[language].title}</h2>
        <p className="text-gray-600">{t[language].subtitle}</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Object.entries(currentRecommendations)
          .filter(([_, isRecommended]) => isRecommended)
          .map(([agentKey]) => {
            const agent = descriptions[agentKey as keyof typeof descriptions];
            return (
              <motion.div
                key={agentKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="h-full"
              >
                <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {agent.title}
                    </CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Badge variant="outline" className="bg-purple-50">
                      {t[language].idealFor}: {agent.ideal}
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
      </div>
      
      {showDeeperAnalysisOption && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center p-6 bg-purple-50 rounded-xl mb-6"
        >
          <Search className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            {t[language].deeperAnalysis}
          </h3>
          <p className="text-gray-600 mb-4">
            {t[language].deeperAnalysisDesc}
          </p>
          <Button
            onClick={onExtendedAnalysisRequested}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            <Brain className="w-4 h-4 mr-2" />
            {t[language].deeperButton}
          </Button>
        </motion.div>
      )}
    </div>
  );
};
