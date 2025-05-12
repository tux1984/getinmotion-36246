
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MessageSquare, Calendar, Users, Star } from 'lucide-react';
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

  const copilots = [
    { 
      id: "sales", 
      name: language === 'en' ? "Sales Assistant" : "Asistente de Ventas",
      icon: <MessageSquare className="w-5 h-5" />, 
      color: "bg-violet-100 text-violet-700", 
      soon: false,
      greeting: language === 'en' 
        ? "Hi there! I'm your Sales Assistant. I can help you manage inquiries, create quotes, and track potential clients. How can I assist you today?"
        : "¡Hola! Soy tu Asistente de Ventas. Puedo ayudarte a gestionar consultas, crear presupuestos y hacer seguimiento a clientes potenciales. ¿Cómo puedo ayudarte hoy?"
    },
    { 
      id: "events", 
      name: language === 'en' ? "Event Organizer" : "Organizador de Eventos", 
      icon: <Calendar className="w-5 h-5" />, 
      color: "bg-indigo-100 text-indigo-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hello! I'm your Event Organizer. I can help you schedule events, manage attendees, send reminders, and track responses. What event are you planning?"
        : "¡Hola! Soy tu Organizador de Eventos. Puedo ayudarte a programar eventos, gestionar asistentes, enviar recordatorios y hacer seguimiento de respuestas. ¿Qué evento estás planeando?"
    },
    { 
      id: "community", 
      name: language === 'en' ? "Community Manager" : "Gestor de Comunidad", 
      icon: <Users className="w-5 h-5" />, 
      color: "bg-blue-100 text-blue-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hi! I'm your Community Manager. I can help you engage with your audience, analyze feedback, and maintain consistent communication. How would you like to connect with your community today?"
        : "¡Hola! Soy tu Gestor de Comunidad. Puedo ayudarte a interactuar con tu audiencia, analizar feedback y mantener una comunicación constante. ¿Cómo te gustaría conectar con tu comunidad hoy?"
    },
    { 
      id: "content", 
      name: language === 'en' ? "Content Advisor" : "Asesor de Contenido", 
      icon: <Star className="w-5 h-5" />, 
      color: "bg-emerald-100 text-emerald-700", 
      soon: true,
      greeting: language === 'en'
        ? "This copilot is coming soon! Check back for updates."
        : "¡Este copilot estará disponible pronto! Vuelve para ver actualizaciones."
    }
  ];

  const handleSelectCopilot = (id: string) => {
    setActiveCopilot(id);
    const selectedCopilot = copilots.find(c => c.id === id);
    if (selectedCopilot) {
      setMessages([
        { type: 'copilot', content: selectedCopilot.greeting }
      ]);
    }
  };

  const getCopilotDetails = () => {
    const copilot = copilots.find(c => c.id === activeCopilot);
    return {
      name: copilot?.name || '',
      icon: copilot?.icon,
      color: copilot?.color || '',
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
                copilotIcon={getCopilotDetails().icon}
                copilotColor={getCopilotDetails().color}
                copilotName={getCopilotDetails().name}
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
