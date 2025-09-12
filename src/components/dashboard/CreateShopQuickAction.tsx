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
    <div className="p-3 bg-background border border-border rounded-md hover:border-primary/50 transition-colors cursor-pointer"
         onClick={() => navigate('/dashboard/create-shop')}>
      <div className="flex items-center gap-2 mb-2">
        <Store className="w-5 h-5 text-primary" />
        <h4 className="font-medium text-sm">{t.createShop}</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{t.shopDesc}</p>
      <Button size="sm" variant="default" className="w-full text-xs">
        {t.createMyShop}
      </Button>
    </div>
  );
};