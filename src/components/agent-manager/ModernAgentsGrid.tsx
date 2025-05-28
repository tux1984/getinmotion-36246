
import React from 'react';

interface ModernAgentsGridProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernAgentsGrid: React.FC<ModernAgentsGridProps> = ({
  children,
  className = ''
}) => {
  return (
    <div 
      className={`
        grid 
        grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        gap-6 
        auto-rows-max
        ${className}
      `}
      style={{
        // Future-proof for CSS Grid Level 3 masonry support
        gridAutoRows: 'masonry'
      }}
    >
      {children}
    </div>
  );
};
