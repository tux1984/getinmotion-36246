
import React from 'react';
import { Check } from 'lucide-react';

interface ValuePropositionProps {
  language: 'en' | 'es';
}

export const ValueProposition: React.FC<ValuePropositionProps> = ({ language }) => {
  const translations = {
    en: {
      title: "Why Choose Get in Motion?",
      subtitle: "Designed to empower creators, organizations, and small businesses anywhere in the world",
      reasons: [
        {
          title: "Save time and resources",
          description: "Automate repetitive tasks and focus on what truly matters - your creative work and business growth."
        },
        {
          title: "Operate like a large team",
          description: "Access AI copilots 24/7 that work alongside you, providing expertise and support whenever you need it."
        },
        {
          title: "Grow without technical knowledge",
          description: "User-friendly tools that don't require coding or technical expertise to implement and use effectively."
        },
        {
          title: "Custom solution",
          description: "Tailored specifically for your industry, workflow, and unique business needs and challenges."
        }
      ]
    },
    es: {
      title: "¿Por Qué Elegir Get in Motion?",
      subtitle: "Diseñado para empoderar a creadores, organizaciones y pequeñas empresas en cualquier parte del mundo",
      reasons: [
        {
          title: "Ahorra tiempo y recursos",
          description: "Automatiza tareas repetitivas y enfócate en lo que realmente importa: tu trabajo creativo y crecimiento empresarial."
        },
        {
          title: "Opera como un gran equipo",
          description: "Accede a copilotos de IA 24/7 que trabajan junto a ti, brindando experiencia y apoyo cuando lo necesites."
        },
        {
          title: "Crece sin conocimiento técnico",
          description: "Herramientas fáciles de usar que no requieren programación o experiencia técnica para implementar y usar efectivamente."
        },
        {
          title: "Solución personalizada",
          description: "Adaptado específicamente para tu industria, flujo de trabajo y necesidades y desafíos únicos del negocio."
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <section 
      className="py-16 md:py-24 bg-white"
      data-section="value-proposition"
      id="value-proposition"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {t.title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {t.reasons.map((reason, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {reason.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
