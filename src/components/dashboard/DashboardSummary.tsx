
import React from 'react';

interface DashboardSummaryProps {
  language: 'en' | 'es';
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({ language }) => {
  const t = {
    en: {
      generalActivity: "General Activity",
      activeAgents: "Active agents",
      tasksInProgress: "Tasks in progress",
      lastDeliverable: "Last deliverable generated",
      daysAgo: "days ago",
      mostUsedAgent: "Most used agent",
      estimatedCostPerMonth: "Estimated cost per month"
    },
    es: {
      generalActivity: "Actividad general",
      activeAgents: "Agentes activos",
      tasksInProgress: "Tareas en curso",
      lastDeliverable: "Último entregable generado",
      daysAgo: "días atrás",
      mostUsedAgent: "Agente más usado",
      estimatedCostPerMonth: "Costo estimado por mes"
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
      <div>
        <h2 className="text-sm font-medium text-gray-500">{t[language].generalActivity}</h2>
        <ul className="mt-2 space-y-1">
          <li className="text-sm">• {t[language].activeAgents}: 2</li>
          <li className="text-sm">• {t[language].tasksInProgress}: 4</li>
          <li className="text-sm">• {t[language].lastDeliverable}: 1 {t[language].daysAgo}</li>
        </ul>
      </div>
      <div>
        <h2 className="text-sm font-medium text-gray-500">{t[language].mostUsedAgent}</h2>
        <p className="mt-2 text-sm">A2 - Contrato cultural</p>
      </div>
      <div>
        <h2 className="text-sm font-medium text-gray-500">{t[language].estimatedCostPerMonth}</h2>
        <p className="mt-2 text-sm font-medium">$42</p>
      </div>
    </div>
  );
};
