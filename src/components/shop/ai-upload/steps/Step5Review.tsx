import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, Upload, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useImageUpload } from '../hooks/useImageUpload';
import { WizardState } from '../hooks/useWizardState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Step5ReviewProps {
  wizardState: WizardState;
  onEdit: (step: number) => void;
  onPublish: () => void;
  onPrevious: () => void;
}

export const Step5Review: React.FC<Step5ReviewProps> = ({
  wizardState,
  onEdit,
  onPublish,
  onPrevious,
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const { uploadImages, uploadProgress, isUploading } = useImageUpload();

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Upload images first
      toast.info('Subiendo imágenes...');
      const imageUrls = await uploadImages(wizardState.images);
      
      // Get user's shop
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data: shop } = await supabase
        .from('artisan_shops')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!shop) {
        console.error('No shop found for user:', user.id);
        toast.error('No tienes una tienda creada', {
          description: 'Necesitas crear tu tienda antes de poder publicar productos',
          action: {
            label: 'Crear tienda',
            onClick: () => window.location.href = '/dashboard/create-shop'
          }
        });
        throw new Error('No se encontró la tienda del usuario');
      }

      // Create product
      toast.info('Creando producto...');
      const { error: productError } = await supabase
        .from('products')
        .insert([
          {
            shop_id: shop.id,
            name: wizardState.name,
            description: wizardState.description,
            short_description: wizardState.shortDescription || wizardState.description.substring(0, 150),
            price: wizardState.price!,
            category: wizardState.category,
            images: imageUrls,
            tags: wizardState.tags,
            inventory: wizardState.inventory || 1,
            weight: wizardState.weight,
            dimensions: wizardState.dimensions,
            materials: wizardState.materials || [],
            production_time: wizardState.productionTime,
            active: true,
          },
        ]);

      if (productError) {
        throw new Error(`Error creando producto: ${productError.message}`);
      }

      toast.success('¡Producto publicado exitosamente!', {
        description: 'Tu producto ya está disponible en tu tienda',
        action: {
          label: 'Ver mi tienda',
          onClick: () => window.location.href = '/mi-tienda'
        }
      });
      
      // Redirect to shop dashboard after successful publish
      setTimeout(() => {
        window.location.href = '/mi-tienda';
      }, 2000);
      
      onPublish();
      
    } catch (error) {
      console.error('Error publishing product:', error);
      toast.error(error instanceof Error ? error.message : 'Error publicando producto');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Revisión final</h2>
        <p className="text-muted-foreground">
          Revisa todos los detalles antes de publicar tu producto
        </p>
      </div>

      {/* Product Preview */}
      <Card className="overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Images */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Imágenes ({wizardState.images.length})</h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(0)}>
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {wizardState.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Producto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Product Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Nombre del producto</h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-lg font-medium">{wizardState.name}</p>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Descripción</h3>
              <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {wizardState.description}
            </p>
          </div>

          <Separator />

          {/* Price and Category */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Precio</h3>
                <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xl font-bold text-primary">
                ${wizardState.price?.toLocaleString()} COP
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Categoría</h3>
              <Badge variant="secondary">{wizardState.category}</Badge>
            </div>
          </div>

          {/* Tags */}
          {wizardState.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {wizardState.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Upload Progress */}
      {isUploading && uploadProgress.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Subiendo imágenes...</h3>
          <div className="space-y-2">
            {uploadProgress.map((progress, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium">{progress.fileName}</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        progress.status === 'error' ? 'bg-destructive' :
                        progress.status === 'completed' ? 'bg-green-500' :
                        'bg-primary'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                
                {progress.status === 'completed' && <Check className="w-4 h-4 text-green-500" />}
                {progress.status === 'error' && <span className="text-xs text-destructive">{progress.error}</span>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Publish Checklist */}
      <Card className="p-4 bg-muted/30">
        <h3 className="font-semibold mb-3">Lista de verificación</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">Imágenes subidas ({wizardState.images.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">Nombre definido</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">Descripción completa</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">Precio establecido</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm">Categoría seleccionada</span>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </Button>

        <Button
          onClick={handlePublish}
          disabled={isPublishing || isUploading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          {isPublishing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isPublishing ? 'Publicando...' : 'Publicar producto'}
        </Button>
      </div>
    </div>
  );
};