
import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <>
      {/* Artistic background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-pink-500 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-purple-500 blur-3xl"></div>
      </div>
      
      {/* Sound wave animation effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="flex items-end space-x-2 h-32">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div 
              key={i} 
              className="w-4 bg-white rounded-full animate-pulse" 
              style={{ 
                height: `${Math.sin(i / 2) * 50 + 50}%`,
                animationDuration: `${1 + (i / 5)}s`,
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
};
