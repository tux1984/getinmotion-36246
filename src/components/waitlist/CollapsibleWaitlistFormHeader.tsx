
import React from 'react';
import { ChevronDown, Users, Sparkles, Clock } from 'lucide-react';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface CollapsibleWaitlistFormHeaderProps {
  language: 'en' | 'es';
  isOpen: boolean;
}

export const CollapsibleWaitlistFormHeader: React.FC<CollapsibleWaitlistFormHeaderProps> = ({
  language,
  isOpen
}) => {
  const headerTranslations = {
    en: {
      title: "Join the Motion Waitlist",
      subtitle: "Be among the first to experience the future of cultural creation",
      stats: "Join 500+ creators already waiting",
      expandText: "Join Waitlist",
      collapseText: "Close Form"
    },
    es: {
      title: "Únete a la Lista de Motion",
      subtitle: "Sé parte de los primeros en experimentar el futuro de la creación cultural",
      stats: "Únete a más de 500 creadores esperando",
      expandText: "Unirse a Lista",
      collapseText: "Cerrar Formulario"
    }
  };

  const ht = headerTranslations[language];

  return (
    <div className="relative group mb-6">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
      <div className="bg-gradient-to-br from-indigo-950/95 to-purple-950/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative border border-indigo-700/30">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-300/20">
                  <Sparkles className="h-6 w-6 text-pink-300" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                    {ht.title}
                  </h2>
                  <p className="text-indigo-200/80 text-sm md:text-base mt-1">
                    {ht.subtitle}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-indigo-300/70">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{ht.stats}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{language === 'en' ? 'Early access' : 'Acceso anticipado'}</span>
                </div>
              </div>
            </div>
            
            <CollapsibleTrigger asChild>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isOpen ? ht.collapseText : ht.expandText}
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
      </div>
    </div>
  );
};
