
import React from 'react';

interface AgentIconProps {
  icon: React.ReactNode;
  className?: string;
}

export const AgentIcon: React.FC<AgentIconProps> = ({ icon, className = "" }) => {
  // ARREGLO CRÍTICO: Manejo más robusto de diferentes tipos de iconos
  console.log('AgentIcon: Rendering with icon type:', typeof icon, icon);

  // Handle null/undefined - return placeholder
  if (!icon) {
    return <div className={`w-6 h-6 bg-gray-300 rounded flex items-center justify-center ${className}`}>
      <span className="text-xs text-gray-600">?</span>
    </div>;
  }

  // Handle string (emoji or text) - most common case
  if (typeof icon === 'string') {
    return <span className={`inline-flex items-center justify-center w-6 h-6 ${className}`}>{icon}</span>;
  }

  // Handle number - convert to string
  if (typeof icon === 'number') {
    return <span className={`inline-flex items-center justify-center w-6 h-6 ${className}`}>{icon.toString()}</span>;
  }
  
  // Handle React elements - clone with proper props
  if (React.isValidElement(icon)) {
    try {
      return React.cloneElement(icon as React.ReactElement, { 
        className: `w-6 h-6 ${className}` 
      });
    } catch (error) {
      console.warn('AgentIcon: Error cloning React element:', error);
      return <div className={`w-6 h-6 bg-gray-300 rounded flex items-center justify-center ${className}`}>
        <span className="text-xs text-gray-600">⚠</span>
      </div>;
    }
  }

  // Handle component functions (like Lucide icons)
  if (typeof icon === 'function') {
    try {
      const IconComponent = icon as React.ComponentType<{ className?: string; size?: number }>;
      return <IconComponent className={`w-6 h-6 ${className}`} size={24} />;
    } catch (error) {
      console.warn('AgentIcon: Error rendering icon component:', error);
      return <div className={`w-6 h-6 bg-gray-300 rounded flex items-center justify-center ${className}`}>
        <span className="text-xs text-gray-600">⚠</span>
      </div>;
    }
  }

  // ARREGLO CRÍTICO: Si llegamos aquí, es un objeto que no es React element
  console.warn('AgentIcon: Unknown icon type, returning fallback:', typeof icon, icon);
  return <div className={`w-6 h-6 bg-gray-300 rounded flex items-center justify-center ${className}`}>
    <span className="text-xs text-gray-600">?</span>
  </div>;
};
