
import React from 'react';

interface AgentManagerHeaderProps {
  title: string;
  subtitle: string;
  totalAgents: number;
  activeAgents: number;
}

export const AgentManagerHeader: React.FC<AgentManagerHeaderProps> = ({
  title,
  subtitle,
  totalAgents,
  activeAgents
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
      <p className="text-sm text-purple-600 mt-1">
        {totalAgents} agentes disponibles • {activeAgents} activos
      </p>
    </div>
  );
};
