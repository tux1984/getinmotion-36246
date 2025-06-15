
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PremiumStatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  color: string;
  bgColor: string;
}

export const PremiumStatsCard: React.FC<PremiumStatsCardProps> = ({
  icon: Icon,
  title,
  value,
  color,
  bgColor
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-center"
    >
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bgColor} mb-2`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-xl font-bold text-white mb-1">{value}</div>
      <div className="text-white/70 text-xs">{title}</div>
    </motion.div>
  );
};
