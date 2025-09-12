import React from 'react';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';
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
      new: 'New!'
    },
    es: {
      createShop: 'Crear Tienda Digital',
      shopDesc: 'Construye tu tienda online con IA',
      createMyShop: 'Crear Mi Tienda',
      new: '¡Nuevo!'
    }
  };

  const t = translations[language];

  return (
    <div
      className="p-4 bg-card border border-border rounded-lg cursor-pointer hover:border-emerald-300 transition-colors"
      onClick={() => navigate('/dashboard/create-shop')}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
          <Store className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{t.createShop}</h3>
            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded">
              {t.new}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{t.shopDesc}</p>
          {craftType && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              🎨 {craftType}
            </p>
          )}
        </div>
      </div>
      
      <Button 
        size="sm"
        className="w-full"
        onClick={(e) => {
          e.stopPropagation();
          navigate('/dashboard/create-shop');
        }}
      >
        <Store className="w-4 h-4 mr-2" />
        {t.createMyShop}
      </Button>
    </div>
  );
};