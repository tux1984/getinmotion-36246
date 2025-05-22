
import React from 'react';
import { motion } from 'framer-motion';

interface IconOptionProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: (id: string) => void;
}

export const IconOption: React.FC<IconOptionProps> = ({ 
  id, 
  icon, 
  label, 
  selected, 
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected 
          ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 shadow-md' 
          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
      }`}
      onClick={() => onClick(id)}
      layout
    >
      <div className="flex flex-col items-center text-center">
        <motion.div 
          className={`w-16 h-16 mb-4 rounded-lg flex items-center justify-center relative ${
            selected 
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600'
          }`}
          animate={selected ? { y: [0, -3, 0] } : { y: 0 }}
          transition={selected ? { 
            duration: 0.5, 
            ease: "easeInOut", 
            delay: 0.1
          } : {}}
        >
          <div className="text-2xl">
            {icon}
          </div>
          
          {/* Subtle glow effect for selected state */}
          {selected && (
            <motion.div 
              className="absolute -inset-1 rounded-lg bg-purple-300/20 blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
        
        <span className={`font-medium text-base ${selected ? 'text-purple-800' : 'text-gray-700'}`}>
          {label}
        </span>
      </div>
    </motion.div>
  );
};
