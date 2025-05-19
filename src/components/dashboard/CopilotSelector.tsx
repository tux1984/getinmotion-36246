
import React from 'react';
import { FileText, Receipt, Calculator, FileSpreadsheet, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';

export type RecommendedAgents = {
  admin: boolean;
  accounting: boolean;
  legal: boolean;
  operations: boolean;
};

interface Agent {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  soon: boolean;
  greeting: string;
}

interface CopilotSelectorProps {
  onSelectCopilot: (id: string) => void;
  recommendedAgents?: RecommendedAgents;
}

export const CopilotSelector = ({ onSelectCopilot, recommendedAgents }: CopilotSelectorProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const translations = {
    en: {
      selectCopilot: "Select an agent to get started",
      selectCopilotText: "Choose between different specialized back office agents according to your needs.",
      adminAssistant: "Administrative Assistant",
      accountingAgent: "Accounting Agent",
      legalAdvisor: "Legal Advisor",
      operationsManager: "Operations Manager",
      betaVersion: "Beta version",
      comingSoon: "Coming soon"
    },
    es: {
      selectCopilot: "Selecciona un agente para comenzar",
      selectCopilotText: "Elige entre diferentes agentes especializados de back office según tus necesidades.",
      adminAssistant: "Asistente Administrativo",
      accountingAgent: "Agente Contable",
      legalAdvisor: "Asesor Legal",
      operationsManager: "Gerente de Operaciones",
      betaVersion: "Versión beta",
      comingSoon: "Próximamente"
    }
  };
  
  const t = translations[language];
  
  const agents: Agent[] = [
    { 
      id: "admin", 
      name: t.adminAssistant, 
      icon: <FileText className="w-5 h-5" />, 
      color: "bg-violet-100 text-violet-700", 
      soon: false,
      greeting: language === 'en' 
        ? "Hi there! I'm your Administrative Assistant. I can help you organize your files, manage appointments, and handle correspondence. How can I assist you today?"
        : "¡Hola! Soy tu Asistente Administrativo. Puedo ayudarte a organizar tus archivos, gestionar citas y manejar correspondencia. ¿Cómo puedo ayudarte hoy?"
    },
    { 
      id: "accounting", 
      name: t.accountingAgent, 
      icon: <Calculator className="w-5 h-5" />, 
      color: "bg-indigo-100 text-indigo-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hello! I'm your Accounting Agent. I can help you track expenses, prepare for tax filings, and manage your financial records. What financial tasks are you working on?"
        : "¡Hola! Soy tu Agente Contable. Puedo ayudarte a seguir gastos, preparar declaraciones de impuestos y gestionar tus registros financieros. ¿En qué tareas financieras estás trabajando?"
    },
    { 
      id: "legal", 
      name: t.legalAdvisor, 
      icon: <FileSpreadsheet className="w-5 h-5" />, 
      color: "bg-blue-100 text-blue-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hi! I'm your Legal Advisor. I can help you understand legal requirements, review contracts, and manage compliance issues. What legal matters can I assist you with today?"
        : "¡Hola! Soy tu Asesor Legal. Puedo ayudarte a entender requisitos legales, revisar contratos y gestionar temas de cumplimiento. ¿En qué asuntos legales puedo ayudarte hoy?"
    },
    { 
      id: "operations", 
      name: t.operationsManager, 
      icon: <Briefcase className="w-5 h-5" />, 
      color: "bg-emerald-100 text-emerald-700", 
      soon: true,
      greeting: language === 'en'
        ? "This agent is coming soon! Check back for updates."
        : "¡Este agente estará disponible pronto! Vuelve para ver actualizaciones."
    }
  ];

  const handleSelectCopilot = (id: string) => {
    if (agents.find(c => c.id === id)?.soon) {
      toast({
        title: language === 'en' ? 'Coming Soon' : 'Próximamente',
        description: language === 'en' 
          ? 'This agent is still in development and will be available soon!'
          : '¡Este agente está aún en desarrollo y estará disponible pronto!',
      });
      return;
    }
    
    onSelectCopilot(id);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">{t.selectCopilot}</h2>
      <p className="text-gray-600 mb-6">
        {t.selectCopilotText}
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className={`p-5 rounded-lg border ${agent.soon ? 'border-gray-200 opacity-70' : 'border-violet-200 cursor-pointer hover:border-violet-300 hover:shadow-sm transition-all'}`}
            onClick={() => handleSelectCopilot(agent.id)}
          >
            <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center mb-3`}>
              {agent.icon}
            </div>
            <h3 className="font-medium mb-1">{agent.name}</h3>
            {agent.soon ? (
              <span className="text-xs bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full">{t.comingSoon}</span>
            ) : (
              <span className="text-sm text-gray-500">{t.betaVersion}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
