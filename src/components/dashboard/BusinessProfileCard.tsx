import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, Sparkles } from 'lucide-react';

interface BusinessProfileCardProps {
  onOpenProfile: () => void;
  language: 'en' | 'es';
  isProfileComplete?: boolean;
}

export const BusinessProfileCard: React.FC<BusinessProfileCardProps> = ({
  onOpenProfile,
  language,
  isProfileComplete = false
}) => {
  const content = language === 'es' ? {
    title: '🧠 Perfil Empresarial Inteligente',
    description: 'Responde preguntas inteligentes para generar tareas más personalizadas',
    cta: 'Mejorar Mi Perfil',
    completeBadge: 'Perfil Completo',
    incompleteBadge: 'Completar Perfil'
  } : {
    title: '🧠 Smart Business Profile',
    description: 'Answer intelligent questions to generate more personalized tasks',
    cta: 'Enhance My Profile',
    completeBadge: 'Profile Complete',
    incompleteBadge: 'Complete Profile'
  };

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/30 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Brain className="w-7 h-7 text-purple-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-white">{content.title}</h3>
              {isProfileComplete && (
                <div className="flex items-center gap-1 bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  {content.completeBadge}
                </div>
              )}
            </div>
            <p className="text-white/80 text-sm mb-4">
              {content.description}
            </p>
            <Button
              onClick={onOpenProfile}
              variant="premium"
            >
              {content.cta}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};