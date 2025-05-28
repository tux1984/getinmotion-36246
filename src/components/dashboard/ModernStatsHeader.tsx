
import React from 'react';
import { Users, Bot, Zap } from 'lucide-react';

interface ModernStatsHeaderProps {
  title: string;
  subtitle: string;
  totalAgents: number;
  activeAgents: number;
  recommendedAgents: number;
  language: 'en' | 'es';
}

export const ModernStatsHeader: React.FC<ModernStatsHeaderProps> = ({
  title,
  subtitle,
  totalAgents,
  activeAgents,
  recommendedAgents,
  language
}) => {
  const translations = {
    en: {
      totalAgents: "Total Agents",
      activeAgents: "Active Agents", 
      recommendedAgents: "Recommended"
    },
    es: {
      totalAgents: "Agentes Totales",
      activeAgents: "Agentes Activos",
      recommendedAgents: "Recomendados"
    }
  };

  const t = translations[language];

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-lg text-gray-600">{subtitle}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalAgents}</div>
          <div className="text-sm text-gray-600">{t.totalAgents}</div>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{activeAgents}</div>
          <div className="text-sm text-gray-600">{t.activeAgents}</div>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{recommendedAgents}</div>
          <div className="text-sm text-gray-600">{t.recommendedAgents}</div>
        </div>
      </div>
    </div>
  );
};
