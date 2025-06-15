
import React from 'react';

interface AgentIconProps {
  icon: React.ReactNode;
  className?: string;
}

export const AgentIcon: React.FC<AgentIconProps> = ({ icon, className }) => {
  // Primitives
  if (typeof icon === 'string' || typeof icon === 'number') {
    return <span className={className}>{icon}</span>;
  }
  
  // React Elements
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement, { className });
  }

  // Component Type (function or object like forwardRef/memo)
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && '$$typeof' in icon)) {
    const IconComponent = icon as React.ElementType;
    return <IconComponent className={className} />;
  }

  // Fallback for other valid ReactNode types like null, undefined, boolean, array, fragment
  // which can be rendered directly inside a fragment.
  return <>{icon}</>;
};
