
import React from 'react';
import { Button } from '@/components/ui/button';
import { Palette, Briefcase, Clock, Rocket } from 'lucide-react';

interface HeroSectionProps {
  language: 'en' | 'es';
  onJoinWaitlist: () => void;
}

export const HeroSection = ({ language, onJoinWaitlist }: HeroSectionProps) => {
  const translations = {
    en: {
      title: "Your virtual team powered by AI",
      subtitle: "AI copilots that automate administrative tasks, boost your growth, and improve your communication. Designed for creators, organizations, and entrepreneurs worldwide.",
      waitlist: "Join the waitlist",
      learnMore: "Learn more",
      whatIsMotion: "What is Motion?",
      motionDescription: "Motion is a platform that helps artists, musicians, and artisans build and manage their creative business — from contracts and payments to publishing and outreach — with tailored AI tools that grow with them.",
      motionPurpose: "Motion empowers cultural creators to build sustainable careers without sacrificing their creative energy.",
      creativePlatform: "AI-Powered Creative Platform",
      creativePlatformDesc: "A comprehensive platform designed specifically for creators.",
      businessSuite: "Business Management Suite",
      businessSuiteDesc: "Simplifies contracts, payments, publishing, and outreach.",
      timeProtector: "Creative Time Protector",
      timeProtectorDesc: "Removes daily business friction so creators can focus on their art and impact.",
      growthPartner: "Growth Partner",
      growthPartnerDesc: "Adaptive tools that evolve alongside creators' journeys and expanding needs."
    },
    es: {
      title: "Tu equipo virtual impulsado por IA",
      subtitle: "Copilots de inteligencia artificial que automatizan tareas administrativas, impulsan tu crecimiento y mejoran tu comunicación. Diseñado para creadores, organizaciones y emprendedores de todo el mundo.",
      waitlist: "Unirse a la lista de espera",
      learnMore: "Conocer más",
      whatIsMotion: "¿Qué es Motion?",
      motionDescription: "Motion es una plataforma que ayuda a artistas, músicos y artesanos a construir y gestionar su negocio creativo — desde contratos y pagos hasta publicación y difusión — con herramientas de IA personalizadas que crecen con ellos.",
      motionPurpose: "Motion empodera a los creadores culturales para construir carreras sostenibles sin sacrificar su energía creativa.",
      creativePlatform: "Plataforma Creativa con IA",
      creativePlatformDesc: "Una plataforma integral diseñada específicamente para creadores.",
      businessSuite: "Suite de Gestión de Negocios",
      businessSuiteDesc: "Simplifica contratos, pagos, publicación y difusión.",
      timeProtector: "Protector del Tiempo Creativo",
      timeProtectorDesc: "Elimina la fricción diaria del negocio para que los creadores puedan centrarse en su arte e impacto.",
      growthPartner: "Socio de Crecimiento",
      growthPartnerDesc: "Herramientas adaptativas que evolucionan junto a los creadores y sus necesidades en expansión."
    }
  };

  const t = translations[language];

  return (
    <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              {t.title}
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                onClick={onJoinWaitlist}
              >
                {t.waitlist}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.learnMore}
              </Button>
            </div>
          </div>
          
          <div className="relative w-full md:w-1/2 mt-8 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-indigo-600/40 rounded-xl z-10"></div>
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
              <img 
                src="/lovable-uploads/4d2abc22-b792-462b-8247-6cc413c71b23.png" 
                alt="Motion AI project management interface" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 max-w-5xl mx-auto px-4">
        <div className="relative rounded-xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-600/30 z-10 rounded-xl"></div>
          <div className="bg-white p-4 md:p-8 rounded-xl border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 md:gap-10">
              <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg">{language === 'en' ? 'Sales Assistant' : 'Asistente de Ventas'}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="py-2 px-3 bg-white rounded-md border border-slate-100">
                    {language === 'en' 
                      ? `"I need to send a quote for 3 shows in October"` 
                      : `"Necesito enviar un presupuesto para 3 shows en octubre"`}
                  </p>
                  <p className="py-2 px-3 bg-indigo-50 rounded-md border border-indigo-100">
                    {language === 'en'
                      ? `"Sure, I've generated a quote based on your previous rates. Should I include technical equipment or just fees?"`
                      : `"Claro, he generado un presupuesto según tus tarifas anteriores. ¿Incluyo los equipos técnicos o sólo honorarios?"`}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg">{language === 'en' ? 'Event Organizer' : 'Organizador de Eventos'}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="py-2 px-3 bg-white rounded-md border border-slate-100">
                    {language === 'en'
                      ? `"Prepare a message for the attendees of Saturday's event"`
                      : `"Prepara un mensaje para los asistentes al evento del sábado"`}
                  </p>
                  <p className="py-2 px-3 bg-indigo-50 rounded-md border border-indigo-100">
                    {language === 'en'
                      ? `"I've created a reminder with map, schedule and FAQs. Would you like me to schedule it to send tomorrow?"`
                      : `"He creado un recordatorio con mapa, horarios y preguntas frecuentes. ¿Quieres que lo programe para enviarlo mañana?"`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* What is Motion section */}
      <div className="mt-24 bg-indigo-950 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-pink-300">{t.whatIsMotion}</h2>
          
          <p className="text-xl mb-12 max-w-4xl">
            {t.motionDescription}
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Arrow connector for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-indigo-800 -z-1"></div>
            
            <div className="relative bg-indigo-900/50 p-6 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-indigo-800 flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-pink-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.creativePlatform}</h3>
              <p className="text-indigo-200">{t.creativePlatformDesc}</p>
            </div>
            
            <div className="relative bg-indigo-900/50 p-6 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-indigo-800 flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-pink-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.businessSuite}</h3>
              <p className="text-indigo-200">{t.businessSuiteDesc}</p>
            </div>
            
            <div className="relative bg-indigo-900/50 p-6 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-indigo-800 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-pink-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.timeProtector}</h3>
              <p className="text-indigo-200">{t.timeProtectorDesc}</p>
            </div>
            
            <div className="relative bg-indigo-900/50 p-6 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-indigo-800 flex items-center justify-center mb-4">
                <Rocket className="w-8 h-8 text-pink-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.growthPartner}</h3>
              <p className="text-indigo-200">{t.growthPartnerDesc}</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-2xl italic text-indigo-100">{t.motionPurpose}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
