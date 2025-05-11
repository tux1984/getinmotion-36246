
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
      title: "What is Motion?",
      subtitle: "Motion is a platform that helps artists, musicians, and artisans build and manage their creative business — from contracts and payments to publishing and outreach — with tailored AI tools that grow with them.",
      waitlist: "Join the waitlist",
      learnMore: "Learn more",
      whatIsMotion: "What is Motion?",
      motionDescription: "Motion also assesses the creator's digital and operational maturity to recommend only the copilots they actually need, when they need them. As the creator grows, Motion adapts—activating new agents, unlocking features and guiding the journey step by step.",
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
      title: "¿Qué es Motion?",
      subtitle: "Motion es una plataforma que ayuda a artistas, músicos y artesanos a construir y gestionar su negocio creativo — desde contratos y pagos hasta publicación y difusión — con herramientas de IA personalizadas que crecen con ellos.",
      waitlist: "Unirse a la lista de espera",
      learnMore: "Conocer más",
      whatIsMotion: "¿Qué es Motion?",
      motionDescription: "Motion también evalúa la madurez digital y operativa del creador para recomendar solo los copilotos que realmente necesitan, cuando los necesitan. A medida que el creador crece, Motion se adapta: activando nuevos agentes, desbloqueando funciones y guiando el viaje paso a paso.",
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
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 py-24 md:py-32 relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-pink-500 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-purple-500 blur-3xl"></div>
      </div>
      
      {/* Sound wave animation effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="flex items-end space-x-2 h-32">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div 
              key={i} 
              className="w-4 bg-white rounded-full animate-pulse" 
              style={{ 
                height: `${Math.sin(i / 2) * 50 + 50}%`,
                animationDuration: `${1 + (i / 5)}s`,
                animationDelay: `${i * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 font-serif tracking-tight">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-10 leading-relaxed">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none text-lg"
                onClick={onJoinWaitlist}
              >
                {t.waitlist}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-pink-300 text-pink-300 hover:bg-pink-900/20 text-lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t.learnMore}
              </Button>
            </div>
          </div>
          
          <div className="relative w-full md:w-1/2 mt-8 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-indigo-600/40 rounded-xl blur-sm -m-1 z-10"></div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur-sm opacity-70 z-0"></div>
            <div className="relative overflow-hidden rounded-xl shadow-2xl z-20">
              <img 
                src="/lovable-uploads/e2faf820-4987-4cf2-a69b-0b534fbbecbd.png" 
                alt="Motion for artists, musicians and artisans" 
                className="w-full h-auto object-cover bg-indigo-900/80"
              />
            </div>
            
            {/* Musical notes decoration */}
            <div className="absolute -top-6 -right-6 text-pink-300 text-5xl opacity-30 rotate-12">♪</div>
            <div className="absolute top-1/4 -left-8 text-indigo-300 text-4xl opacity-20 -rotate-6">♫</div>
            <div className="absolute bottom-10 right-5 text-purple-300 text-6xl opacity-25 rotate-3">♬</div>
          </div>
        </div>
      </div>
      
      <div className="mt-24 max-w-5xl mx-auto px-4 relative z-10">
        <div className="relative rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/50 to-purple-900/50 z-10 rounded-xl"></div>
          <div className="bg-black/30 p-6 md:p-8 rounded-xl border border-indigo-500/20 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex-1 bg-indigo-900/50 rounded-lg p-5 border border-indigo-700/30 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium text-xl text-pink-200">{language === 'en' ? 'Sales Assistant' : 'Asistente de Ventas'}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="py-2 px-3 bg-indigo-800/50 rounded-md border border-indigo-700/30 text-indigo-100">
                    {language === 'en' 
                      ? `"I need to send a quote for 3 shows in October"` 
                      : `"Necesito enviar un presupuesto para 3 shows en octubre"`}
                  </p>
                  <p className="py-2 px-3 bg-pink-900/30 rounded-md border border-pink-700/30 text-pink-100">
                    {language === 'en'
                      ? `"Sure, I've generated a quote based on your previous rates. Should I include technical equipment or just fees?"`
                      : `"Claro, he generado un presupuesto según tus tarifas anteriores. ¿Incluyo los equipos técnicos o sólo honorarios?"`}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 bg-indigo-900/50 rounded-lg p-5 border border-indigo-700/30 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="font-medium text-xl text-indigo-200">{language === 'en' ? 'Event Organizer' : 'Organizador de Eventos'}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="py-2 px-3 bg-indigo-800/50 rounded-md border border-indigo-700/30 text-indigo-100">
                    {language === 'en'
                      ? `"Prepare a message for the attendees of Saturday's event"`
                      : `"Prepara un mensaje para los asistentes al evento del sábado"`}
                  </p>
                  <p className="py-2 px-3 bg-purple-900/30 rounded-md border border-purple-700/30 text-purple-100">
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
      <div className="mt-24 bg-gradient-to-br from-indigo-950 to-purple-950 py-16 text-white relative">
        {/* Abstract art elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-indigo-500 mix-blend-soft-light blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-pink-500 mix-blend-soft-light blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 font-serif">{t.whatIsMotion}</h2>
          
          <p className="text-xl mb-16 max-w-4xl leading-relaxed text-indigo-100">
            {t.motionDescription}
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Arrow connector for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-indigo-500/50 -z-1"></div>
            
            <div className="relative group transition-all duration-300 hover:-translate-y-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-indigo-900/50 p-6 rounded-lg backdrop-blur-sm border border-indigo-800/30">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-pink-200">{t.creativePlatform}</h3>
                <p className="text-indigo-200">{t.creativePlatformDesc}</p>
              </div>
            </div>
            
            <div className="relative group transition-all duration-300 hover:-translate-y-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-indigo-900/50 p-6 rounded-lg backdrop-blur-sm border border-indigo-800/30">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-200">{t.businessSuite}</h3>
                <p className="text-indigo-200">{t.businessSuiteDesc}</p>
              </div>
            </div>
            
            <div className="relative group transition-all duration-300 hover:-translate-y-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-indigo-900/50 p-6 rounded-lg backdrop-blur-sm border border-indigo-800/30">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-indigo-200">{t.timeProtector}</h3>
                <p className="text-indigo-200">{t.timeProtectorDesc}</p>
              </div>
            </div>
            
            <div className="relative group transition-all duration-300 hover:-translate-y-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-indigo-900/50 p-6 rounded-lg backdrop-blur-sm border border-indigo-800/30">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-200">{t.growthPartner}</h3>
                <p className="text-indigo-200">{t.growthPartnerDesc}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <p className="text-2xl italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">{t.motionPurpose}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
