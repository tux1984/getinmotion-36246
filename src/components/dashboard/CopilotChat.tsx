
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { Message } from '@/types/chat';

interface CopilotChatProps {
  activeCopilot: string;
  onClose: () => void;
  copilotIcon: React.ReactNode;
  copilotColor: string;
  copilotName: string;
  initialMessages: Message[];
}

export const CopilotChat = ({ 
  activeCopilot, 
  onClose, 
  copilotIcon, 
  copilotColor, 
  copilotName, 
  initialMessages 
}: CopilotChatProps) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const translations = {
    en: {
      enterMessage: "Type your message...",
      send: "Send"
    },
    es: {
      enterMessage: "Escribe tu mensaje...",
      send: "Enviar"
    }
  };
  
  const t = translations[language];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate agent response
    setTimeout(() => {
      let response = '';
      
      if (activeCopilot === 'admin') {
        response = language === 'en'
          ? "I can help you organize your administrative tasks. Would you like me to create a filing system for your documents or help manage your calendar appointments?"
          : "Puedo ayudarte a organizar tus tareas administrativas. ¿Te gustaría que creara un sistema de archivo para tus documentos o que te ayudara a gestionar tus citas en el calendario?";
      } else if (activeCopilot === 'accounting') {
        response = language === 'en'
          ? "I've analyzed your recent expenses. Would you like me to categorize them for tax purposes or prepare a monthly financial summary?"
          : "He analizado tus gastos recientes. ¿Te gustaría que los categorizara para fines fiscales o preparara un resumen financiero mensual?";
      } else if (activeCopilot === 'legal') {
        response = language === 'en'
          ? "I can help with your legal documentation needs. Would you like me to review your existing contracts or create a new template for your upcoming business partnerships?"
          : "Puedo ayudarte con tus necesidades de documentación legal. ¿Te gustaría que revisara tus contratos existentes o creara una nueva plantilla para tus próximas asociaciones comerciales?";
      } else if (activeCopilot === 'operations') {
        response = language === 'en'
          ? "As your Operations Manager, I can help streamline your business processes. What operational challenges are you facing today?"
          : "Como tu Gerente de Operaciones, puedo ayudarte a optimizar tus procesos de negocio. ¿Qué desafíos operativos estás enfrentando hoy?";
      }
      
      setMessages(prev => [...prev, { type: 'agent', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full ${copilotColor} flex items-center justify-center mr-3`}>
            {copilotIcon}
          </div>
          <h2 className="font-medium">{copilotName}</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-slate-100 text-slate-800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.enterMessage}
            className="flex-grow"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4 mr-2" />
            {t.send}
          </Button>
        </div>
      </div>
    </div>
  );
};
