
import React from 'react';
import { Calendar, MessageSquare, Settings, Users, Image } from 'lucide-react';

interface FeaturesSectionProps {
  language: 'en' | 'es';
}

export const FeaturesSection = ({ language }: FeaturesSectionProps) => {
  const translations = {
    en: {
      title: "Copilots for every need",
      subtitle: "Each copilot specializes in solving different challenges faced by small teams.",
      features: [
        {
          icon: <MessageSquare className="w-10 h-10 text-violet-600" />,
          title: "Personal Assistant",
          description: "Interact with your copilot from a simple panel or WhatsApp. It responds, generates proposals, and automates everyday tasks."
        },
        {
          icon: <Calendar className="w-10 h-10 text-violet-600" />,
          title: "Event Organizer",
          description: "Plan shows, workshops, or events with an assistant that organizes calendars, sends reminders, and manages RSVPs."
        },
        {
          icon: <Users className="w-10 h-10 text-violet-600" />,
          title: "Community Manager",
          description: "Answers frequently asked questions, analyzes your audience's sentiment, and maintains constant communication."
        },
        {
          icon: <Settings className="w-10 h-10 text-violet-600" />,
          title: "Customizable by Sector",
          description: "Adapt your copilot based on whether you're dedicated to music, visual arts, logistics, crafts, or other creative sectors."
        }
      ],
      betaText: "Motion is in beta phase with the first real customers including musicians, cultural producers, and artisan communities.",
      joinButton: "Join the first users"
    },
    es: {
      title: "Copilots para cada necesidad",
      subtitle: "Cada copilot se especializa en resolver distintos desafíos que enfrentan los equipos pequeños.",
      features: [
        {
          icon: <MessageSquare className="w-10 h-10 text-violet-600" />,
          title: "Asistente Personal",
          description: "Interactúa con tu copilot desde un panel sencillo o WhatsApp. Te responde, genera propuestas y automatiza tareas cotidianas."
        },
        {
          icon: <Calendar className="w-10 h-10 text-violet-600" />,
          title: "Organizador de Eventos",
          description: "Planifica shows, reuniones o talleres con un asistente que organiza calendarios, envía recordatorios y gestiona RSVPs."
        },
        {
          icon: <Users className="w-10 h-10 text-violet-600" />,
          title: "Gestor de Comunidad",
          description: "Responde preguntas frecuentes, analiza el sentimiento de tu audiencia y mantiene una comunicación constante."
        },
        {
          icon: <Settings className="w-10 h-10 text-violet-600" />,
          title: "Personalizable por Sector",
          description: "Adapta tu copilot según te dediques a la música, artes visuales, logística, artesanía u otros sectores creativos."
        }
      ],
      betaText: "Motion está en fase beta con los primeros clientes reales incluyendo músicos, productores culturales y comunidades de artesanos.",
      joinButton: "Únete a los primeros usuarios"
    }
  };

  const t = translations[language];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              
              <div className="mt-4 aspect-[3/2] rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                <Image className="w-10 h-10 text-slate-300" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 aspect-[4/3] bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <div className="w-full h-full flex items-center justify-center bg-violet-50">
              <Image className="w-16 h-16 text-violet-200" />
            </div>
          </div>
          
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-lg text-gray-600 mb-8">
              {t.betaText}
            </p>
            <button 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 px-8 rounded-lg font-medium"
              onClick={() => document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.joinButton}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
