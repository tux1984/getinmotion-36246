
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Send, FileText, Calculator, FileSpreadsheet, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { Message } from '@/types/chat';

interface CopilotChatProps {
  agentId: string;
  onBack: () => void;
}

export const CopilotChat = ({ agentId, onBack }: CopilotChatProps) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copilotName, setCopilotName] = useState('');
  const [copilotColor, setCopilotColor] = useState('');
  const [copilotIcon, setCopilotIcon] = useState<React.ReactNode>(null);
  
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
        ? "This agent is coming soon! Check back for updates."
        : "¡Este agente estará disponible pronto! Vuelve para ver actualizaciones.";
    }
    
    // Add initial greeting if we have one
    if (greeting) {
      setMessages([{ type: 'agent', content: greeting }]);
    }
  }, [agentId, language]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate agent response
    setTimeout(() => {
      let response = '';
      
      if (agentId === 'admin') {
        response = language === 'en'
          ? "I can help you organize your administrative tasks. Would you like me to create a filing system for your documents or help manage your calendar appointments?"
          : "Puedo ayudarte a organizar tus tareas administrativas. ¿Te gustaría que creara un sistema de archivo para tus documentos o que te ayudara a gestionar tus citas en el calendario?";
      } else if (agentId === 'accounting') {
        response = language === 'en'
          ? "I've analyzed your recent expenses. Would you like me to categorize them for tax purposes or prepare a monthly financial summary?"
          : "He analizado tus gastos recientes. ¿Te gustaría que los categorizara para fines fiscales o preparara un resumen financiero mensual?";
      } else if (agentId === 'legal') {
        response = language === 'en'
          ? "I can help with your legal documentation needs. Would you like me to review your existing contracts or create a new template for your upcoming business partnerships?"
          : "Puedo ayudarte con tus necesidades de documentación legal. ¿Te gustaría que revisara tus contratos existentes o creara una nueva plantilla para tus próximas asociaciones comerciales?";
      } else if (agentId === 'operations') {
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
          onClick={onBack}
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
