
import React from 'react';

interface ValuePropositionProps {
  language: 'en' | 'es';
}

export const ValueProposition: React.FC<ValuePropositionProps> = ({ language }) => {
  const translations = {
    en: {
      title: "Why Choose Motion?",
      subtitle: "The perfect AI companion for creative professionals",
      reasons: [
        {
          title: "Specialized for Creatives",
          description: "Built specifically for artists, musicians, writers, and cultural creators with industry-specific workflows."
        },
        {
          title: "Intelligent Automation",
          description: "AI agents that understand your creative process and handle administrative tasks automatically."
        },
        {
          title: "Growth-Oriented",
          description: "Tools designed to scale with your creative business from solo projects to established enterprises."
        },
        {
          title: "Time Protection",
          description: "Safeguard your creative time by automating legal, financial, and administrative responsibilities."
        }
      ]
    },
    es: {
      title: "¿Por Qué Elegir Motion?",
      subtitle: "El compañero AI perfecto para profesionales creativos",
      reasons: [
        {
          title: "Especializado para Creativos",
          description: "Diseñado específicamente para artistas, músicos, escritores y creadores culturales con flujos de trabajo de la industria."
        },
        {
          title: "Automatización Inteligente",
          description: "Agentes AI que entienden tu proceso creativo y manejan tareas administrativas automáticamente."
        },
        {
          title: "Orientado al Crecimiento",
          description: "Herramientas diseñadas para escalar con tu negocio creativo desde proyectos independientes hasta empresas establecidas."
        },
        {
          title: "Protección del Tiempo",
          description: "Protege tu tiempo creativo automatizando responsabilidades legales, financieras y administrativas."
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50"
      data-section="value-proposition"
      id="value-proposition"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            {t.title}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.reasons.map((reason, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {reason.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
