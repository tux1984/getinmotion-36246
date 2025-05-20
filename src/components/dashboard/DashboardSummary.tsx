
import React from 'react';

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
      icon: "🤖",
      color: "bg-violet-50 text-violet-700"
    },
    {
      title: t[language].completedTasks,
      value: "12",
      icon: "✅",
      color: "bg-green-50 text-green-700"
    },
    {
      title: t[language].pendingTasks,
      value: "3",
      icon: "⏱️",
      color: "bg-amber-50 text-amber-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 md:grid-cols-3">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-sm"
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${stat.color} flex items-center justify-center mr-2 sm:mr-3`}>
              <span className="text-base sm:text-lg">{stat.icon}</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">{stat.title}</p>
              <p className="text-lg sm:text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
