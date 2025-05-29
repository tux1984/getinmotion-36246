
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModernChatInterface } from '@/components/chat/ModernChatInterface';
import { MobileChatLayout } from '@/components/chat/MobileChatLayout';
import { FileText, Calculator, FileSpreadsheet, Briefcase, Palette } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ModernCopilotChatProps {
  agentId: string;
  onBack?: () => void;
}

export const ModernCopilotChat = ({ agentId, onBack }: ModernCopilotChatProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();

  // Get agent configuration based on agentId
  const getAgentConfig = (agentId: string) => {
    switch(agentId) {
      case 'contract-generator':
        return {
          name: language === 'en' ? 'Contract Generator' : 'Generador de Contratos',
          color: 'bg-blue-100 text-blue-700',
          icon: <FileSpreadsheet className="w-5 h-5" />
        };
      case 'cost-calculator':
        return {
          name: language === 'en' ? 'Cost Calculator' : 'Calculador de Costos',
          color: 'bg-emerald-100 text-emerald-700',
          icon: <Calculator className="w-5 h-5" />
        };
      case 'maturity-evaluator':
        return {
          name: language === 'en' ? 'Maturity Evaluator' : 'Evaluador de Madurez',
          color: 'bg-violet-100 text-violet-700',
          icon: <FileText className="w-5 h-5" />
        };
      case 'admin':
        return {
          name: language === 'en' ? 'Administrative Assistant' : 'Asistente Administrativo',
          color: 'bg-violet-100 text-violet-700',
          icon: <FileText className="w-5 h-5" />
        };
      case 'accounting':
        return {
          name: language === 'en' ? 'Accounting Agent' : 'Agente Contable',
          color: 'bg-indigo-100 text-indigo-700',
          icon: <Calculator className="w-5 h-5" />
        };
      case 'legal':
        return {
          name: language === 'en' ? 'Legal Advisor' : 'Asesor Legal',
          color: 'bg-blue-100 text-blue-700',
          icon: <FileSpreadsheet className="w-5 h-5" />
        };
      case 'operations':
        return {
          name: language === 'en' ? 'Operations Manager' : 'Gerente de Operaciones',
          color: 'bg-emerald-100 text-emerald-700',
          icon: <Briefcase className="w-5 h-5" />
        };
      case 'cultural':
        return {
          name: language === 'en' ? 'Cultural Creator Agent' : 'Agente para Creadores Culturales',
          color: 'bg-pink-100 text-pink-700',
          icon: <Palette className="w-5 h-5" />
        };
      default:
        return {
          name: language === 'en' ? 'Assistant' : 'Asistente',
          color: 'bg-slate-100 text-slate-700',
          icon: <FileText className="w-5 h-5" />
        };
    }
  };

  const agentConfig = getAgentConfig(agentId);

  const ChatComponent = isMobile ? MobileChatLayout : ModernChatInterface;

  return (
    <div className="h-full">
      <ChatComponent
        agentId={agentId}
        agentName={agentConfig.name}
        agentColor={agentConfig.color}
        agentIcon={agentConfig.icon}
        onClose={onBack}
      />
    </div>
  );
};
