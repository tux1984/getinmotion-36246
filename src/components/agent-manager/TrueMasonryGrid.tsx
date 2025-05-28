
import React, { useState, useEffect, useRef } from 'react';

interface TrueMasonryGridProps {
  children: React.ReactElement[];
  className?: string;
  columnWidth?: number;
  gap?: number;
}

export const TrueMasonryGrid: React.FC<TrueMasonryGridProps> = ({
  children,
  className = '',
  columnWidth = 400,
  gap = 20
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    const updateLayout = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const newColumns = Math.max(1, Math.floor((containerWidth + gap) / (columnWidth + gap)));
      
      if (newColumns !== columns) {
        setColumns(newColumns);
        setHeights(new Array(newColumns).fill(0));
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [columnWidth, gap, columns]);

  const getItemStyle = (index: number) => {
    if (heights.length === 0) return {};

    const columnIndex = heights.indexOf(Math.min(...heights));
    const left = columnIndex * (columnWidth + gap);
    const top = heights[columnIndex];

    return {
      position: 'absolute' as const,
      left: `${left}px`,
      top: `${top}px`,
      width: `${columnWidth}px`,
      transition: 'all 0.3s ease'
    };
  };

  const updateHeights = (index: number, height: number) => {
    const columnIndex = heights.indexOf(Math.min(...heights));
    const newHeights = [...heights];
    newHeights[columnIndex] += height + gap;
    setHeights(newHeights);
  };

  const containerHeight = heights.length > 0 ? Math.max(...heights) : 0;

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        height: `${containerHeight}px`,
        transition: 'height 0.3s ease'
      }}
    >
      {children.map((child, index) => (
        <div
          key={child.key || index}
          style={getItemStyle(index)}
          ref={(el) => {
            if (el) {
              const height = el.offsetHeight;
              if (height > 0) {
                updateHeights(index, height);
              }
            }
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
