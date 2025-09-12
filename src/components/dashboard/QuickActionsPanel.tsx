import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Target, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanDetection } from '@/hooks/useArtisanDetection';
import { CreateShopQuickAction } from './CreateShopQuickAction';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          
          {/* AI Expert Chat Action */}
          <div className="p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors cursor-pointer"
               onClick={onMasterAgentChat}>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-primary" />
              <h4 className="font-medium text-sm">{t.getGuidance}</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{t.guidanceDesc}</p>
            <Button size="sm" variant="default" className="w-full text-xs">
              <MessageCircle className="w-3 h-3 mr-1" />
              {t.chatNow}
            </Button>
          </div>

          {/* View All Tasks Action */}
          <div className="p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors cursor-pointer"
               onClick={() => navigate('/dashboard/tasks')}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <div className="flex-1 flex items-center justify-between">
                <h4 className="font-medium text-sm">{t.viewTasks}</h4>
                {activeTasks > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {activeTasks}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{t.tasksDesc}</p>
            <Button size="sm" variant="outline" className="w-full text-xs">
              <ArrowRight className="w-3 h-3 mr-1" />
              {t.viewAll}
            </Button>
          </div>

          {/* Create Digital Shop Action - Simplified and stable */}
          {(isArtisan || detectionLoading) && (
            <CreateShopQuickAction
              language={language}
              craftType={craftType}
            />
          )}

        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsPanel;