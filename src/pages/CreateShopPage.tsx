import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ConversationalShopCreation } from '@/components/shop/ConversationalShopCreation';
import { IntelligentShopCreationWizard } from '@/components/shop/IntelligentShopCreationWizard';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';
import { useArtisanShop } from '@/hooks/useArtisanShop';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Loader2, ExternalLink, Package, Edit3 } from 'lucide-react';

export const CreateShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const compatibleLanguage = mapToLegacyLanguage(language);
  const { shop, loading, checkExistingShop } = useArtisanShop();
  const [existingShop, setExistingShop] = useState<any>(null);
  const [checkingShop, setCheckingShop] = useState(true);
  
  // Check for existing shop on mount
  useEffect(() => {
    const checkShop = async () => {
      try {
        const existing = await checkExistingShop();
        setExistingShop(existing);
      } catch (error) {
        console.error('Error checking existing shop:', error);
      } finally {
        setCheckingShop(false);
      }
    };
    
    checkShop();
  }, [checkExistingShop]);
  
  // Check if conversational mode is requested
  const isConversational = searchParams.get('mode') === 'conversational';

  // Show loading while checking for existing shop
  if (checkingShop) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Verificando tu tienda...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user already has a complete shop, show edit options
  if (existingShop && existingShop.creation_status === 'complete') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <Store className="w-16 h-16 mx-auto text-primary" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Editando tu tienda</h2>
              <p className="text-lg font-medium text-primary">{existingShop.shop_name}</p>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tu tienda digital está creada. Aquí puedes editarla o gestionar tus productos.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/mi-tienda')}
              className="flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Ir a Mi Tienda
            </Button>
            
            <Button 
              variant="outline"
              size="lg" 
              onClick={() => navigate('/productos/subir')}
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Subir Productos
            </Button>
            
            <Button 
              variant="outline"
              size="lg" 
              onClick={() => navigate(`/tienda/${existingShop.shop_slug}`)}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Tienda Pública
            </Button>
          </div>
          
          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              ¿Quieres modificar la información de tu tienda?
            </p>
            <Button 
              variant="secondary"
              onClick={() => setExistingShop({ ...existingShop, creation_status: 'incomplete' })}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Editar Información de la Tienda
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If user has incomplete shop, allow continuation
  if (existingShop && existingShop.creation_status === 'incomplete') {
    // Continue creation from where they left off
    if (isConversational || true) {
      return <ConversationalShopCreation existingShop={existingShop} />;
    }
    return <IntelligentShopCreationWizard language={compatibleLanguage} existingShop={existingShop} />;
  }

  // New shop creation
  if (isConversational || true) {
    return <ConversationalShopCreation />;
  }

  return <IntelligentShopCreationWizard language={compatibleLanguage} />;
};