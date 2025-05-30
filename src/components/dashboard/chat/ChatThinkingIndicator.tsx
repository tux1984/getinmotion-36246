
import React from 'react';
import { Bot } from 'lucide-react';

interface ChatThinkingIndicatorProps {
  language: 'en' | 'es';
}

export const ChatThinkingIndicator: React.FC<ChatThinkingIndicatorProps> = ({
  language
}) => {
  const t = {
    en: { thinking: "Thinking..." },
    es: { thinking: "Pensando..." }
  };

  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center mt-1 shadow-lg">
          <Bot className="w-5 h-5" />
        </div>
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
          <div className="flex space-x-2 items-center">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300"></div>
            <span className="text-xs text-purple-300 ml-2">
              {t[language].thinking}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
