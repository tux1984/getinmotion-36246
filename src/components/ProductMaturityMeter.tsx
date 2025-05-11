
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ChartBarIcon, Gauge } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MaturityCategory {
  name: { en: string; es: string };
  score: number;
  color: string;
}

export const ProductMaturityMeter = () => {
  const { language } = useLanguage();
  
  const categories: MaturityCategory[] = [
    {
      name: { en: 'Idea Validation', es: 'Validación de Idea' },
      score: 90,
      color: 'bg-emerald-500'
    },
    {
      name: { en: 'User Experience', es: 'Experiencia de Usuario' },
      score: 75,
      color: 'bg-violet-500'
    },
    {
      name: { en: 'Market Fit', es: 'Ajuste al Mercado' },
      score: 60,
      color: 'bg-blue-500'
    },
    {
      name: { en: 'Monetization', es: 'Monetización' },
      score: 30,
      color: 'bg-amber-500'
    }
  ];

  const overallScore = Math.round(
    categories.reduce((acc, category) => acc + category.score, 0) / categories.length
  );

  const maturityLevel = () => {
    if (overallScore >= 80) return language === 'en' ? 'Advanced' : 'Avanzado';
    if (overallScore >= 60) return language === 'en' ? 'Growing' : 'Creciendo';
    if (overallScore >= 40) return language === 'en' ? 'Developing' : 'Desarrollando';
    return language === 'en' ? 'Early Stage' : 'Etapa Inicial';
  };

  const translations = {
    en: {
      title: "Product Maturity",
      overallMaturity: "Overall Maturity",
      level: "Level",
      categories: "Categories"
    },
    es: {
      title: "Madurez del Producto",
      overallMaturity: "Madurez General",
      level: "Nivel",
      categories: "Categorías"
    }
  };

  const t = translations[language];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
          <Gauge className="w-5 h-5 text-violet-700" />
        </div>
        <h2 className="text-xl font-semibold">{t.title}</h2>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{t.overallMaturity}</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{maturityLevel()}</span>
            <span className="text-lg font-bold">{overallScore}%</span>
          </div>
        </div>
        <div className="relative">
          <Progress value={overallScore} className="h-3 bg-slate-100" />
          <div 
            className="absolute bottom-full mb-1 transform -translate-x-1/2 text-xs font-bold"
            style={{ left: `${overallScore}%` }}
          >
            <div className="w-2 h-2 bg-violet-500 rounded-full mx-auto mb-1"></div>
          </div>
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-500">{language === 'en' ? 'Early' : 'Inicial'}</span>
          <span className="text-xs text-violet-600 font-medium">{language === 'en' ? 'Advanced' : 'Avanzado'}</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">{t.categories}</h3>
          <span className="text-xs text-slate-500">{t.level}</span>
        </div>
        
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{category.name[language]}</span>
                <span className="text-xs font-medium">{category.score}%</span>
              </div>
              <Progress value={category.score} className={`h-2 ${category.color}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
