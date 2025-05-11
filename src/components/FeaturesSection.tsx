
import React from 'react';
import { Calendar, MessageSquare, Settings, Users, Image, Star, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturesSectionProps {
  language: 'en' | 'es';
}

export const FeaturesSection = ({ language }: FeaturesSectionProps) => {
  const translations = {
    en: {
      title: "Copilots for every need",
      subtitle: "Each copilot specializes in solving different challenges faced by small teams.",
      features: [
        {
          icon: <MessageSquare className="w-10 h-10 text-violet-600" />,
          title: "Personal Assistant",
          description: "Interact with your copilot from a simple panel or WhatsApp. It responds, generates proposals, and automates everyday tasks.",
          previewText: "Ask a question",
          responseText: "I've analyzed your schedule and prepared a response for your client."
        },
        {
          icon: <Calendar className="w-10 h-10 text-violet-600" />,
          title: "Event Organizer",
          description: "Plan shows, workshops, or events with an assistant that organizes calendars, sends reminders, and manages RSVPs.",
          previewText: "Schedule a new event",
          responseText: "Event created! I've sent invitations and set up reminders for all participants."
        },
        {
          icon: <Users className="w-10 h-10 text-violet-600" />,
          title: "Community Manager",
          description: "Answers frequently asked questions, analyzes your audience's sentiment, and maintains constant communication.",
          previewText: "Check community feedback",
          responseText: "I've summarized the key comments and identified trending topics in your community."
        },
        {
          icon: <Settings className="w-10 h-10 text-violet-600" />,
          title: "Customizable by Sector",
          description: "Adapt your copilot based on whether you're dedicated to music, visual arts, logistics, crafts, or other creative sectors.",
          previewText: "Customize settings",
          responseText: "Your copilot has been configured for the music industry with specialized templates."
        }
      ],
      betaText: "Motion is in beta phase with the first real customers including musicians, cultural producers, and artisan communities.",
      joinButton: "Join the first users",
      tryItButton: "Try it now",
      viewMore: "View more"
    },
    es: {
      title: "Copilots para cada necesidad",
      subtitle: "Cada copilot se especializa en resolver distintos desafíos que enfrentan los equipos pequeños.",
      features: [
        {
          icon: <MessageSquare className="w-10 h-10 text-violet-600" />,
          title: "Asistente Personal",
          description: "Interactúa con tu copilot desde un panel sencillo o WhatsApp. Te responde, genera propuestas y automatiza tareas cotidianas.",
          previewText: "Haz una pregunta",
          responseText: "He analizado tu agenda y preparado una respuesta para tu cliente."
        },
        {
          icon: <Calendar className="w-10 h-10 text-violet-600" />,
          title: "Organizador de Eventos",
          description: "Planifica shows, reuniones o talleres con un asistente que organiza calendarios, envía recordatorios y gestiona RSVPs.",
          previewText: "Programa un nuevo evento",
          responseText: "¡Evento creado! He enviado invitaciones y configurado recordatorios para todos los participantes."
        },
        {
          icon: <Users className="w-10 h-10 text-violet-600" />,
          title: "Gestor de Comunidad",
          description: "Responde preguntas frecuentes, analiza el sentimiento de tu audiencia y mantiene una comunicación constante.",
          previewText: "Revisar feedback de la comunidad",
          responseText: "He resumido los comentarios clave e identificado temas tendencia en tu comunidad."
        },
        {
          icon: <Settings className="w-10 h-10 text-violet-600" />,
          title: "Personalizable por Sector",
          description: "Adapta tu copilot según te dediques a la música, artes visuales, logística, artesanía u otros sectores creativos.",
          previewText: "Personalizar configuración",
          responseText: "Tu copilot ha sido configurado para la industria musical con plantillas especializadas."
        }
      ],
      betaText: "Motion está en fase beta con los primeros clientes reales incluyendo músicos, productores culturales y comunidades de artesanos.",
      joinButton: "Únete a los primeros usuarios",
      tryItButton: "Pruébalo ahora",
      viewMore: "Ver más"
    }
  };

  const t = translations[language];
  
  const [activeFeature, setActiveFeature] = React.useState<number | null>(null);
  const [showResponse, setShowResponse] = React.useState(false);
  
  const handleTryFeature = (index: number) => {
    setActiveFeature(index);
    setShowResponse(false);
    setTimeout(() => {
      setShowResponse(true);
    }, 800);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border ${activeFeature === index ? 'border-violet-300 ring-2 ring-violet-100' : 'border-gray-100'}`}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              
              <div className="mt-4">
                {activeFeature === index ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-sm text-slate-600">{feature.previewText}</p>
                    </div>
                    
                    {showResponse && (
                      <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg animate-fade-in">
                        <div className="flex items-start gap-2">
                          <Star className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                          <p className="text-sm text-violet-700">{feature.responseText}</p>
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-violet-600 mt-2"
                      onClick={() => setActiveFeature(null)}
                    >
                      {t.viewMore} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-[3/2] rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full">
                      {/* Feature image or illustration */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50">
                        <Image className="w-10 h-10 text-slate-300" />
                      </div>
                      
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="absolute bottom-3 right-3 bg-white shadow-sm"
                        onClick={() => handleTryFeature(index)}
                      >
                        {t.tryItButton}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 aspect-[4/3] bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50 p-6">
              <div className="w-full max-w-sm p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                    <Send className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Motion Assistant</h3>
                    <p className="text-xs text-slate-500">{language === 'en' ? 'Online' : 'En línea'}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-600">
                      {language === 'en' ? 'How can I create a new invoice?' : '¿Cómo puedo crear una nueva factura?'}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Star className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-violet-700">
                        {language === 'en' 
                          ? 'I can help you create an invoice. Would you like to use your default template or create a custom one?' 
                          : 'Puedo ayudarte a crear una factura. ¿Quieres usar tu plantilla predeterminada o crear una personalizada?'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    {language === 'en' ? 'Default template' : 'Plantilla predeterminada'}
                  </Button>
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                    {language === 'en' ? 'Custom' : 'Personalizada'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-lg text-gray-600 mb-8">
              {t.betaText}
            </p>
            <Button 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 px-8 rounded-lg font-medium"
              onClick={() => document.getElementById('access')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.joinButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
