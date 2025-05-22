
import React from 'react';
import { motion } from 'framer-motion';

interface IconOptionProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const IconOption: React.FC<IconOptionProps> = ({ 
  id, 
  icon, 
  label, 
  selected, 
  onSelect 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
        selected 
          ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-100 shadow-lg shadow-emerald-100/40' 
          : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/30'
      }`}
      onClick={() => onSelect(id)}
      layout
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center relative group ${
          selected 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <motion.div
            animate={selected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <div className="text-2xl">
              {icon}
            </div>
          </motion.div>
          
          {/* 3D-like effect with shadow and glow */}
          <motion.div 
            className={`absolute inset-0 rounded-2xl ${selected ? 'bg-emerald-400/20' : 'bg-transparent'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: selected ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.div 
            className="absolute -inset-2 rounded-3xl bg-emerald-300/20 blur-xl opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: selected ? 0.8 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <span className={`font-medium text-lg ${selected ? 'text-emerald-900' : 'text-gray-700'}`}>
          {label}
        </span>
      </div>
    </motion.div>
  );
};
