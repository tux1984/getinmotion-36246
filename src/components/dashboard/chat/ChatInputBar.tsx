
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputBarProps {
  inputMessage: string;
  isProcessing: boolean;
  language: 'en' | 'es';
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  inputMessage,
  isProcessing,
  language,
  onInputChange,
  onSubmit
}) => {
  const t = {
    en: { typeMessage: "Ask me anything..." },
    es: { typeMessage: "Pregúntame lo que quieras..." }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={onSubmit}>
          <div className="flex gap-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-3">
            <Input
              value={inputMessage}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={t[language].typeMessage}
              className="flex-grow bg-transparent border-none text-white placeholder:text-purple-300 focus:ring-0 focus:border-none"
              disabled={isProcessing}
            />
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isProcessing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
