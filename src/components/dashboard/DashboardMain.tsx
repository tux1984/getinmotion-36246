
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AgentsList } from './AgentsList';
import { Agent } from '@/types/dashboard';
import { DashboardSummary } from './DashboardSummary';

interface DashboardMainProps {
  onSelectAgent: (id: string) => void;
  agents: Agent[];
}

export const DashboardMain: React.FC<DashboardMainProps> = ({ 
  onSelectAgent,
  agents
}) => {
  const { language } = useLanguage();
  
  const t = {
    en: {
      greeting: "Hello, Manu!",
      agentsReady: "Your agents are ready",
      configureAccount: "Configure account",
      myAgents: "My Agents",
      addNewAgent: "Add new agent",
      maturityCalculator: "Maturity Calculator"
    },
    es: {
      greeting: "¡Hola, Manu!",
      agentsReady: "Tus agentes están listos",
      configureAccount: "Configurar cuenta",
      myAgents: "Mis Agentes",
      addNewAgent: "Agregar agente nuevo",
      maturityCalculator: "Calculadora de Madurez"
    }
  };

  const handleAgentAction = (id: string, action: string) => {
    console.log(`Agent ${id} action: ${action}`);
    if (action === 'enter') {
      onSelectAgent(id);
    }
    // Here you would implement the actual agent status changes
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-medium mb-2">
          {t[language].greeting}
        </h1>
        <p className="text-gray-500">
          {t[language].agentsReady}
        </p>
      </div>
      
      {/* Dashboard summary */}
      <DashboardSummary language={language} />
      
      {/* Agents section */}
      <div>
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <span className="mr-2">🧠</span>
          {t[language].myAgents}
        </h2>
        
        <AgentsList 
          agents={agents} 
          onAgentAction={handleAgentAction} 
          addNewAgentText={t[language].addNewAgent}
          language={language}
        />
      </div>
    </div>
  );
};
