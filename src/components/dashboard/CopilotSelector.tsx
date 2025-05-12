
import React from 'react';
import { MessageSquare, Calendar, Users, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/context/LanguageContext';

interface Copilot {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  soon: boolean;
  greeting: string;
}

interface CopilotSelectorProps {
  onSelectCopilot: (id: string) => void;
}

export const CopilotSelector = ({ onSelectCopilot }: CopilotSelectorProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const translations = {
    en: {
      selectCopilot: "Select a copilot to get started",
      selectCopilotText: "Choose between different specialized copilots according to your needs.",
      salesAssistant: "Sales Assistant",
      eventOrganizer: "Event Organizer",
      communityManager: "Community Manager",
      contentAdvisor: "Content Advisor",
      betaVersion: "Beta version",
      comingSoon: "Coming soon"
    },
    es: {
      selectCopilot: "Selecciona un copilot para comenzar",
      selectCopilotText: "Elige entre diferentes copilots especializados según tus necesidades.",
      salesAssistant: "Asistente de Ventas",
      eventOrganizer: "Organizador de Eventos",
      communityManager: "Gestor de Comunidad",
      contentAdvisor: "Asesor de Contenido",
      betaVersion: "Versión beta",
      comingSoon: "Próximamente"
    }
  };
  
  const t = translations[language];
  
  const copilots: Copilot[] = [
    { 
      id: "sales", 
      name: t.salesAssistant, 
      icon: <MessageSquare className="w-5 h-5" />, 
      color: "bg-violet-100 text-violet-700", 
      soon: false,
      greeting: language === 'en' 
        ? "Hi there! I'm your Sales Assistant. I can help you manage inquiries, create quotes, and track potential clients. How can I assist you today?"
        : "¡Hola! Soy tu Asistente de Ventas. Puedo ayudarte a gestionar consultas, crear presupuestos y hacer seguimiento a clientes potenciales. ¿Cómo puedo ayudarte hoy?"
    },
    { 
      id: "events", 
      name: t.eventOrganizer, 
      icon: <Calendar className="w-5 h-5" />, 
      color: "bg-indigo-100 text-indigo-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hello! I'm your Event Organizer. I can help you schedule events, manage attendees, send reminders, and track responses. What event are you planning?"
        : "¡Hola! Soy tu Organizador de Eventos. Puedo ayudarte a programar eventos, gestionar asistentes, enviar recordatorios y hacer seguimiento de respuestas. ¿Qué evento estás planeando?"
    },
    { 
      id: "community", 
      name: t.communityManager, 
      icon: <Users className="w-5 h-5" />, 
      color: "bg-blue-100 text-blue-700", 
      soon: false,
      greeting: language === 'en'
        ? "Hi! I'm your Community Manager. I can help you engage with your audience, analyze feedback, and maintain consistent communication. How would you like to connect with your community today?"
        : "¡Hola! Soy tu Gestor de Comunidad. Puedo ayudarte a interactuar con tu audiencia, analizar feedback y mantener una comunicación constante. ¿Cómo te gustaría conectar con tu comunidad hoy?"
    },
    { 
      id: "content", 
      name: t.contentAdvisor, 
      icon: <Star className="w-5 h-5" />, 
      color: "bg-emerald-100 text-emerald-700", 
      soon: true,
      greeting: language === 'en'
        ? "This copilot is coming soon! Check back for updates."
        : "¡Este copilot estará disponible pronto! Vuelve para ver actualizaciones."
    }
  ];

  const handleSelectCopilot = (id: string) => {
    if (copilots.find(c => c.id === id)?.soon) {
      toast({
        title: language === 'en' ? 'Coming Soon' : 'Próximamente',
        description: language === 'en' 
          ? 'This copilot is still in development and will be available soon!'
          : '¡Este copilot está aún en desarrollo y estará disponible pronto!',
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
        {copilots.map((copilot) => (
          <div 
            key={copilot.id}
            className={`p-5 rounded-lg border ${copilot.soon ? 'border-gray-200 opacity-70' : 'border-violet-200 cursor-pointer hover:border-violet-300 hover:shadow-sm transition-all'}`}
            onClick={() => handleSelectCopilot(copilot.id)}
          >
            <div className={`w-10 h-10 rounded-full ${copilot.color} flex items-center justify-center mb-3`}>
              {copilot.icon}
            </div>
            <h3 className="font-medium mb-1">{copilot.name}</h3>
            {copilot.soon ? (
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
