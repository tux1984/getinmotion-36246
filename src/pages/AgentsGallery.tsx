
import React from 'react';
import { culturalAgentsDatabase } from '@/data/agentsDatabase';
import { useLanguage } from '@/context/LanguageContext';
import { Header } from '@/components/layout/Header';
import { AgentCard } from '@/components/agents-gallery/AgentCard';

const AgentsGallery = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "AI Agents Collection",
      subtitle: "Discover our comprehensive suite of specialized AI agents designed to transform your creative business operations",
      navAgents: "Agents",
      navAccess: "Get Access",
      priority: "Priority",
      impact: "Impact",
      exampleQuestion: "Example Question",
      exampleAnswer: "Example Answer",
      categories: {
        Financiera: "Financial",
        Legal: "Legal",
        Diagnóstico: "Diagnostic", 
        Comercial: "Commercial",
        Operativo: "Operations",
        Comunidad: "Community"
      }
    },
    es: {
      title: "Colección de Agentes IA",
      subtitle: "Descubre nuestra suite integral de agentes de IA especializados diseñados para transformar las operaciones de tu negocio creativo",
      navAgents: "Agentes",
      navAccess: "Obtener Acceso",
      priority: "Prioridad",
      impact: "Impacto",
      exampleQuestion: "Pregunta Ejemplo",
      exampleAnswer: "Respuesta Ejemplo",
      categories: {
        Financiera: "Financiera",
        Legal: "Legal",
        Diagnóstico: "Diagnóstico",
        Comercial: "Comercial", 
        Operativo: "Operativo",
        Comunidad: "Comunidad"
      }
    }
  };

  const t = translations[language];

  const agentTranslations = {
    priority: t.priority,
    impact: t.impact,
    exampleQuestion: t.exampleQuestion,
    exampleAnswer: t.exampleAnswer,
    categories: t.categories
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Use the same header as the main page */}
      <Header 
        translations={{
          navAgents: t.navAgents,
          navAccess: t.navAccess
        }}
        onAccessClick={() => {}}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {culturalAgentsDatabase.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              translations={agentTranslations}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentsGallery;
