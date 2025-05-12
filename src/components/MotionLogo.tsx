
import React from 'react';

export const MotionLogo = () => {
  return (
    <div className="flex items-center bg-indigo-900/40 px-3 py-2 rounded-lg">
      <img 
        src="/lovable-uploads/f8038b45-1f3e-4034-9af0-f7c1fd90dcab.png" 
        alt="Motion Logo" 
        className="h-10 w-auto mr-2 filter drop-shadow-lg"
      />
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-indigo-200 drop-shadow-sm">
        GET IN MOTION
      </span>
    </div>
  );
};
