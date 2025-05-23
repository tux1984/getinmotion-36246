
import React from 'react';
import { Music, Palette, Scissors, Theater, Calendar, User, Clock } from 'lucide-react';
import { QuestionConfig } from '../wizard-components/QuestionStep';
import { questionTranslations } from './translations';

export const getProfileQuestions = (language: 'en' | 'es'): Record<string, QuestionConfig> => {
  return {
    industry: {
      id: 'industry',
      type: 'icon-select',
      title: questionTranslations.industry[language].title,
      subtitle: questionTranslations.industry[language].subtitle,
      fieldName: 'industry',
      options: [
        { id: 'music', label: language === 'en' ? 'Music' : 'Música', icon: <Music className="w-8 h-8 text-purple-500" /> },
        { id: 'visual_arts', label: language === 'en' ? 'Visual Arts' : 'Artes Visuales', icon: <Palette className="w-8 h-8 text-indigo-500" /> },
        { id: 'crafts', label: language === 'en' ? 'Crafts' : 'Artesanía', icon: <Scissors className="w-8 h-8 text-blue-500" /> },
        { id: 'theater', label: language === 'en' ? 'Theater & Dance' : 'Teatro y Danza', icon: <Theater className="w-8 h-8 text-pink-500" /> },
        { id: 'events', label: language === 'en' ? 'Events & Festivals' : 'Eventos y Festivales', icon: <Calendar className="w-8 h-8 text-amber-500" /> },
        { id: 'other', label: language === 'en' ? 'Other Creative Field' : 'Otro Campo Creativo', icon: <User className="w-8 h-8 text-green-500" /> }
      ]
    },
    
    activities: {
      id: 'activities',
      type: 'checkbox',
      title: questionTranslations.activities[language].title,
      subtitle: questionTranslations.activities[language].subtitle,
      fieldName: 'activities',
      options: [
        { id: 'create', label: language === 'en' ? 'Creating art/products' : 'Crear arte/productos' },
        { id: 'selling-in-person', label: language === 'en' ? 'Selling in person (fairs, markets)' : 'Vender en persona (ferias, mercados)' },
        { id: 'selling-online', label: language === 'en' ? 'Selling online' : 'Vender online' },
        { id: 'classes', label: language === 'en' ? 'Teaching classes or workshops' : 'Dar clases o talleres' },
        { id: 'services', label: language === 'en' ? 'Offering creative services' : 'Ofrecer servicios creativos' },
        { id: 'export', label: language === 'en' ? 'Exporting or selling abroad' : 'Exportar o vender en el extranjero' }
      ]
    },
    
    experience: {
      id: 'experience',
      type: 'radio',
      title: questionTranslations.experience[language].title,
      subtitle: questionTranslations.experience[language].subtitle,
      fieldName: 'experience',
      options: [
        { id: 'less-than-6-months', label: language === 'en' ? 'Less than 6 months' : 'Menos de 6 meses', icon: <Clock className="w-6 h-6 text-red-500" /> },
        { id: '6-months-to-2-years', label: language === 'en' ? '6 months to 2 years' : 'De 6 meses a 2 años', icon: <Clock className="w-6 h-6 text-amber-500" /> },
        { id: 'more-than-2-years', label: language === 'en' ? 'More than 2 years' : 'Más de 2 años', icon: <Clock className="w-6 h-6 text-green-500" /> }
      ]
    }
  };
};
