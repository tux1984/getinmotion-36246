
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileTaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    agentId: string;
    agentName: string;
    priority: 'high' | 'medium' | 'low';
    category?: string;
    estimatedTime: string;
  };
  index: number;
  onStartTask: (task: any) => void;
  language: 'en' | 'es';
}

export const MobileTaskCard: React.FC<MobileTaskCardProps> = ({
  task,
  index,
  onStartTask,
  language
}) => {
  const t = {
    en: {
      high: "High",
      medium: "Medium", 
      low: "Low",
      startWithAgent: "Start with"
    },
    es: {
      high: "Alta",
      medium: "Media",
      low: "Baja",
      startWithAgent: "Empezar con"
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '📝';
      default: return '📋';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/10 rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-lg">{getPriorityIcon(task.priority)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h4 className="font-semibold text-white text-base leading-tight">{task.title}</h4>
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {t[language][task.priority]}
            </Badge>
          </div>
          {task.category && (
            <Badge variant="outline" className="text-white/70 border-white/30 text-xs mb-2">
              {task.category}
            </Badge>
          )}
        </div>
      </div>
      
      <p className="text-white/80 text-sm mb-3 leading-relaxed">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-white/50 mb-4">
        <span>👤 {task.agentName}</span>
        <span>⏱️ {task.estimatedTime}</span>
      </div>
      
      <Button
        onClick={() => onStartTask(task)}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
        size="sm"
      >
        <Play className="w-4 h-4 mr-2" />
        {t[language].startWithAgent} {task.agentName}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
};
