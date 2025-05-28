
import React from 'react';
import { Sparkles, Bot, TrendingUp } from 'lucide-react';

interface ModernWelcomeSectionProps {
  language: 'en' | 'es';
}

export const ModernWelcomeSection: React.FC<ModernWelcomeSectionProps> = ({ language }) => {
  const translations = {
    en: {
      greeting: "Welcome back, Manu!",
      subtitle: "Your AI-powered creative workspace",
      description: "Manage your cultural projects and collaborate with specialized AI agents",
      activeAgents: "Active Agents",
      totalProjects: "Projects",
      growth: "Growth"
    },
    es: {
      greeting: "¡Bienvenido de vuelta, Manu!",
      subtitle: "Tu espacio creativo potenciado por IA",
      description: "Gestiona tus proyectos culturales y colabora con agentes IA especializados",
      activeAgents: "Agentes Activos",
      totalProjects: "Proyectos",
      growth: "Crecimiento"
    }
  };

  const t = translations[language];

  return (
    <div className="relative">
      {/* Main welcome card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {t.greeting}
            </h1>
            <p className="text-xl text-purple-200 font-medium">{t.subtitle}</p>
            <p className="text-gray-300">{t.description}</p>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-300/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">{t.activeAgents}</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Bot className="w-8 h-8 text-purple-300" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-300/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">{t.totalProjects}</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-300" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-4 border border-emerald-300/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium">{t.growth}</p>
                <p className="text-2xl font-bold text-white">+24%</p>
              </div>
              <Sparkles className="w-8 h-8 text-emerald-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
