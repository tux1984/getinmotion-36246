
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { AgentCard } from './AgentCard';
import { DashboardSummary } from './DashboardSummary';
import { AgentsList } from './AgentsList';
import { Agent, AgentStatus } from '@/types/dashboard';

interface DashboardMainProps {
  onSelectAgent: (id: string) => void;
  agents: Agent[];
}

export const DashboardMain: React.FC<DashboardMainProps> = ({ 
  onSelectAgent,
  agents
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const t = {
    en: {
      greeting: "Hello, Manu! Your agents are ready 👇",
      configureAccount: "Configure account",
      myAgents: "My Agents",
      addNewAgent: "Add new agent",
      maturityCalculator: "Maturity Calculator"
    },
    es: {
      greeting: "¡Hola, Manu! Tus agentes están listos 👇",
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

  const handleNavigateToMaturityCalculator = () => {
    navigate('/maturity-calculator');
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-medium mb-6">
          {t[language].greeting}
        </h1>
        
        <DashboardSummary language={language} />
        
        <h2 className="text-xl font-medium mb-4">
          🧠 {t[language].myAgents}
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
