import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Play, 
  MessageCircle, 
  Calculator, 
  Brain,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface IntelligentStartButtonProps {
  onStartNow: () => void;
  onTalkAboutBusiness: () => void;
  onRecalculateMaturity: () => void;
  coordinatorMessage: any;
  loading?: boolean;
  language: 'en' | 'es';
}

export const IntelligentStartButton: React.FC<IntelligentStartButtonProps> = ({
  onStartNow,
  onTalkAboutBusiness,
  onRecalculateMaturity,
  coordinatorMessage,
  loading = false,
  language
}) => {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const translations = {
    en: {
      startNow: 'Start Now',
      talkBusiness: 'Tell me about your business',
      recalculate: 'Recalculate Maturity',
      masterCoordinator: 'Master Coordinator',
      chooseAction: 'Choose your next action'
    },
    es: {
      startNow: 'Empezar Ahora',
      talkBusiness: 'Hablar de mi negocio',
      recalculate: 'Recalcular Madurez',
      masterCoordinator: 'Coordinador Maestro',
      chooseAction: 'Elige tu siguiente acción'
    }
  };

  const t = translations[language];

  const actions = [
    {
      id: 'start',
      title: t.startNow,
      description: language === 'es' 
        ? 'Activa el coordinador y genera tareas personalizadas' 
        : 'Activate coordinator and generate personalized tasks',
      icon: Play,
      color: 'bg-primary text-primary-foreground',
      onClick: onStartNow,
      primary: true
    },
    {
      id: 'talk',
      title: t.talkBusiness,
      description: language === 'es' 
        ? 'Profundiza en tu perfil con preguntas inteligentes' 
        : 'Deepen your profile with intelligent questions',
      icon: MessageCircle,
      color: 'bg-secondary text-secondary-foreground',
      onClick: onTalkAboutBusiness
    },
    {
      id: 'recalculate',
      title: t.recalculate,
      description: language === 'es' 
        ? 'Actualiza tu nivel de madurez empresarial' 
        : 'Update your business maturity level',
      icon: Calculator,
      color: 'bg-accent text-accent-foreground',
      onClick: onRecalculateMaturity
    }
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{t.masterCoordinator}</h3>
            <p className="text-sm text-muted-foreground">{coordinatorMessage?.message}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            {t.chooseAction}
          </p>
          
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={action.primary ? "default" : "outline"}
                className={`w-full justify-start h-auto p-4 ${
                  action.primary ? action.color : ''
                } ${hoveredAction === action.id ? 'scale-105' : ''}`}
                onClick={action.onClick}
                disabled={loading}
                onMouseEnter={() => setHoveredAction(action.id)}
                onMouseLeave={() => setHoveredAction(null)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    action.primary ? 'bg-primary-foreground/20' : 'bg-primary/10'
                  }`}>
                    <action.icon className={`w-4 h-4 ${
                      action.primary ? 'text-primary-foreground' : 'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className={`text-xs ${
                      action.primary ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      {action.description}
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${
                    action.primary ? 'text-primary-foreground/60' : 'text-muted-foreground'
                  }`} />
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>
              {language === 'es' 
                ? 'Generando recomendaciones inteligentes...' 
                : 'Generating intelligent recommendations...'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};