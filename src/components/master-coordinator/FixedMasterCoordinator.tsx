import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMasterCoordinator } from '@/hooks/useMasterCoordinator';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Target,
  PlayCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface FixedMasterCoordinatorProps {
  onTaskStart?: (taskId: string) => void;
}

export const FixedMasterCoordinator: React.FC<FixedMasterCoordinatorProps> = ({ onTaskStart }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFullMessage, setShowFullMessage] = useState(false);
  
  const { 
    coordinatorMessage, 
    nextUnlockedTask, 
    coordinatorTasks,
    startTaskJourney 
  } = useMasterCoordinator();

  const completedTasks = coordinatorTasks.filter(task => task.steps.every(step => step.isCompleted));
  const progressPercentage = coordinatorTasks.length > 0 
    ? Math.round((completedTasks.length / coordinatorTasks.length) * 100) 
    : 0;

  const handleStartTask = async (taskId: string) => {
    const success = await startTaskJourney(taskId);
    if (success) {
      onTaskStart?.(taskId);
      navigate(`/dashboard/tasks/${taskId}`);
    }
  };

  const handleChatWithCoordinator = () => {
    navigate('/dashboard/agent/master-coordinator');
  };

  const translations = {
    en: {
      masterCoordinator: 'Master Coordinator',
      personalGuide: 'Your Personal Business Guide',
      alwaysHere: 'Always here to guide your entrepreneurial journey',
      currentMission: 'Current Mission',
      startMission: 'Start Mission',
      chatWithMe: 'Chat with me',
      progress: 'Progress',
      completedTasks: 'completed tasks',
      showMore: 'Show more',
      showLess: 'Show less',
      nextSteps: 'Next Steps',
      getStarted: 'Get Started'
    },
    es: {
      masterCoordinator: 'Coordinador Maestro',
      personalGuide: 'Tu Guía Personal de Negocios',
      alwaysHere: 'Siempre aquí para guiar tu viaje empresarial',
      currentMission: 'Misión Actual',
      startMission: 'Iniciar Misión',
      chatWithMe: 'Habla conmigo',
      progress: 'Progreso',
      completedTasks: 'tareas completadas',
      showMore: 'Ver más',
      showLess: 'Ver menos',
      nextSteps: 'Próximos Pasos',
      getStarted: 'Empezar'
    }
  };

  const t = translations[language];

  const getMessagePreview = (message: string, limit: number = 120) => {
    return message.length > limit ? message.substring(0, limit) + '...' : message;
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-primary/20 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-none shadow-none bg-gradient-to-r from-purple-600/90 via-indigo-600/90 to-blue-600/90 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              
              {/* Master Coordinator Identity */}
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                    <Crown className="w-6 h-6 text-yellow-300" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </motion.div>
                </motion.div>
                
                <div>
                  <h2 className="text-lg font-bold">{t.masterCoordinator}</h2>
                  <p className="text-white/80 text-sm">{t.personalGuide}</p>
                </div>
              </div>

              {/* Progress Badge */}
              <div className="hidden md:flex items-center space-x-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Target className="w-3 h-3 mr-1" />
                  {progressPercentage}% {t.progress}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {completedTasks.length} {t.completedTasks}
                </Badge>
              </div>

              {/* Expand/Collapse Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:bg-white/20"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-4">
                    
                    {/* Coordinator Message */}
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-start space-x-3">
                        <MessageCircle className="w-5 h-5 text-white/80 mt-1" />
                        <div className="flex-1">
                          <p className="text-white leading-relaxed">
                            {showFullMessage 
                              ? coordinatorMessage.message 
                              : getMessagePreview(coordinatorMessage.message)
                            }
                          </p>
                          {coordinatorMessage.message.length > 120 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowFullMessage(!showFullMessage)}
                              className="text-white/80 hover:text-white p-0 h-auto mt-1"
                            >
                              {showFullMessage ? t.showLess : t.showMore}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      
                      {/* Next Task Action */}
                      {nextUnlockedTask && coordinatorMessage.taskId && (
                        <Button
                          onClick={() => handleStartTask(coordinatorMessage.taskId!)}
                          className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {t.startMission}: {nextUnlockedTask.title}
                        </Button>
                      )}

                      {/* Chat Button */}
                      <Button
                        variant="outline"
                        onClick={handleChatWithCoordinator}
                        className="border-white/30 text-white hover:bg-white/20"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {t.chatWithMe}
                      </Button>

                      {/* Quick Stats on Mobile */}
                      <div className="md:hidden flex space-x-2">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {progressPercentage}%
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {completedTasks.length} ✓
                        </Badge>
                      </div>
                    </div>

                    {/* Next Tasks Preview */}
                    {coordinatorTasks.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-white/90 mb-2 flex items-center">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          {t.nextSteps}
                        </h4>
                        <div className="space-y-1">
                          {coordinatorTasks.slice(0, 3).map((task, index) => (
                            <div key={task.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  task.isUnlocked ? 'bg-green-400' : 'bg-white/30'
                                }`} />
                                <span className="text-white/80 truncate">{task.title}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-white/60">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{task.estimatedTime}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};