
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, TrendingUp, Users } from 'lucide-react';

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
      active: "Active Agents",
      total: "Total Available",
      recommended: "Recommended",
      efficiency: "Efficiency Rate"
    },
    es: {
      active: "Agentes Activos",
      total: "Total Disponibles",
      recommended: "Recomendados",
      efficiency: "Tasa de Eficiencia"
    }
  };

  const t = translations[language];
  const efficiencyRate = totalAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Agents */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">{t.active}</p>
                <p className="text-3xl font-bold text-green-800">{activeAgents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                En funcionamiento
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Total Available */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">{t.total}</p>
                <p className="text-3xl font-bold text-blue-800">{totalAgents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                Disponibles
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recommended */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">{t.recommended}</p>
                <p className="text-3xl font-bold text-yellow-800">{recommendedAgents}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0">
                <Zap className="w-3 h-3 mr-1" />
                Para ti
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Rate */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">{t.efficiency}</p>
                <p className="text-3xl font-bold text-purple-800">{efficiencyRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <Badge className={`${
                efficiencyRate >= 70 ? 'bg-green-100 text-green-700 border-green-200' :
                efficiencyRate >= 50 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                'bg-red-100 text-red-700 border-red-200'
              }`}>
                {efficiencyRate >= 70 ? 'Excelente' : efficiencyRate >= 50 ? 'Bueno' : 'Mejorable'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
