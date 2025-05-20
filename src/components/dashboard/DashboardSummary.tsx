
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-4 rounded-lg border border-gray-100"
        >
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mr-3`}>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
