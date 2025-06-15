
import React from 'react';

interface AgentIconProps {
  icon: string | React.ElementType;
  className?: string;
}

export const AgentIcon: React.FC<AgentIconProps> = ({ icon, className }) => {
  if (typeof icon === 'string') {
    return <span className={className}>{icon}</span>;
  }
  const IconComponent = icon;
  return <IconComponent className={className} />;
};
