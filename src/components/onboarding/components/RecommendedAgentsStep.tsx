
import React from 'react';
import { ProfileType, CategoryScore, RecommendedAgents } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';

interface RecommendedAgentsStepProps {
  profileType: ProfileType;
  maturityScores: CategoryScore | null;
  initialRecommendations: RecommendedAgents | null;
  onExtendedAnalysisRequested: () => void;
  onContinue: () => void;
  language: 'en' | 'es';
}

export const RecommendedAgentsStep: React.FC<RecommendedAgentsStepProps> = ({
  profileType,
  maturityScores,
  initialRecommendations,
  onExtendedAnalysisRequested,
  onContinue,
  language
}) => {
  const translations = {
    en: {
      title: "Your Recommended Copilots",
      description: "Based on your profile, we've selected these copilots to help you with your project.",
      extendedAnalysis: "Get a more personalized recommendation",
      extendedAnalysisDescription: "Answer a few more questions for a more tailored experience.",
      continue: "Continue with these recommendations",
      admin: {
        title: "Administrative Assistant",
        description: "Your personal assistant that helps you handle everyday tasks and keeps your project organized."
      },
      cultural: {
        title: "Cultural Planner",
        description: "Help with planning and executing your cultural initiatives and creative projects."
      },
      accounting: {
        title: "Accounting Copilot",
        description: "Manage your finances, budgeting, and handle financial planning for your project."
      },
      legal: {
        title: "Legal Advisor",
        description: "Guide you through legal aspects of your business, contracts, and compliance."
      },
      operations: {
        title: "Operations Manager",
        description: "Streamline your operations and improve processes for better efficiency."
      }
    },
    es: {
      title: "Tus Copilotos Recomendados",
      description: "Basado en tu perfil, hemos seleccionado estos copilotos para ayudarte con tu proyecto.",
      extendedAnalysis: "Obtener recomendación más personalizada",
      extendedAnalysisDescription: "Responde algunas preguntas más para una experiencia más adaptada.",
      continue: "Continuar con estas recomendaciones",
      admin: {
        title: "Asistente Administrativo",
        description: "Tu asistente personal que te ayuda a manejar tareas diarias y mantener tu proyecto organizado."
      },
      cultural: {
        title: "Planificador Cultural",
        description: "Ayuda con la planificación y ejecución de tus iniciativas culturales y proyectos creativos."
      },
      accounting: {
        title: "Copiloto Contable",
        description: "Gestiona tus finanzas, presupuestos y maneja la planificación financiera para tu proyecto."
      },
      legal: {
        title: "Asesor Legal",
        description: "Te guía a través de los aspectos legales de tu negocio, contratos y cumplimiento."
      },
      operations: {
        title: "Gerente de Operaciones",
        description: "Optimiza tus operaciones y mejora los procesos para una mayor eficiencia."
      }
    }
  };

  const t = translations[language];

  const agentIcons = {
    admin: (
      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 7h.01" />
          <path d="M12 7h.01" />
          <path d="M17 7h.01" />
          <path d="M7 12h.01" />
          <path d="M12 12h.01" />
          <path d="M17 12h.01" />
          <path d="M7 17h.01" />
          <path d="M12 17h.01" />
          <path d="M17 17h.01" />
        </svg>
      </div>
    ),
    cultural: (
      <div className="p-2 rounded-full bg-purple-100 text-purple-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      </div>
    ),
    accounting: (
      <div className="p-2 rounded-full bg-green-100 text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      </div>
    ),
    legal: (
      <div className="p-2 rounded-full bg-red-100 text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 22h-2" />
          <path d="M20 15v2h-2" />
          <path d="M4 19.5V15" />
          <path d="M20 8v3" />
          <path d="M18 2h2v2" />
          <path d="M4 11V9" />
          <path d="M12 2h2" />
          <path d="M12 22h2" />
          <path d="M12 17h2" />
          <path d="M8 22H6" />
          <path d="M4 5V3" />
          <path d="M6 2H4" />
        </svg>
      </div>
    ),
    operations: (
      <div className="p-2 rounded-full bg-amber-100 text-amber-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </div>
    )
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-8 text-center"
      >
        <motion.h2 variants={item} className="text-2xl font-bold text-purple-800 mb-3">
          {t.title}
        </motion.h2>
        <motion.p variants={item} className="text-gray-600 max-w-2xl mx-auto">
          {t.description}
        </motion.p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {/* Administrative Assistant - always recommended */}
        <motion.div variants={item}>
          <Card className="p-5 h-full border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-start mb-2">
              {agentIcons.admin}
              <div className="ml-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-blue-800 mt-2">{t.admin.title}</h3>
            <p className="text-gray-600 mt-1 text-sm">{t.admin.description}</p>
          </Card>
        </motion.div>

        {/* Cultural Planner */}
        {initialRecommendations?.cultural && (
          <motion.div variants={item}>
            <Card className="p-5 h-full border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-start mb-2">
                {agentIcons.cultural}
                <div className="ml-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-purple-800 mt-2">{t.cultural.title}</h3>
              <p className="text-gray-600 mt-1 text-sm">{t.cultural.description}</p>
            </Card>
          </motion.div>
        )}

        {/* Accounting Copilot */}
        {initialRecommendations?.accounting && (
          <motion.div variants={item}>
            <Card className="p-5 h-full border-green-200 bg-gradient-to-br from-green-50 to-white">
              <div className="flex items-start mb-2">
                {agentIcons.accounting}
                <div className="ml-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mt-2">{t.accounting.title}</h3>
              <p className="text-gray-600 mt-1 text-sm">{t.accounting.description}</p>
            </Card>
          </motion.div>
        )}

        {/* Legal Advisor */}
        {initialRecommendations?.legal && (
          <motion.div variants={item}>
            <Card className="p-5 h-full border-red-200 bg-gradient-to-br from-red-50 to-white">
              <div className="flex items-start mb-2">
                {agentIcons.legal}
                <div className="ml-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mt-2">{t.legal.title}</h3>
              <p className="text-gray-600 mt-1 text-sm">{t.legal.description}</p>
            </Card>
          </motion.div>
        )}

        {/* Operations Manager */}
        {initialRecommendations?.operations && (
          <motion.div variants={item}>
            <Card className="p-5 h-full border-amber-200 bg-gradient-to-br from-amber-50 to-white">
              <div className="flex items-start mb-2">
                {agentIcons.operations}
                <div className="ml-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mt-2">{t.operations.title}</h3>
              <p className="text-gray-600 mt-1 text-sm">{t.operations.description}</p>
            </Card>
          </motion.div>
        )}
      </motion.div>

      <motion.div 
        className="mt-10 flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={onExtendedAnalysisRequested}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 h-auto flex items-center gap-2 w-full md:w-auto mx-auto"
          size="lg"
        >
          <Zap className="h-4 w-4" />
          {t.extendedAnalysis}
        </Button>
        
        <p className="text-gray-500 text-sm text-center">{t.extendedAnalysisDescription}</p>
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={onContinue}
            className="text-indigo-600 hover:text-indigo-800 flex items-center mx-auto"
          >
            {t.continue}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
