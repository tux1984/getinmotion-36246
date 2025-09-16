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
                variant="default"
                className="w-full"
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

          {/* Create Digital Shop Action - Only for artisans */}
          {(isArtisan || detectionLoading) && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500/10 via-teal-600/5 to-cyan-500/10 p-4 group cursor-pointer"
              onClick={() => navigate('/dashboard/create-shop')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-2">
                  <Store className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-foreground">{t.createShop}</h3>
                    <p className="text-xs text-muted-foreground">{t.shopDesc}</p>
                    {craftType && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {language === 'es' ? 'Especialidad: ' : 'Specialty: '}{craftType}
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  size="sm"
                  variant="success"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/dashboard/create-shop');
                  }}
                >
                  <Store className="w-3 h-3 mr-1" />
                  {language === 'es' ? 'Crear Ahora' : 'Create Now'}
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