
import React from 'react';
import { ProfileType } from '@/types/dashboard';
import { CategoryScore } from '@/components/maturity/types';
import { Check, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

interface RecommendedAgentsStepProps {
  profileType: ProfileType;
  maturityScores: CategoryScore | null;
}

export const RecommendedAgentsStep: React.FC<RecommendedAgentsStepProps> = ({ 
  profileType, 
  maturityScores 
}) => {
  const { language } = useLanguage();
  
  return (
    <div className="py-8">
      <h3 className="text-xl font-bold mb-4">
        {language === 'en' ? "Recommended Agents for Your Project" : "Agentes Recomendados para Tu Proyecto"}
      </h3>
      
      <div className="space-y-4">
        <div className="p-4 border border-green-200 bg-green-50 rounded-lg flex items-start">
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-4">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium">
              {language === 'en' ? "Administrative Assistant" : "Asistente Administrativo"}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? "Helps organize your files, manage appointments, and handle correspondence."
                : "Ayuda a organizar tus archivos, gestionar citas y manejar correspondencia."}
            </p>
          </div>
        </div>
        
        {(profileType === 'solo' || profileType === 'team' || 
          (maturityScores && maturityScores.monetization > 20)) && (
          <div className="p-4 border border-indigo-200 bg-indigo-50 rounded-lg flex items-start">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-4">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium">
                {language === 'en' ? "Accounting Agent" : "Agente Contable"}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? "Helps track expenses, prepare for tax filings, and manage financial records."
                  : "Ayuda a seguir gastos, preparar declaraciones de impuestos y gestionar registros financieros."}
              </p>
            </div>
          </div>
        )}
        
        {(profileType !== 'solo' || 
          (maturityScores && maturityScores.marketFit > 30)) && (
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg flex items-start">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-4">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium">
                {language === 'en' ? "Legal Advisor" : "Asesor Legal"}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? "Helps understand legal requirements, review contracts, and manage compliance issues."
                  : "Ayuda a entender requisitos legales, revisar contratos y gestionar temas de cumplimiento."}
              </p>
            </div>
          </div>
        )}
        
        {profileType === 'team' && maturityScores && maturityScores.marketFit > 50 && (
          <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg flex items-start opacity-50">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center mr-4">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium flex items-center">
                {language === 'en' ? "Operations Manager" : "Gerente de Operaciones"}
                <Badge className="ml-2" variant="outline">
                  {language === 'en' ? "Coming Soon" : "Próximamente"}
                </Badge>
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? "Will help manage team workflows, track project progress, and optimize processes."
                  : "Ayudará a gestionar flujos de trabajo del equipo, seguir el progreso del proyecto y optimizar procesos."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
