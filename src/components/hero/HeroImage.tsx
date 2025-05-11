
import React from 'react';

export const HeroImage: React.FC = () => {
  return (
    <div className="relative w-full md:w-1/2 mt-8 md:mt-0">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-indigo-600/40 rounded-xl blur-sm -m-1 z-10"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-sm opacity-70 z-0"></div>
      <div className="relative overflow-hidden rounded-xl shadow-2xl z-20">
        <img 
          src="/lovable-uploads/e2faf820-4987-4cf2-a69b-0b534fbbecbd.png" 
          alt="Motion for artists, musicians and artisans" 
          className="w-full h-auto object-cover bg-indigo-900/80"
        />
      </div>
      
      {/* Musical notes decoration */}
      <div className="absolute -top-6 -right-6 text-pink-300 text-5xl opacity-30 rotate-12">♪</div>
      <div className="absolute top-1/4 -left-8 text-indigo-300 text-4xl opacity-20 -rotate-6">♫</div>
      <div className="absolute bottom-10 right-5 text-purple-300 text-6xl opacity-25 rotate-3">♬</div>
    </div>
  );
};
