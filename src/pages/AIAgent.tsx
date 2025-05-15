
import React from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AIAssistant } from '@/components/AIAssistant';
import { useLanguage } from '@/context/LanguageContext';

const AIAgent = () => {
  const { language } = useLanguage();
  
  const t = {
    en: {
      title: "AI Assistant",
      description: "Chat with our AI assistant to get help with your tasks and projects.",
    },
    es: {
      title: "Asistente IA",
      description: "Chatea con nuestro asistente de IA para obtener ayuda con tus tareas y proyectos.",
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {language === 'en' ? t.en.title : t.es.title}
          </h1>
          <p className="text-gray-600">
            {language === 'en' ? t.en.description : t.es.description}
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <AIAssistant showHeader={false} />
        </div>
      </main>
    </div>
  );
};

export default AIAgent;
