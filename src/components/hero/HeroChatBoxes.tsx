
import React from 'react';

interface HeroChatBoxesProps {
  language: 'en' | 'es';
}

export const HeroChatBoxes: React.FC<HeroChatBoxesProps> = ({ language }) => {
  return (
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
  );
};
