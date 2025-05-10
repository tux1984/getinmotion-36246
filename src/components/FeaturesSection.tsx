
import React from 'react';
import { Calendar, MessageSquare, Settings, Users } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
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
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Copilots para cada necesidad</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cada copilot se especializa en resolver distintos desafíos que enfrentan los equipos pequeños.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
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
            Motion está en fase beta con los primeros clientes reales incluyendo un político, 
            dos productores culturales y una comunidad de artesanos.
          </p>
          <button 
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 px-8 rounded-lg font-medium"
            onClick={() => document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Únete a los primeros usuarios
          </button>
        </div>
      </div>
    </section>
  );
};
