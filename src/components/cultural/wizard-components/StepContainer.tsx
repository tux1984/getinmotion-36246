
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StepContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  illustration?: string;
  industry?: string;
  fullWidth?: boolean;
}

export const StepContainer: React.FC<StepContainerProps> = ({ 
  title, 
  subtitle,
  children,
  className = "",
  illustration,
  industry,
  fullWidth = false
}) => {
  // Determine which illustration to show based on industry
  const getIllustration = () => {
    switch (industry) {
      case 'music':
        return "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop";
      case 'visual_arts':
        return "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop";
      case 'crafts':
        return "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=800&auto=format&fit=crop";
      case 'theater':
        return "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop";
      case 'events':
        return "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop";
      default:
        return illustration || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`w-full max-w-4xl mx-auto flex flex-col ${className}`}
    >
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
          {title}
        </h2>
        {subtitle && <p className="text-gray-600 text-lg md:text-xl">{subtitle}</p>}
      </div>
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-8 items-start">
        <div className={`space-y-6 ${fullWidth ? 'lg:col-span-6' : 'lg:col-span-4'}`}>
          {children}
        </div>
        
        {!fullWidth && (
          <div className="hidden lg:block lg:col-span-2">
            <motion.div 
              className="sticky top-6 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-50 to-indigo-100 aspect-[3/4]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"
                  animate={{ opacity: [0.4, 0.6, 0.4] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut" 
                  }}
                />
                <img 
                  src={getIllustration()}
                  alt="Visual representation" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
