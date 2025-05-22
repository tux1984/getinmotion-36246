
import React from 'react';
import { Music, PaintBucket, Palette, Projector, Package, Wrench } from 'lucide-react';

interface WizardHeaderProps {
  step: number;
  totalSteps: number;
  language: 'en' | 'es';
  industry?: string;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({ 
  step, 
  totalSteps, 
  language,
  industry = '' 
}) => {
  const t = {
    en: {
      title: "Cultural Maturity Assessment",
      subtitle: "Let's understand your creative business better",
      welcome: "Welcome to your personalized assessment",
      music: "Music Creator",
      visual_arts: "Visual Artist",
      crafts: "Craftsperson",
      theater: "Performing Artist",
      personal_care: "Personal Care Products",
      events: "Cultural Events Producer",
      other: "Creative Professional"
    },
    es: {
      title: "Evaluación de Madurez Cultural",
      subtitle: "Comprendamos mejor tu negocio creativo",
      welcome: "Bienvenido/a a tu evaluación personalizada",
      music: "Creador/a Musical",
      visual_arts: "Artista Visual",
      crafts: "Artesano/a",
      theater: "Artista Escénico/a",
      personal_care: "Productos de Cuidado Personal",
      events: "Productor/a de Eventos Culturales",
      other: "Profesional Creativo"
    }
  };
  
  const getIndustryTitle = () => {
    if (!industry) return t[language].welcome;
    
    switch(industry) {
      case 'music': return t[language].music;
      case 'visual_arts': return t[language].visual_arts;
      case 'crafts': return t[language].crafts;
      case 'theater': return t[language].theater;
      case 'personal_care': return t[language].personal_care;
      case 'events': return t[language].events;
      default: return t[language].other;
    }
  };
  
  const getIndustryIcon = () => {
    switch(industry) {
      case 'music': return <Music className="w-8 h-8 text-indigo-500" />;
      case 'visual_arts': return <PaintBucket className="w-8 h-8 text-purple-500" />;
      case 'crafts': return <Wrench className="w-8 h-8 text-amber-500" />;
      case 'theater': return <Projector className="w-8 h-8 text-green-500" />;
      case 'personal_care': return <Package className="w-8 h-8 text-pink-500" />;
      case 'events': return <Palette className="w-8 h-8 text-blue-500" />;
      default: return <Palette className="w-8 h-8 text-indigo-500" />;
    }
  };
  
  return (
    <div className="p-6 md:p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-1">{t[language].title}</h2>
          <p className="text-purple-100">{t[language].subtitle}</p>
        </div>
        
        {industry && (
          <div className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
            {getIndustryIcon()}
            <span className="ml-2 font-medium">{getIndustryTitle()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
