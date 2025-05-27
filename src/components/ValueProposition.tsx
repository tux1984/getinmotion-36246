
import React from 'react';
import { Check } from 'lucide-react';

interface ValuePropositionProps {
  language: 'en' | 'es';
}

export const ValueProposition = ({ language }: ValuePropositionProps) => {
  const translations = {
    en: {
      title: "Why choose Motion?",
      subtitle: "Designed to empower creators, organizations, and small businesses anywhere in the world.",
      benefits: [
        {
          title: "Save time and resources",
          description: "Automate repetitive and administrative tasks so you can focus on what really matters."
        },
        {
          title: "Operate like a large team",
          description: "Your copilots work 24/7 managing tasks, communications and processes like a professional team."
        },
        {
          title: "Grow without technical knowledge",
          description: "You don't need to know about technology to harness the power of AI in your project."
        },
        {
          title: "Custom solution",
          description: "Adapted to the specific needs of creators and organizations globally."
        }
      ]
    },
    es: {
      title: "¿Por qué elegir Motion?",
      subtitle: "Diseñado para empoderar a creadores, organizaciones y pequeños negocios en cualquier parte del mundo.",
      benefits: [
        {
          title: "Ahorra tiempo y recursos",
          description: "Automatiza tareas repetitivas y administrativas para que puedas enfocarte en lo que realmente importa."
        },
        {
          title: "Opera como un equipo grande",
          description: "Tus copilots trabajan 24/7 gestionando tareas, comunicaciones y procesos como un equipo profesional."
        },
        {
          title: "Crece sin conocimientos técnicos",
          description: "No necesitas saber de tecnología para aprovechar el poder de la IA en tu proyecto."
        },
        {
          title: "Solución personalizada",
          description: "Adaptada a las necesidades específicas de creadores y organizaciones en todo el mundo."
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <section className="w-full py-16 bg-white" id="benefits">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {t.benefits.map((benefit, index) => (
            <div key={index} className="flex p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="mr-4 mt-1">
                <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-violet-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
