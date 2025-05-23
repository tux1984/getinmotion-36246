
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RecommendedAgents } from '@/types/dashboard';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface ComparisonStepProps {
  initialRecommendations: RecommendedAgents | null;
  extendedRecommendations: RecommendedAgents | null;
  onContinue: () => void;
  language: 'en' | 'es';
}

export const ComparisonStep: React.FC<ComparisonStepProps> = ({
  initialRecommendations,
  extendedRecommendations,
  onContinue,
  language
}) => {
  const translations = {
    en: {
      title: "Compare your recommendations",
      subtitle: "See how additional information has refined our recommendations",
      initialRecommendations: "Initial recommendations",
      extendedRecommendations: "Enhanced recommendations",
      copilots: "Copilots",
      admin: "Administrative Assistant",
      accounting: "Accounting Copilot",
      legal: "Legal Advisor",
      operations: "Operations Manager",
      cultural: "Cultural Planner",
      continueButton: "Continue to Finalize",
      explanation: "Based on your detailed answers, we've refined our recommendations to better fit your specific needs."
    },
    es: {
      title: "Compara tus recomendaciones",
      subtitle: "Mira cómo la información adicional ha refinado nuestras recomendaciones",
      initialRecommendations: "Recomendaciones iniciales",
      extendedRecommendations: "Recomendaciones mejoradas",
      copilots: "Copilotos",
      admin: "Asistente Administrativo",
      accounting: "Copiloto Contable",
      legal: "Asesor Legal",
      operations: "Gerente de Operaciones",
      cultural: "Planificador Cultural",
      continueButton: "Continuar a Finalizar",
      explanation: "Basado en tus respuestas detalladas, hemos refinado nuestras recomendaciones para adaptarse mejor a tus necesidades específicas."
    }
  };
  
  const t = translations[language];
  
  const copilotItems = [
    { id: 'admin', name: t.admin },
    { id: 'accounting', name: t.accounting },
    { id: 'legal', name: t.legal },
    { id: 'operations', name: t.operations },
    { id: 'cultural', name: t.cultural }
  ];
  
  // Check if recommendations have changed
  const hasChanges = extendedRecommendations && initialRecommendations && Object.keys(initialRecommendations).some(
    key => {
      if (key !== 'extended') {
        const typedKey = key as keyof Omit<RecommendedAgents, 'extended'>;
        return initialRecommendations[typedKey] !== extendedRecommendations[typedKey];
      }
      return false;
    }
  );
  
  return (
    <div className="p-6 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-2xl font-bold text-purple-800 mb-3">{t.title}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Initial recommendations */}
          <Card className="p-5 border-indigo-100 shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4 text-center border-b border-indigo-100 pb-3">
              {t.initialRecommendations}
            </h3>
            <div className="space-y-3">
              {copilotItems.map(copilot => {
                const isRecommended = initialRecommendations?.[copilot.id as keyof RecommendedAgents];
                
                return (
                  <div key={copilot.id} className="flex items-center justify-between">
                    <span className="text-gray-700">{copilot.name}</span>
                    {isRecommended ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
          
          {/* Enhanced recommendations */}
          <Card className={`p-5 ${hasChanges ? 'border-purple-200 shadow-md' : 'border-indigo-100 shadow-sm'}`}>
            <h3 className="text-lg font-semibold text-purple-700 mb-4 text-center border-b border-purple-100 pb-3">
              {t.extendedRecommendations}
            </h3>
            <div className="space-y-3">
              {copilotItems.map(copilot => {
                const isRecommended = extendedRecommendations?.[copilot.id as keyof RecommendedAgents];
                const wasRecommended = initialRecommendations?.[copilot.id as keyof RecommendedAgents];
                const hasChanged = isRecommended !== wasRecommended;
                
                return (
                  <div 
                    key={copilot.id} 
                    className={`flex items-center justify-between ${hasChanged ? 'bg-purple-50 -mx-2 px-2 py-1 rounded' : ''}`}
                  >
                    <span className={`${hasChanged ? 'font-medium text-purple-800' : 'text-gray-700'}`}>
                      {copilot.name}
                    </span>
                    {isRecommended ? (
                      <CheckCircle className={`h-5 w-5 ${hasChanged ? 'text-purple-600' : 'text-green-500'}`} />
                    ) : (
                      <XCircle className={`h-5 w-5 ${hasChanged ? 'text-purple-300' : 'text-gray-300'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-8 bg-indigo-50 p-4 rounded-lg"
          >
            <p className="text-indigo-700">{t.explanation}</p>
          </motion.div>
        )}
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={onContinue}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
          >
            {t.continueButton}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
