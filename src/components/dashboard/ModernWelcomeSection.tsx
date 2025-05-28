
import React from 'react';
import { Sparkles, Bot, TrendingUp } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';

interface ModernWelcomeSectionProps {
  language: 'en' | 'es';
}

export const ModernWelcomeSection: React.FC<ModernWelcomeSectionProps> = ({ language }) => {
  const { profile, projects, agents, metrics, loading } = useUserData();

  const translations = {
    en: {
      greeting: "Welcome back",
      subtitle: "Your AI-powered creative workspace",
      description: "Manage your cultural projects and collaborate with specialized AI agents",
      activeAgents: "Active Agents",
      totalProjects: "Projects",
      growth: "Growth"
    },
    es: {
      greeting: "Bienvenido de vuelta",
      subtitle: "Tu espacio creativo potenciado por IA",
      description: "Gestiona tus proyectos culturales y colabora con agentes IA especializados",
      activeAgents: "Agentes Activos",
      totalProjects: "Proyectos",
      growth: "Crecimiento"
    }
  };

  const t = translations[language];

  // Calculate real metrics
  const activeAgentsCount = agents.filter(agent => agent.is_enabled).length;
  const totalProjectsCount = projects.length;
  const growthPercentage = metrics?.total_sessions 
    ? Math.min(Math.round((metrics.total_sessions / 10) * 100), 100)
    : 0;

  const userName = profile?.full_name || 'Usuario';

  if (loading) {
    return (
      <div className="relative">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl animate-pulse">
          <div className="h-12 bg-white/20 rounded mb-4"></div>
          <div className="h-6 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/10 rounded-2xl p-4">
                <div className="h-16 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main welcome card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {t.greeting}, {userName}!
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
                <p className="text-2xl font-bold text-white">{activeAgentsCount}</p>
              </div>
              <Bot className="w-8 h-8 text-purple-300" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-300/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">{t.totalProjects}</p>
                <p className="text-2xl font-bold text-white">{totalProjectsCount}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-300" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-4 border border-emerald-300/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-200 text-sm font-medium">{t.growth}</p>
                <p className="text-2xl font-bold text-white">+{growthPercentage}%</p>
              </div>
              <Sparkles className="w-8 h-8 text-emerald-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
