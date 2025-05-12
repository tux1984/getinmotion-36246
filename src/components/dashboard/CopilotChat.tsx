
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  type: 'user' | 'copilot';
  content: string;
}

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
    
    // Simulate copilot response
    setTimeout(() => {
      let response = '';
      
      if (activeCopilot === 'sales') {
        response = language === 'en'
          ? "I understand you need help with sales. I've analyzed your recent inquiries and can help you create a response. Would you like me to generate a quote based on your standard rates?"
          : "Entiendo que necesitas ayuda con ventas. He analizado tus consultas recientes y puedo ayudarte a crear una respuesta. ¿Quieres que genere un presupuesto basado en tus tarifas estándar?";
      } else if (activeCopilot === 'events') {
        response = language === 'en'
          ? "I can help you organize your upcoming event. Would you like me to create a schedule template, send out invitations, or perhaps set up automated reminders for attendees?"
          : "Puedo ayudarte a organizar tu próximo evento. ¿Quieres que cree una plantilla de horario, envíe invitaciones o quizás configure recordatorios automatizados para los asistentes?";
      } else if (activeCopilot === 'community') {
        response = language === 'en'
          ? "I've analyzed your community engagement metrics from last week. Your latest post received 43% more interaction than average. Would you like me to suggest topics for your next content series?"
          : "He analizado las métricas de participación de tu comunidad de la semana pasada. Tu última publicación recibió un 43% más de interacción que el promedio. ¿Quieres que te sugiera temas para tu próxima serie de contenidos?";
      }
      
      setMessages(prev => [...prev, { type: 'copilot', content: response }]);
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
