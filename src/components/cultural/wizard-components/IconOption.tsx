
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
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
        selected 
          ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-indigo-100 shadow-lg shadow-purple-100/40' 
          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/30'
      }`}
      onClick={() => onClick(id)}
      layout
    >
      <div className="flex flex-col items-center text-center">
        <motion.div 
          className={`w-24 h-24 mb-6 rounded-2xl flex items-center justify-center relative group overflow-hidden ${
            selected 
              ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-300/30' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80'
          }`}
          animate={selected ? { y: [0, -5, 0] } : { y: 0 }}
          transition={selected ? { 
            duration: 0.5, 
            ease: "easeInOut", 
            delay: 0.1,
            repeatDelay: 5,
            repeat: Infinity,
            repeatType: "loop"
          } : {}}
        >
          <motion.div
            animate={selected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <div className="text-3xl">
              {icon}
            </div>
          </motion.div>
          
          {/* Enhanced 3D-like effect with shadow and glow */}
          <motion.div 
            className={`absolute inset-0 rounded-2xl ${selected ? 'bg-purple-400/20' : 'bg-transparent'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: selected ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.div 
            className="absolute -inset-2 rounded-3xl bg-purple-300/20 blur-xl opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: selected ? 0.8 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Animated background */}
          {selected && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20"
              animate={{
                background: [
                  'linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))',
                  'linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3))',
                  'linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>
        
        <span className={`font-medium text-xl ${selected ? 'text-purple-900' : 'text-gray-700'}`}>
          {label}
        </span>
      </div>
    </motion.div>
  );
};
