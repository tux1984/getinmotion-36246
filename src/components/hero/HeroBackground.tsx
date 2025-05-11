
import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <>
      {/* Sophisticated artistic background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-60 h-60 rounded-full bg-pink-500/30 blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-500/30 blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full bg-purple-500/30 blur-[150px]"></div>
      </div>
      
      {/* Enhanced sound wave animation effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15">
        <div className="flex items-end space-x-1.5 h-40">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div 
              key={i} 
              className="w-2 bg-white/80 rounded-full animate-pulse" 
              style={{ 
                height: `${Math.sin(i / 2) * 50 + 50}%`,
                animationDuration: `${1 + (i / 5)}s`,
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Added geometric elements for sophistication */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 border border-pink-300/20 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-60 h-60 border border-indigo-300/20 rounded-full"></div>
        <div className="absolute top-40 right-1/4 w-20 h-20 border border-purple-300/20 rounded-full"></div>
        
        {/* Dotted grid pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', 
               backgroundSize: '30px 30px' 
             }}>
        </div>
      </div>
    </>
  );
};
