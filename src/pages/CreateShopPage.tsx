import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ConversationalShopCreation } from '@/components/shop/ConversationalShopCreation';
import { IntelligentShopCreationWizard } from '@/components/shop/IntelligentShopCreationWizard';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';
import { useArtisanShop } from '@/hooks/useArtisanShop';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Loader2, ExternalLink } from 'lucide-react';

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

  // If user already has a complete shop, show shop management
  if (existingShop && existingShop.creation_status === 'complete') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <Store className="w-16 h-16 mx-auto text-primary" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">¡Ya tienes tu tienda creada!</h2>
              <p className="text-lg font-medium text-primary">{existingShop.shop_name}</p>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tu tienda digital está lista. Puedes gestionarla desde tu dashboard o continuar agregando productos.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
            >
              <Store className="w-4 h-4 mr-2" />
              Ver Dashboard
            </Button>
            
            <Button 
              variant="outline"
              size="lg" 
              onClick={() => navigate('/productos/subir')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Subir Productos
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