
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Calculator, FileSpreadsheet, Receipt } from 'lucide-react';
import { ProductMaturityMeter } from '@/components/ProductMaturityMeter';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { ProjectStatusCards } from '@/components/dashboard/ProjectStatusCards';
import { CopilotSelector } from '@/components/dashboard/CopilotSelector';
import { CopilotChat } from '@/components/dashboard/CopilotChat';
import { TaskManager } from '@/components/dashboard/TaskManager';
import { QuickActions } from '@/components/dashboard/QuickActions';

interface Message {
  type: 'user' | 'copilot';
  content: string;
}

const Dashboard = () => {
  const { language } = useLanguage();
  const [activeCopilot, setActiveCopilot] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const agents = [
    { 
      id: "admin", 
      name: language === 'en' ? "Administrative Assistant" : "Asistente Administrativo",
      icon: <FileText className="w-5 h-5" />, 
      color: "bg-violet-100 text-violet-700", 
      soon: false,
      greeting: language === 'en' 
        ? "Hi there! I'm your Administrative Assistant. I can help you organize your files, manage appointments, and handle correspondence. How can I assist you today?"
        : "¡Hola! Soy tu Asistente Administrativo. Puedo ayudarte a organizar tus archivos, gestionar citas y manejar correspondencia. ¿Cómo puedo ayudarte hoy?"
    },
    { 
      id: "accounting", 
      name: language === 'en' ? "Accounting Agent" : "Agente Contable", 
      icon: <Calculator className="w-5 h-5" />, 
      color: "bg-indigo-100 text-indigo-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hello! I'm your Accounting Agent. I can help you track expenses, prepare for tax filings, and manage your financial records. What financial tasks are you working on?"
        : "¡Hola! Soy tu Agente Contable. Puedo ayudarte a seguir gastos, preparar declaraciones de impuestos y gestionar tus registros financieros. ¿En qué tareas financieras estás trabajando?"
    },
    { 
      id: "contracts", 
      name: language === 'en' ? "Contract Manager" : "Gestor de Contratos", 
      icon: <FileSpreadsheet className="w-5 h-5" />, 
      color: "bg-blue-100 text-blue-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hi! I'm your Contract Manager. I can help you draft agreements, review terms, and manage your contract deadlines. What contract needs do you have today?"
        : "¡Hola! Soy tu Gestor de Contratos. Puedo ayudarte a redactar acuerdos, revisar términos y gestionar los plazos de tus contratos. ¿Qué necesidades contractuales tienes hoy?"
    },
    { 
      id: "invoices", 
      name: language === 'en' ? "Invoice Processor" : "Procesador de Facturas", 
      icon: <Receipt className="w-5 h-5" />, 
      color: "bg-emerald-100 text-emerald-700", 
      soon: true,
      greeting: language === 'en'
        ? "This agent is coming soon! Check back for updates."
        : "¡Este agente estará disponible pronto! Vuelve para ver actualizaciones."
    }
  ];

  const handleSelectCopilot = (id: string) => {
    setActiveCopilot(id);
    const selectedAgent = agents.find(c => c.id === id);
    if (selectedAgent) {
      setMessages([
        { type: 'copilot', content: selectedAgent.greeting }
      ]);
    }
  };

  const getAgentDetails = () => {
    const agent = agents.find(c => c.id === activeCopilot);
    return {
      name: agent?.name || '',
      icon: agent?.icon,
      color: agent?.color || '',
    };
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {!activeCopilot ? (
          <>
            <WelcomeSection />
            <ProjectStatusCards />
            
            {/* Product Maturity Meter */}
            <div className="mb-8">
              <ProductMaturityMeter />
            </div>
            
            <CopilotSelector onSelectCopilot={handleSelectCopilot} />
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CopilotChat 
                activeCopilot={activeCopilot} 
                onClose={() => setActiveCopilot(null)}
                copilotIcon={getAgentDetails().icon}
                copilotColor={getAgentDetails().color}
                copilotName={getAgentDetails().name}
                initialMessages={messages}
              />
            </div>
            
            <div className="space-y-6">
              <TaskManager />
              <QuickActions />
              
              {/* The Product Maturity Meter when in chat mode */}
              <ProductMaturityMeter />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
