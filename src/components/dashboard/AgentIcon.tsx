
import React from 'react';

interface AgentIconProps {
  icon: React.ReactNode;
  className?: string;
}

export const AgentIcon: React.FC<AgentIconProps> = ({ icon, className }) => {
  if (typeof icon === 'string' || typeof icon === 'number') {
    return <span className={className}>{icon}</span>;
  }

  if (React.isValidElement(icon)) {
    return icon;
  }

  if (icon && typeof icon !== 'boolean') {
    const IconComponent = icon as React.ElementType;
    return <IconComponent className={className} />;
  }

  return null;
};
