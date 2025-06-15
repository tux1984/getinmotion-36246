
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
    // If it's already an element, we should clone it to add the className
    return React.cloneElement(icon as React.ReactElement, { className });
  }

  // This handles function components (including class components)
  if (typeof icon === 'function') {
    const IconComponent = icon;
    return <IconComponent className={className} />;
  }
  
  // This handles special component objects from React.memo or React.forwardRef
  if (typeof icon === 'object' && icon !== null && '$$typeof' in icon) {
    const IconComponent = icon as React.ElementType;
    return <IconComponent className={className} />;
  }

  return null;
};
