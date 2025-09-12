import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Target, MessageCircle, ArrowRight, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useArtisanDetection } from '@/hooks/useArtisanDetection';

interface QuickActionsPanelProps {
  language: 'en' | 'es';
  onMasterAgentChat: () => void;
  activeTasks?: number;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  language,
  onMasterAgentChat,
  activeTasks = 0
}) => {
  const navigate = useNavigate();
  const { isArtisan, craftType, loading: detectionLoading } = useArtisanDetection();

  const translations = {
    en: {
      getGuidance: 'AI Expert Chat',
      guidanceDesc: 'Get personalized guidance instantly',
      chatNow: 'Chat Now',
      viewTasks: 'Explore Tasks',
      tasksDesc: 'Manage and track your progress',
      viewAll: 'View All',
      createShop: 'Create Digital Shop',
      shopDesc: 'Build your online store with AI'
    },
    es: {
      getGuidance: 'Chat IA Experta',
      guidanceDesc: 'Obtén orientación personalizada',
      chatNow: 'Chatear Ahora',
      viewTasks: 'Explorar Tareas',
      tasksDesc: 'Gestiona y rastrea tu progreso',
      viewAll: 'Ver Todas',
      createShop: 'Crear Tienda Digital',
      shopDesc: 'Construye tu tienda online con IA'
    }
  };

  const t = translations[language];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className={`grid grid-cols-1 ${isArtisan || detectionLoading ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          
          {/* AI Expert Chat Action */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-amber-500/10 p-4 group cursor-pointer"
            onClick={onMasterAgentChat}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="font-semibold text-foreground">{t.getGuidance}</h3>
                  <p className="text-xs text-muted-foreground">{t.guidanceDesc}</p>
                </div>
              </div>
              <Button 
                size="sm"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onMasterAgentChat();
                }}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                {t.chatNow}
              </Button>
            </div>
          </motion.div>

          {/* View All Tasks Action */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/10 via-cyan-600/5 to-green-500/10 p-4 group cursor-pointer"
            onClick={() => navigate('/dashboard/tasks')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{t.viewTasks}</h3>
                    {activeTasks > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                        {activeTasks}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{t.tasksDesc}</p>
                </div>
              </div>
              <Button 
                size="sm"
                variant="outline"
                className="w-full border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/dashboard/tasks');
                }}
              >
                <ArrowRight className="w-3 h-3 mr-1" />
                {t.viewAll}
              </Button>
            </div>
          </motion.div>

          {/* Create Digital Shop Action - Enhanced for artisans */}
          {(isArtisan || detectionLoading) && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-600/15 to-cyan-500/20 p-6 group cursor-pointer border border-emerald-200 dark:border-emerald-800 shadow-lg"
              onClick={() => navigate('/dashboard/create-shop')}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Sparkle decoration */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-2 right-2 w-4 h-4 text-emerald-400 opacity-60"
              >
                ✨
              </motion.div>
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-lg">{t.createShop}</h3>
                        <span className="inline-flex items-center px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded-full">
                          ¡Nuevo!
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">{t.shopDesc}</p>
                      {craftType && (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                          {language === 'es' ? '🎨 ' : '🎨 '}{craftType}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    IA automática
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    Alcance global
                  </div>
                </div>
                
                <Button 
                  size="sm"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/dashboard/create-shop');
                  }}
                >
                  <Store className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Crear Mi Tienda' : 'Create My Shop'}
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-2"
                  >
                    →
                  </motion.div>
                </Button>
              </div>
            </motion.div>
          )}

        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsPanel;