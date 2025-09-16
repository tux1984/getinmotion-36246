import React from 'react';
import { Crown, Target, MessageCircle, ArrowRight, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useArtisanDetection } from '@/hooks/useArtisanDetection';

interface QuickActionsPanelProps {
  language: 'en' | 'es';
  onMasterAgentChat: () => void;
  activeTasks?: number;
}

// Simplified quick actions - no Card wrapper, clean grid
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
    <div className={`grid grid-cols-1 ${isArtisan || detectionLoading ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
      
      {/* AI Expert Chat Action */}
      <div
        className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
        onClick={onMasterAgentChat}
      >
        <div className="flex items-center space-x-3 mb-3">
          <Crown className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">{t.getGuidance}</h3>
            <p className="text-xs text-muted-foreground">{t.guidanceDesc}</p>
          </div>
        </div>
        <button 
          className="w-full bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onMasterAgentChat();
          }}
        >
          <MessageCircle className="w-3 h-3" />
          {t.chatNow}
        </button>
      </div>

      {/* View All Tasks Action */}
      <div
        className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
        onClick={() => navigate('/dashboard/tasks')}
      >
        <div className="flex items-center space-x-3 mb-3">
          <Target className="w-5 h-5 text-secondary" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{t.viewTasks}</h3>
              {activeTasks > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary rounded-full">
                  {activeTasks}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{t.tasksDesc}</p>
          </div>
        </div>
        <button 
          className="w-full border border-secondary text-secondary px-3 py-2 rounded-md text-sm hover:bg-secondary hover:text-secondary-foreground transition-colors inline-flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/dashboard/tasks');
          }}
        >
          <ArrowRight className="w-3 h-3" />
          {t.viewAll}
        </button>
      </div>

      {/* Create Digital Shop Action - Only for artisans */}
      {(isArtisan || detectionLoading) && (
        <div
          className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => navigate('/dashboard/create-shop')}
        >
          <div className="flex items-center space-x-3 mb-3">
            <Store className="w-5 h-5 text-success" />
            <div>
              <h3 className="font-semibold text-sm">{t.createShop}</h3>
              <p className="text-xs text-muted-foreground">{t.shopDesc}</p>
              {craftType && (
                <p className="text-xs text-success font-medium">
                  {language === 'es' ? 'Especialidad: ' : 'Specialty: '}{craftType}
                </p>
              )}
            </div>
          </div>
          <button 
            className="w-full bg-success text-success-foreground px-3 py-2 rounded-md text-sm hover:bg-success/90 transition-colors inline-flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/dashboard/create-shop');
            }}
          >
            <Store className="w-3 h-3" />
            {language === 'es' ? 'Crear Ahora' : 'Create Now'}
          </button>
        </div>
      )}

    </div>
  );
};

export default QuickActionsPanel;