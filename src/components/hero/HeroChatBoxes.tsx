
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
                <h3 className="font-medium text-xl text-pink-200">{language === 'en' ? 'Administrative Assistant' : 'Asistente Administrativo'}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="py-2 px-3 bg-indigo-800/50 rounded-md border border-indigo-700/30 text-indigo-100">
                  {language === 'en' 
                    ? `"I need to organize my files for the upcoming tax season"` 
                    : `"Necesito organizar mis archivos para la próxima temporada de impuestos"`}
                </p>
                <p className="py-2 px-3 bg-pink-900/30 rounded-md border border-pink-700/30 text-pink-100">
                  {language === 'en'
                    ? `"I've created a filing structure based on your previous tax returns. Would you like me to set up automatic reminders for quarterly tax dates?"`
                    : `"He creado una estructura de archivos basada en tus declaraciones de impuestos anteriores. ¿Te gustaría que configurara recordatorios automáticos para las fechas de impuestos trimestrales?"`}
                </p>
              </div>
            </div>
            
            <div className="flex-1 bg-indigo-900/50 rounded-lg p-5 border border-indigo-700/30 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-xl text-indigo-200">{language === 'en' ? 'Legal Advisor' : 'Asesor Legal'}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="py-2 px-3 bg-indigo-800/50 rounded-md border border-indigo-700/30 text-indigo-100">
                  {language === 'en'
                    ? `"Review this contract for any legal issues before I sign it"`
                    : `"Revisa este contrato por cualquier problema legal antes de que lo firme"`}
                </p>
                <p className="py-2 px-3 bg-purple-900/30 rounded-md border border-purple-700/30 text-purple-100">
                  {language === 'en'
                    ? `"I've reviewed the contract and found several clauses that need attention. The termination clause is too vague and the payment terms don't include late payment penalties."`
                    : `"He revisado el contrato y encontrado varias cláusulas que necesitan atención. La cláusula de terminación es demasiado vaga y los términos de pago no incluyen penalizaciones por pagos tardíos."`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
