import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Target, MessageCircle, ArrowRight, Brain, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanDetection } from '@/hooks/useArtisanDetection';
import { CreateShopQuickAction } from './CreateShopQuickAction';
import { BusinessProfileDialog } from '@/components/master-coordinator/BusinessProfileDialog';
import { useUserBusinessContext } from '@/hooks/useUserBusinessContext';

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
  const { context, hasCompleteProfile } = useUserBusinessContext();
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);

  const translations = {
    en: {
      getGuidance: 'AI Expert Chat',
      guidanceDesc: 'Get personalized guidance instantly',
      chatNow: 'Chat Now',
      viewTasks: 'Explore Tasks',
      tasksDesc: 'Manage and track your progress',
      viewAll: 'View All',
      createShop: 'Create Digital Shop',
      shopDesc: 'Build your online store with AI',
      improveProfile: 'Improve My Profile',
      profileDesc: 'Answer intelligent questions to get better recommendations',
      enhanceProfile: 'Enhance Profile',
      completeProfile: 'Complete Profile',
      completeDesc: 'Set up your business profile for personalized tasks'
    },
    es: {
      getGuidance: 'Chat IA Experta',
      guidanceDesc: 'Obtén orientación personalizada',
      chatNow: 'Chatear Ahora',
      viewTasks: 'Explorar Tareas',
      tasksDesc: 'Gestiona y rastrea tu progreso',
      viewAll: 'Ver Todas',
      createShop: 'Crear Tienda Digital',
      shopDesc: 'Construye tu tienda online con IA',
      improveProfile: 'Mejorar Mi Perfil',
      profileDesc: 'Responde preguntas inteligentes para mejores recomendaciones',
      enhanceProfile: 'Mejorar Perfil',
      completeProfile: 'Completar Perfil',
      completeDesc: 'Configura tu perfil empresarial para tareas personalizadas'
    }
  };

  const t = translations[language];

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-fr">
            
            {/* AI Expert Chat Action */}
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer"
                  onClick={onMasterAgentChat}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-sm">{t.getGuidance}</h4>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{t.guidanceDesc}</p>
              <Button size="sm" variant="default" className="w-full text-xs">
                <MessageCircle className="w-3 h-3 mr-1" />
                {t.chatNow}
              </Button>
            </Card>

            {/* View All Tasks Action */}
            <Card className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20 hover:border-secondary/40 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/dashboard/tasks')}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-secondary" />
                  <h4 className="font-semibold text-sm">{t.viewTasks}</h4>
                </div>
                {activeTasks > 0 && (
                  <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-medium">
                    {activeTasks}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{t.tasksDesc}</p>
              <Button size="sm" variant="outline" className="w-full text-xs">
                <ArrowRight className="w-3 h-3 mr-1" />
                {t.viewAll}
              </Button>
            </Card>

            {/* Intelligent Profile Questions Action */}
            <Card className="p-4 bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 hover:border-violet-300 transition-all duration-300 cursor-pointer"
                  onClick={() => setShowBusinessDialog(true)}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-violet-600" />
                  <h4 className="font-semibold text-sm">
                    {hasCompleteProfile ? t.improveProfile : t.completeProfile}
                  </h4>
                </div>
                {!hasCompleteProfile && (
                  <Sparkles className="w-4 h-4 text-violet-600" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {hasCompleteProfile ? t.profileDesc : t.completeDesc}
              </p>
              <Button size="sm" variant="outline" className="w-full text-xs border-violet-200 text-violet-700 hover:bg-violet-50">
                <Brain className="w-3 h-3 mr-1" />
                {hasCompleteProfile ? t.enhanceProfile : t.completeProfile}
              </Button>
            </Card>

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

      {/* Business Profile Dialog */}
      <BusinessProfileDialog 
        open={showBusinessDialog}
        onOpenChange={setShowBusinessDialog}
        language={language}
      />
    </>
  );
};

export default QuickActionsPanel;