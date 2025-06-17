
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, Palette, Scale, Settings, FileText, Users, Target, TrendingUp } from 'lucide-react';
import { getAgentById } from '@/data/agentsDatabase';

interface ChatHeaderProps {
  agentId: string;
  language: 'en' | 'es';
  onBack?: () => void;
  showHeader?: boolean;
}

const getAgentIcon = (agentId: string) => {
  const iconMap = {
    'cost-calculator': Calculator,
    'collaboration-agreement': Scale,
    'maturity-evaluator': TrendingUp,
    'cultural-consultant': Palette,
    'project-manager': Settings,
    'marketing-advisor': Target,
    'export-advisor': FileText,
    'collaboration-pitch': Users,
    'portfolio-catalog': FileText,
    'artwork-description': FileText,
    'income-calculator': Calculator,
    'branding-strategy': Palette,
    'personal-brand-eval': Users,
    'funding-routes': Target,
    'contract-generator': Scale,
    'tax-compliance': FileText,
    'social-impact-eval': Target,
    'pricing-assistant': Calculator,
    'stakeholder-matching': Users
  };
  
  return iconMap[agentId as keyof typeof iconMap] || FileText;
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  agentId,
  language,
  onBack,
  showHeader = true
}) => {
  if (!showHeader) {
    return null;
  }

  const agent = getAgentById(agentId);
  const IconComponent = getAgentIcon(agentId);
  
  const agentName = agent?.name || (language === 'en' ? 'AI Assistant' : 'Asistente IA');
  const agentDescription = agent?.description || (language === 'en' ? 'Ready to help you' : 'Listo para ayudarte');

  const t = {
    en: { backToDashboard: "Back to Dashboard" },
    es: { backToDashboard: "Volver al Dashboard" }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-t-2xl border-b border-white/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-lg">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{agentName}</h2>
            <p className="text-sm text-purple-200">{agentDescription}</p>
          </div>
        </div>
        
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t[language].backToDashboard}
          </Button>
        )}
      </div>
    </div>
  );
};
