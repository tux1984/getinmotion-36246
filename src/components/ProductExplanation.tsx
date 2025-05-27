import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const ProductExplanation = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "How Get in Motion Works",
      subtitle: "Simple steps to transform your creative business",
      step1: {
        title: "Start a Task, Your Way",
        description: "Email, Slack, or directly in the app - whatever works for you"
      },
      step2: {
        title: "Motion Gets to Work",
        description: "We generate invoices, verify compliance, and handle the paperwork"
      },
      step3: {
        title: "Collections Go Automatically",
        description: "Smart follow-ups and payment reminders without you lifting a finger"
      },
      step4: {
        title: "Review Reports and Optimize",
        description: "Monitor everything during construction and optimize your processes"
      }
    },
    es: {
      title: "Cómo Funciona Get in Motion",
      subtitle: "Pasos simples para transformar tu negocio creativo",
      step1: {
        title: "Inicia una Tarea, a Tu Manera",
        description: "Email, Slack, o directo en la app - como prefieras"
      },
      step2: {
        title: "Motion Se Pone a Trabajar",
        description: "Generamos facturas, verificamos cumplimiento y manejamos el papeleo"
      },
      step3: {
        title: "Las Cobranzas Salen Automáticamente",
        description: "Seguimientos inteligentes y recordatorios de pago sin que muevas un dedo"
      },
      step4: {
        title: "Revisa Reportes y Optimiza",
        description: "Supervisión durante la construcción y optimización de tus procesos"
      }
    }
  };

  const t = translations[language];

  const steps = [
    {
      number: "01",
      title: t.step1.title,
      description: t.step1.description,
      color: "from-pink-500 to-purple-600"
    },
    {
      number: "02", 
      title: t.step2.title,
      description: t.step2.description,
      color: "from-purple-500 to-indigo-600"
    },
    {
      number: "03",
      title: t.step3.title,
      description: t.step3.description,
      color: "from-indigo-500 to-blue-600"
    },
    {
      number: "04",
      title: t.step4.title,
      description: t.step4.description,
      color: "from-blue-500 to-cyan-600"
    }
  ];

  return (
    <div className="w-full py-16 bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 font-serif">
            {t.title}
          </h2>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-75 rounded-xl blur-sm group-hover:opacity-100 transition duration-300"
                   style={{
                     backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                     '--tw-gradient-from': step.color.split(' ')[1],
                     '--tw-gradient-to': step.color.split(' ')[3]
                   } as React.CSSProperties}
              ></div>
              
              <div className="relative bg-indigo-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-800/30 h-full">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 mx-auto`}>
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-center mb-3 text-indigo-100">
                  {step.title}
                </h3>
                
                <p className="text-sm text-indigo-200 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
