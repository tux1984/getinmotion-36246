
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, X, RefreshCcw } from 'lucide-react';
import { Message } from '@/types/chat';
import { useAIAgent } from '@/hooks/use-ai-agent';
import { useLanguage } from '@/context/LanguageContext';

interface AIAssistantProps {
  onClose?: () => void;
  showHeader?: boolean;
}

export const AIAssistant = ({ onClose, showHeader = true }: AIAssistantProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const { messages, isProcessing, sendMessage, clearMessages } = useAIAgent();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  
  const t = {
    en: {
      title: "AI Assistant",
      placeholder: "Type your message...",
      send: "Send",
      thinking: "Thinking...",
      reset: "Reset Chat",
      emptyState: "Hello! How can I help you today?",
      apiErrorTitle: "Connection Issue",
      apiErrorDescription: "There might be an issue with the AI service. Please try again later."
    },
    es: {
      title: "Asistente IA",
      placeholder: "Escribe tu mensaje...",
      send: "Enviar",
      thinking: "Pensando...",
      reset: "Reiniciar Chat",
      emptyState: "¡Hola! ¿Cómo puedo ayudarte hoy?",
      apiErrorTitle: "Problema de Conexión",
      apiErrorDescription: "Puede haber un problema con el servicio de IA. Por favor, inténtalo más tarde."
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isProcessing) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[500px] flex flex-col">
      {showHeader && (
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mr-3">
              <Bot className="w-4 h-4" />
            </div>
            <h2 className="font-medium">{language === 'en' ? t.en.title : t.es.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearMessages}
                className="text-slate-500 hover:text-slate-700"
              >
                <RefreshCcw className="w-3 h-3 mr-1" />
                <span className="text-xs">{language === 'en' ? t.en.reset : t.es.reset}</span>
              </Button>
            )}
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{language === 'en' ? t.en.emptyState : t.es.emptyState}</p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-2">
              {message.type !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {message.content}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="max-w-[80%] p-3 rounded-lg bg-slate-100 text-slate-800">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-300"></div>
                  <span className="text-xs text-slate-400 ml-2">
                    {language === 'en' ? t.en.thinking : t.es.thinking}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={language === 'en' ? t.en.placeholder : t.es.placeholder}
            className="flex-grow"
            disabled={isProcessing}
          />
          <Button type="submit" disabled={!inputMessage.trim() || isProcessing}>
            <Send className="w-4 h-4 mr-2" />
            {language === 'en' ? t.en.send : t.es.send}
          </Button>
        </div>
      </form>
    </div>
  );
};
