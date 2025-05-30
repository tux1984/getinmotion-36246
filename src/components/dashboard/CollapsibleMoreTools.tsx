
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown,
  ChevronUp,
  Settings,
  Download,
  HelpCircle,
  MoreHorizontal
} from 'lucide-react';

interface CollapsibleMoreToolsProps {
  language: 'en' | 'es';
}

export const CollapsibleMoreTools: React.FC<CollapsibleMoreToolsProps> = ({
  language
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const t = {
    en: {
      moreTools: 'More Tools',
      exportChat: 'Export Chat',
      settings: 'Settings',
      help: 'Help'
    },
    es: {
      moreTools: 'Más Herramientas',
      exportChat: 'Exportar Chat',
      settings: 'Configuración',
      help: 'Ayuda'
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-full">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between text-white hover:bg-white/10 p-3 h-auto rounded-2xl"
      >
        <div className="flex items-center gap-2">
          <MoreHorizontal className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium">{t[language].moreTools}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
      
      {isExpanded && (
        <div className="p-3 pt-0">
          <div className="space-y-1">
            <button className="w-full text-left text-xs text-purple-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Download className="w-3 h-3 inline mr-2" />
              {t[language].exportChat}
            </button>
            <button className="w-full text-left text-xs text-purple-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-3 h-3 inline mr-2" />
              {t[language].settings}
            </button>
            <button className="w-full text-left text-xs text-purple-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
              <HelpCircle className="w-3 h-3 inline mr-2" />
              {t[language].help}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
