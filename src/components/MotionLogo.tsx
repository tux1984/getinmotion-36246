
import React from 'react';

export const MotionLogo = () => {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          <path d="M19.5 10c0 7.142-7.5 11.25-7.5 11.25S4.5 17.142 4.5 10a7.5 7.5 0 1 1 15 0z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
        Motion
      </span>
    </div>
  );
};
