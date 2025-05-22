
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
        selected 
          ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md' 
          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
      }`}
      onClick={() => onSelect(id)}
      layout
    >
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          selected 
            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <motion.div
            animate={selected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        </div>
        <span className={`ml-3 font-medium ${selected ? 'text-purple-900' : 'text-gray-700'}`}>{label}</span>
      </div>
    </motion.div>
  );
};
