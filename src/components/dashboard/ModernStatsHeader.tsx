
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
    <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-white/20 p-4 shadow-lg mb-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-gray-900">{totalAgents}</div>
          <div className="text-xs text-gray-600">{t.totalAgents}</div>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-gray-900">{activeAgents}</div>
          <div className="text-xs text-gray-600">{t.activeAgents}</div>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-gray-900">{recommendedAgents}</div>
          <div className="text-xs text-gray-600">{t.recommendedAgents}</div>
        </div>
      </div>
    </div>
  );
};
