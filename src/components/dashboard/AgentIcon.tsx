
import React from 'react';

interface AgentIconProps {
  icon: React.ReactNode;
  className?: string;
}

export const AgentIcon: React.FC<AgentIconProps> = ({ icon, className = "" }) => {
  // Handle null/undefined
  if (!icon) {
    return <div className={`w-6 h-6 bg-gray-300 rounded ${className}`} />;
  }

  // Handle string (emoji or text)
  if (typeof icon === 'string') {
    return <span className={className}>{icon}</span>;
  }

  // Handle number
  if (typeof icon === 'number') {
    return <span className={className}>{icon}</span>;
  }
  
  // Handle React elements
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement, { 
      className: `${className} w-6 h-6` 
    });
  }

  // Handle component functions (like Lucide icons)
  if (typeof icon === 'function') {
    try {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className={`${className} w-6 h-6`} />;
    } catch (error) {
      console.warn('Error rendering icon component:', error);
      return <div className={`w-6 h-6 bg-gray-300 rounded ${className}`} />;
    }
  }

  // Fallback for any other case
  console.warn('Unknown icon type:', typeof icon, icon);
  return <div className={`w-6 h-6 bg-gray-300 rounded ${className}`} />;
};
