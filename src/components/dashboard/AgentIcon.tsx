
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
  
  // React Elements (already created)
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement, { className });
  }

  // Component Type (e.g., function components, or memo/forwardRef components from libraries like lucide-react)
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && '$$typeof' in icon)) {
    // Cast to 'unknown' first to resolve the TS build error TS2352.
    // This tells TypeScript we know what we're doing by overriding its type inference.
    const IconComponent = icon as unknown as React.ElementType;
    return <IconComponent className={className} />;
  }

  // Fallback for any other valid ReactNode like null, undefined, or fragments.
  // This will prevent rendering invalid objects that might have slipped through.
  if (typeof icon === 'object' && icon !== null) {
      console.warn("AgentIcon: Received an unrenderable object, rendering null instead.", icon);
      return null;
  }

  return <>{icon}</>;
};
