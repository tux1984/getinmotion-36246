
import React, { useEffect, useRef, useState } from 'react';

interface JavaScriptMasonryGridProps {
  children: React.ReactNode;
  className?: string;
  columnWidth?: number;
  gap?: number;
}

export const JavaScriptMasonryGrid: React.FC<JavaScriptMasonryGridProps> = ({
  children,
  className = '',
  columnWidth = 350,
  gap = 24
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    const layoutMasonry = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const columns = Math.max(1, Math.floor((containerWidth + gap) / (columnWidth + gap)));
      const actualColumnWidth = (containerWidth - (columns - 1) * gap) / columns;
      
      // Array to track the height of each column
      const columnHeights = new Array(columns).fill(0);
      
      // Get all child elements
      const items = Array.from(container.children) as HTMLElement[];
      
      items.forEach((item, index) => {
        // Find the shortest column
        const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        
        // Calculate position
        const x = shortestColumnIndex * (actualColumnWidth + gap);
        const y = columnHeights[shortestColumnIndex];
        
        // Set position
        item.style.position = 'absolute';
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        item.style.width = `${actualColumnWidth}px`;
        
        // Wait for the item to render, then update column height
        requestAnimationFrame(() => {
          const itemHeight = item.offsetHeight;
          columnHeights[shortestColumnIndex] += itemHeight + gap;
          
          // Update container height to the tallest column
          const maxHeight = Math.max(...columnHeights) - gap;
          container.style.height = `${maxHeight}px`;
          
          // Mark as ready when last item is positioned
          if (index === items.length - 1) {
            setIsLayoutReady(true);
          }
        });
      });
    };

    // Initial layout
    const timer = setTimeout(() => {
      layoutMasonry();
    }, 100);

    // Relayout on window resize
    const handleResize = () => {
      setIsLayoutReady(false);
      setTimeout(layoutMasonry, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [children, columnWidth, gap]);

  return (
    <div 
      ref={containerRef}
      className={`relative transition-opacity duration-300 ${isLayoutReady ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ minHeight: '200px' }}
    >
      {children}
    </div>
  );
};
