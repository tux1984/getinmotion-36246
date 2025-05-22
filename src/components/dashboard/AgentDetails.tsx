
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Download, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { CopilotChat } from './CopilotChat';

interface AgentDetailsProps {
  agentId: string;
  language: 'en' | 'es';
}

export const AgentDetails: React.FC<AgentDetailsProps> = ({ agentId, language }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const isMobile = useIsMobile();
  
  // Determine agent name based on ID
  const getAgentName = () => {
    switch(agentId) {
      case 'contract-generator':
        return '🧾 A2 - Contrato Cultural';
      case 'cost-calculator':
        return '💰 A1 - Cálculo de costos';
      case 'maturity-evaluator':
        return '📊 A3 - Evaluador de madurez';
      default:
        return 'Agente';
    }
  };
  
  const t = {
    en: {
      chatWithAgent: "Chat with agent",
      generatedTasks: "Generated tasks",
      deliverables: "Deliverables",
      completeHistory: "Complete history",
      viewMore: "View more",
      typeYourMessage: "Type your message...",
      send: "Send",
      contractReady: "Contract ready to review (PDF)",
      paymentTerms: "Suggested payment terms added",
      rightsClause: "Rights clause added",
      contractFile: "Contract_Mural_ExpoBogota.pdf",
      sentEmail: "Sent to your email and saved here",
      viewDeliveryHistory: "View delivery history"
    },
    es: {
      chatWithAgent: "Chat con el agente",
      generatedTasks: "Tareas generadas",
      deliverables: "Entregables",
      completeHistory: "Historial completo",
      viewMore: "Ver más",
      typeYourMessage: "Escribe tu mensaje...",
      send: "Enviar",
      contractReady: "Contrato listo para revisar (PDF)",
      paymentTerms: "Plazo sugerido de pago agregado",
      rightsClause: "Cláusula de derechos añadida",
      contractFile: "Contrato_Mural_ExpoBogotá.pdf",
      sentEmail: "Enviado a tu correo y guardado aquí",
      viewDeliveryHistory: "Ver historial de entregas"
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">{getAgentName()}</h1>

      <Tabs defaultValue="chat" className="mb-4 sm:mb-6" onValueChange={handleTabChange}>
        <TabsList className="w-full mb-2 h-auto p-1 bg-slate-100">
          <TabsTrigger className="text-xs sm:text-sm py-1.5 data-[state=active]:bg-white" value="chat">
            💬 {t[language].chatWithAgent}
          </TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm py-1.5 data-[state=active]:bg-white" value="tasks">
            📋 {t[language].generatedTasks}
          </TabsTrigger>
          <TabsTrigger className="text-xs sm:text-sm py-1.5 data-[state=active]:bg-white" value="deliverables">
            📄 {t[language].deliverables}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="mt-3 sm:mt-4">
          {/* Use CopilotChat for OpenAI integration */}
          {activeTab === 'chat' && (
            <div className="h-[500px]">
              <CopilotChat 
                agentId={agentId} 
                onBack={() => {}} 
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-3 sm:mt-4 space-y-3">
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="pt-4 sm:pt-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-sm">{t[language].contractReady}</span>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 text-sm">✓</span>
                  </div>
                  <span className="text-sm">{t[language].paymentTerms}</span>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  <span className="text-sm">{t[language].rightsClause}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deliverables" className="mt-3 sm:mt-4 space-y-3">
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="pt-4 sm:pt-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-lg">📄</span>
                    </div>
                    <span className="font-medium text-sm">{t[language].contractFile}</span>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs">PDF</span>
                  </Button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                  <span>📬</span>
                  {t[language].sentEmail}
                </p>
                <div className="pt-1 sm:pt-2">
                  <Button variant="link" size="sm" className="p-0 h-auto text-xs sm:text-sm">
                    <span className="mr-1">🔁</span>
                    {t[language].viewDeliveryHistory}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Collapsible className="w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium">
            <span className="mr-2">🕑</span>
            {t[language].completeHistory}
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{t[language].viewMore}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <Separator className="my-3 sm:my-4" />
        <CollapsibleContent>
          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="flex justify-between">
              <p className="text-xs sm:text-sm font-medium">2023-05-18</p>
              <p className="text-xs sm:text-sm text-gray-600">Contrato generado</p>
            </div>
            <div className="flex justify-between">
              <p className="text-xs sm:text-sm font-medium">2023-05-17</p>
              <p className="text-xs sm:text-sm text-gray-600">Consulta inicial</p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
