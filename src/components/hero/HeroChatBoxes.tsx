
import React from 'react';
import { Megaphone, ShoppingCart } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

interface HeroChatBoxesProps {
  language: 'en' | 'es';
}

// Agent interface to make our data more structured
interface Agent {
  id: string;
  icon: JSX.Element;
  color: string;
  title: {
    en: string;
    es: string;
  };
  question: {
    en: string;
    es: string;
  };
  response: {
    en: string;
    es: string;
  };
  responseColor: string;
}

export const HeroChatBoxes: React.FC<HeroChatBoxesProps> = ({ language }) => {
  // Define all agents in a structured format
  const agents: Agent[] = [
    // Accounting Agent
    {
      id: "accounting",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: "bg-gradient-to-br from-indigo-500 to-purple-600",
      title: {
        en: "Accounting Agent",
        es: "Agente Contable"
      },
      question: {
        en: "I need help categorizing my expenses for tax season",
        es: "Necesito ayuda para categorizar mis gastos para la temporada de impuestos"
      },
      response: {
        en: "I've analyzed your expenses and created categories based on tax deduction opportunities. Would you like me to generate monthly financial reports for your business?",
        es: "He analizado tus gastos y creado categorías basadas en oportunidades de deducción de impuestos. ¿Te gustaría que generara informes financieros mensuales para tu negocio?"
      },
      responseColor: "bg-purple-900/30 border-purple-700/30 text-purple-100"
    },
    
    // Operations Manager
    {
      id: "operations",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ),
      color: "bg-gradient-to-br from-pink-500 to-purple-600",
      title: {
        en: "Operations Manager",
        es: "Gerente de Operaciones"
      },
      question: {
        en: "We need to streamline our client onboarding process",
        es: "Necesitamos optimizar nuestro proceso de incorporación de clientes"
      },
      response: {
        en: "I've analyzed your current workflow and identified 3 bottlenecks. Let me create a new process map with automated notifications and document collection to reduce onboarding time by 40%.",
        es: "He analizado tu flujo de trabajo actual y he identificado 3 cuellos de botella. Permíteme crear un nuevo mapa de procesos con notificaciones automatizadas y recopilación de documentos para reducir el tiempo de incorporación en un 40%."
      },
      responseColor: "bg-pink-900/30 border-pink-700/30 text-pink-100"
    },
    
    // Legal Advisor
    {
      id: "legal",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      ),
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
      title: {
        en: "Legal Advisor",
        es: "Asesor Legal"
      },
      question: {
        en: "I need a contract template for new client projects",
        es: "Necesito una plantilla de contrato para nuevos proyectos con clientes"
      },
      response: {
        en: "Based on your industry and project scope, I've drafted a comprehensive contract with clear payment terms, intellectual property clauses, and milestone deliverables. Would you like me to add specific confidentiality requirements?",
        es: "Basado en tu industria y alcance del proyecto, he redactado un contrato integral con términos de pago claros, cláusulas de propiedad intelectual y entregables por hitos. ¿Te gustaría que agregara requisitos específicos de confidencialidad?"
      },
      responseColor: "bg-blue-900/30 border-blue-700/30 text-blue-100"
    },
    
    // Administrative Assistant
    {
      id: "admin",
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
      title: {
        en: "Administrative Assistant",
        es: "Asistente Administrativo"
      },
      question: {
        en: "Can you help me organize my calendar and emails for the next project launch?",
        es: "¿Puedes ayudarme a organizar mi calendario y correos electrónicos para el próximo lanzamiento del proyecto?"
      },
      response: {
        en: "I've sorted your emails by priority and created calendar blocks for focused work. I've also drafted response templates for common inquiries and scheduled weekly team status updates.",
        es: "He ordenado tus correos electrónicos por prioridad y creado bloques en el calendario para trabajo enfocado. También he redactado plantillas de respuesta para consultas comunes y programado actualizaciones semanales de estado del equipo."
      },
      responseColor: "bg-emerald-900/30 border-emerald-700/30 text-emerald-100"
    },
    
    // NEW: Marketing & Social Media Agent
    {
      id: "marketing",
      icon: <Megaphone className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      title: {
        en: "Marketing & Social Media Agent",
        es: "Agente de Marketing y Redes Sociales"
      },
      question: {
        en: "I need help creating a content calendar for our social media",
        es: "Necesito ayuda para crear un calendario de contenido para nuestras redes sociales"
      },
      response: {
        en: "I've analyzed your audience demographics and engagement patterns. Here's a 3-month content calendar with themes, posting times, and campaign ideas tailored to increase your reach by 35%.",
        es: "He analizado la demografía de tu audiencia y patrones de engagement. Aquí tienes un calendario de contenido de 3 meses con temas, horarios de publicación e ideas de campaña diseñadas para aumentar tu alcance en un 35%."
      },
      responseColor: "bg-amber-900/30 border-amber-700/30 text-amber-100"
    },
    
    // NEW: Catalog & Inventory Manager
    {
      id: "inventory",
      icon: <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      color: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
      title: {
        en: "Catalog & Inventory Manager",
        es: "Gestor de Catálogo e Inventario"
      },
      question: {
        en: "How can I track inventory levels across multiple sales channels?",
        es: "¿Cómo puedo seguir los niveles de inventario en múltiples canales de venta?"
      },
      response: {
        en: "I've set up an automated inventory tracking system that syncs across all your sales platforms. You'll get real-time updates and low stock alerts, plus I can generate forecasting reports based on seasonal trends.",
        es: "He configurado un sistema automatizado de seguimiento de inventario que se sincroniza en todas tus plataformas de venta. Recibirás actualizaciones en tiempo real y alertas de stock bajo, además puedo generar informes de pronóstico basados en tendencias estacionales."
      },
      responseColor: "bg-violet-900/30 border-violet-700/30 text-violet-100"
    }
  ];

  // Create a plugin array with autoplay configuration
  const plugins = [
    Autoplay({
      delay: 4000, // 4 seconds delay between slides
      stopOnInteraction: true, // stop autoplay when user interacts with carousel
      stopOnMouseEnter: true, // pause on mouse hover
    }),
  ];

  return (
    <div className="mt-12 md:mt-24 max-w-5xl mx-auto px-4 relative z-10">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 font-serif">
          {language === 'en' ? 'Back Office Agents for Every Need' : 'Agentes de Back Office para Cada Necesidad'}
        </h2>
        <p className="text-base md:text-lg text-indigo-100 max-w-3xl mx-auto">
          {language === 'en' 
            ? 'Each agent specializes in solving different back office challenges faced by creative businesses.' 
            : 'Cada agente se especializa en resolver diferentes desafíos de back office que enfrentan los negocios creativos.'}
        </p>
      </div>
      
      <div className="relative rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/50 to-purple-900/50 z-10 rounded-xl"></div>
        <div className="bg-black/30 p-4 md:p-8 rounded-xl border border-indigo-500/20 backdrop-blur-sm">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={plugins}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {agents.map((agent) => (
                <CarouselItem key={agent.id} className="pl-4 sm:basis-1/2 lg:basis-1/2 xl:basis-1/2">
                  <div className="flex-1 bg-indigo-900/50 rounded-lg p-3 md:p-5 border border-indigo-700/30 backdrop-blur-sm h-full">
                    <div className="flex items-center mb-3 md:mb-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${agent.color} flex items-center justify-center mr-3`}>
                        {agent.icon}
                      </div>
                      <h3 className="font-medium text-lg md:text-xl text-indigo-200">
                        {agent.title[language]}
                      </h3>
                    </div>
                    <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                      <p className="py-2 px-3 bg-indigo-800/50 rounded-md border border-indigo-700/30 text-indigo-100">
                        {agent.question[language]}
                      </p>
                      <p className={`py-2 px-3 ${agent.responseColor} rounded-md border`}>
                        {agent.response[language]}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center mt-4 gap-2">
              <CarouselPrevious className="relative hover:bg-indigo-800/50 hover:text-indigo-100 border-indigo-500/50 text-indigo-300" />
              <CarouselNext className="relative hover:bg-indigo-800/50 hover:text-indigo-100 border-indigo-500/50 text-indigo-300" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
