
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
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center"
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bgColor} mb-3`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-white/70 text-sm">{title}</div>
    </motion.div>
  );
};
