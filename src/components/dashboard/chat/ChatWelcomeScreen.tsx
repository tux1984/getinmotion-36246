
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot } from 'lucide-react';

interface ChatWelcomeScreenProps {
  language: 'en' | 'es';
  inputMessage: string;
  isProcessing: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatWelcomeScreen: React.FC<ChatWelcomeScreenProps> = ({
  language,
  inputMessage,
  isProcessing,
  onInputChange,
  onSubmit
}) => {
  const t = {
    en: {
      typeMessage: "Ask me anything...",
      aiReady: 'AI Assistant Ready',
      whatDiscuss: 'What would you like to discuss today?',
      startConversation: "Start a conversation"
    },
    es: {
      typeMessage: "Pregúntame lo que quieras...",
      aiReady: 'Asistente IA Listo',
      whatDiscuss: '¿De qué te gustaría hablar hoy?',
      startConversation: "Iniciar conversación"
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {t[language].aiReady}
          </h3>
          <p className="text-purple-200">
            {t[language].whatDiscuss}
          </p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={t[language].typeMessage}
            className="bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            disabled={!inputMessage.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
          >
            <Send className="w-4 h-4 mr-2" />
            {t[language].startConversation}
          </Button>
        </form>
      </div>
    </div>
  );
};
