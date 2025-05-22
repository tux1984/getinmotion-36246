
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
  // Determine which 3D illustration to show based on industry
  const get3dIllustration = () => {
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

  if (fullWidth) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className={`w-full space-y-8 ${className}`}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 mb-3">
            {title}
          </h2>
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>
        <div className="space-y-6 w-full">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col lg:flex-row gap-8 lg:gap-12 ${className}`}
    >
      <div className="flex-1 space-y-8 max-w-xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 mb-3">
            {title}
          </h2>
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>
        <div className="space-y-6">
          {children}
        </div>
      </div>

      <div className="hidden lg:block flex-1 max-w-md">
        <div className="sticky top-6 rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-purple-50 to-indigo-100">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut" 
              }}
            />
            <img 
              src={get3dIllustration()}
              alt="3D Illustration" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
