
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Send, FileText, Calculator, FileSpreadsheet, Briefcase, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { Message } from '@/types/chat';
import { useAIAgent } from '@/hooks/use-ai-agent';

interface CopilotChatProps {
  agentId: string;
  onBack: () => void;
}

export const CopilotChat = ({ agentId, onBack }: CopilotChatProps) => {
  const { language } = useLanguage();
  const [inputMessage, setInputMessage] = useState('');
  const [copilotName, setCopilotName] = useState('');
  const [copilotColor, setCopilotColor] = useState('');
  const [copilotIcon, setCopilotIcon] = useState<React.ReactNode>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use our AI agent hook with the specific agent type
  const { messages, isProcessing, sendMessage, clearMessages } = useAIAgent(agentId);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const translations = {
    en: {
      enterMessage: "Type your message...",
      send: "Send",
      reset: "Reset Chat",
      thinking: "Thinking..."
    },
    es: {
      enterMessage: "Escribe tu mensaje...",
      send: "Enviar",
      reset: "Reiniciar Chat",
      thinking: "Pensando..."
    }
  };
  
  const t = translations[language];

  useEffect(() => {
    // Set initial greeting message based on agent type
    let greeting = '';
    
    if (agentId === 'admin') {
      setCopilotName(language === 'en' ? 'Administrative Assistant' : 'Asistente Administrativo');
      setCopilotColor('bg-violet-100 text-violet-700');
      setCopilotIcon(<FileText className="w-5 h-5" />);
      greeting = language === 'en' 
        ? "Hi there! I'm your Administrative Assistant. I can help you organize your files, manage appointments, and handle correspondence. How can I assist you today?"
        : "¡Hola! Soy tu Asistente Administrativo. Puedo ayudarte a organizar tus archivos, gestionar citas y manejar correspondencia. ¿Cómo puedo ayudarte hoy?";
    } else if (agentId === 'accounting') {
      setCopilotName(language === 'en' ? 'Accounting Agent' : 'Agente Contable');
      setCopilotColor('bg-indigo-100 text-indigo-700');
      setCopilotIcon(<Calculator className="w-5 h-5" />);
      greeting = language === 'en'
        ? "Hello! I'm your Accounting Agent. I can help you track expenses, prepare for tax filings, and manage your financial records. What financial tasks are you working on?"
        : "¡Hola! Soy tu Agente Contable. Puedo ayudarte a seguir gastos, preparar declaraciones de impuestos y gestionar tus registros financieros. ¿En qué tareas financieras estás trabajando?";
    } else if (agentId === 'legal') {
      setCopilotName(language === 'en' ? 'Legal Advisor' : 'Asesor Legal');
      setCopilotColor('bg-blue-100 text-blue-700');
      setCopilotIcon(<FileSpreadsheet className="w-5 h-5" />);
      greeting = language === 'en'
        ? "Hi! I'm your Legal Advisor. I can help you understand legal requirements, review contracts, and manage compliance issues. What legal matters can I assist you with today?"
        : "¡Hola! Soy tu Asesor Legal. Puedo ayudarte a entender requisitos legales, revisar contratos y gestionar temas de cumplimiento. ¿En qué asuntos legales puedo ayudarte hoy?";
    } else if (agentId === 'operations') {
      setCopilotName(language === 'en' ? 'Operations Manager' : 'Gerente de Operaciones');
      setCopilotColor('bg-emerald-100 text-emerald-700');
      setCopilotIcon(<Briefcase className="w-5 h-5" />);
      greeting = language === 'en'
        ? "Hello! I'm your Operations Manager. I'm here to help streamline your business processes and optimize your workflows. What operational challenges can I help you with today?"
        : "¡Hola! Soy tu Gerente de Operaciones. Estoy aquí para ayudarte a optimizar tus procesos de negocio y mejorar tus flujos de trabajo. ¿En qué desafíos operativos puedo ayudarte hoy?";
    } else if (agentId === 'cultural') {
      setCopilotName(language === 'en' ? 'Cultural Creator Agent' : 'Agente para Creadores Culturales');
      setCopilotColor('bg-pink-100 text-pink-700');
      setCopilotIcon(<Palette className="w-5 h-5" />);
      greeting = language === 'en'
        ? "Hi there! I'm your Cultural Creator Agent. I can help you with contracts, cost calculations, portfolio creation, and export strategies specific to cultural creators. How can I assist you today?"
        : "¡Hola! Soy tu Agente para Creadores Culturales. Puedo ayudarte con contratos, cálculos de costos, creación de portafolios y estrategias de exportación específicas para creadores culturales. ¿Cómo puedo ayudarte hoy?";
    }
    
    // Add initial greeting if we have one and there are no messages
    if (greeting && messages.length === 0) {
      sendMessage(greeting);
    }
  }, [agentId, language]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isProcessing) return;
    sendMessage(inputMessage);
    setInputMessage('');
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
        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearMessages}
              className="text-slate-500 hover:text-slate-700"
            >
              <span className="text-xs">{language === 'en' ? t.reset : t.reset}</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
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
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-slate-100 text-slate-800">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-300"></div>
                <span className="text-xs text-slate-400 ml-2">
                  {language === 'en' ? t.thinking : t.thinking}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={language === 'en' ? t.enterMessage : t.enterMessage}
            className="flex-grow"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isProcessing}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isProcessing}
          >
            <Send className="w-4 h-4 mr-2" />
            {language === 'en' ? t.send : t.send}
          </Button>
        </div>
      </div>
    </div>
  );
};
