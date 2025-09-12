import React from 'react';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CraftType } from '@/types/artisan';

interface CreateShopQuickActionProps {
  language: 'en' | 'es';
  craftType?: CraftType | null;
}

export const CreateShopQuickAction: React.FC<CreateShopQuickActionProps> = ({
  language,
  craftType
}) => {
  const navigate = useNavigate();

  const translations = {
    en: {
      createShop: 'Create Digital Shop',
      shopDesc: 'Build your online store with AI',
      createMyShop: 'Create My Shop',
      new: 'New!',
      aiAutomatic: 'AI Automatic',
      globalReach: 'Global Reach'
    },
    es: {
      createShop: 'Crear Tienda Digital',
      shopDesc: 'Construye tu tienda online con IA',
      createMyShop: 'Crear Mi Tienda',
      new: '¡Nuevo!',
      aiAutomatic: 'IA automática',
      globalReach: 'Alcance global'
    }
  };

  const t = translations[language];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500/10 via-teal-600/5 to-cyan-500/10 p-4 group cursor-pointer border border-emerald-200/50 dark:border-emerald-800/50"
      onClick={() => navigate('/dashboard/create-shop')}
    >
      {/* Simple hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{t.createShop}</h3>
              <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded">
                {t.new}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{t.shopDesc}</p>
            {craftType && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                🎨 {craftType}
              </p>
            )}
          </div>
        </div>
        
        {/* Simplified features */}
        <div className="flex items-center gap-4 text-xs text-emerald-600 dark:text-emerald-400 mb-3">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
            {t.aiAutomatic}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
            {t.globalReach}
          </div>
        </div>
        
        <Button 
          size="sm"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/dashboard/create-shop');
          }}
        >
          <Store className="w-3 h-3 mr-1" />
          {t.createMyShop}
        </Button>
      </div>
    </motion.div>
  );
};