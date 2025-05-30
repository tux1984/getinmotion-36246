
import React from 'react';
import { Target, CheckCircle, Clock } from 'lucide-react';

interface DashboardSummaryProps {
  language: 'en' | 'es';
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ language }) => {
  const t = {
    en: {
      activeAgents: "Active Agents",
      completedTasks: "Completed Tasks",
      pendingTasks: "Pending Tasks"
    },
    es: {
      activeAgents: "Agentes Activos",
      completedTasks: "Tareas Completadas",
      pendingTasks: "Tareas Pendientes"
    }
  };

  const stats = [
    {
      title: t[language].activeAgents,
      value: "2",
      icon: Target,
      color: "text-violet-600"
    },
    {
      title: t[language].completedTasks,
      value: "12",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: t[language].pendingTasks,
      value: "3",
      icon: Clock,
      color: "text-amber-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 md:grid-cols-3">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-3"
          >
            <IconComponent className={`w-8 h-8 ${stat.color}`} />
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <p className={`text-sm font-medium ${stat.color}`}>{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
};
