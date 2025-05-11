
import React from 'react';
import { Calendar, MessageSquare, Settings, Users } from 'lucide-react';

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
          description: "Plan shows, political meetings, or workshops with an assistant that organizes calendars, sends reminders, and manages RSVPs."
        },
        {
          icon: <Users className="w-10 h-10 text-violet-600" />,
          title: "Community Manager",
          description: "Answers frequently asked questions, analyzes your audience's sentiment, and maintains constant communication."
        },
        {
          icon: <Settings className="w-10 h-10 text-violet-600" />,
          title: "Customizable by Sector",
          description: "Adapt your copilot based on whether you're dedicated to music, politics, logistics, crafts, or other emerging sectors."
        }
      ],
      betaText: "Motion is in beta phase with the first real customers including a politician, two cultural producers, and an artisans' community.",
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
          description: "Planifica shows, reuniones políticas o talleres con un asistente que organiza calendarios, envía recordatorios y gestiona RSVPs."
        },
        {
          icon: <Users className="w-10 h-10 text-violet-600" />,
          title: "Gestor de Comunidad",
          description: "Responde preguntas frecuentes, analiza el sentimiento de tu audiencia y mantiene una comunicación constante."
        },
        {
          icon: <Settings className="w-10 h-10 text-violet-600" />,
          title: "Personalizable por Sector",
          description: "Adapta tu copilot según te dediques a la música, política, logística, artesanía u otros sectores emergentes."
        }
      ],
      betaText: "Motion está en fase beta con los primeros clientes reales incluyendo un político, dos productores culturales y una comunidad de artesanos.",
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
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
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
    </section>
  );
};
