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

  // Comprehensive validation before publishing
  const validateForPublishing = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    console.log('🔍 VALIDACIÓN PRE-PUBLICACIÓN...');
    console.log('📋 Estado del wizard:', {
      imagesCount: wizardState.images.length,
      name: wizardState.name,
      description: wizardState.description?.length,
      price: wizardState.price,
      category: wizardState.category
    });

    if (!wizardState.images || wizardState.images.length === 0) {
      errors.push('Debes subir al menos una imagen');
    }
    
    if (!wizardState.name?.trim()) {
      errors.push('El nombre del producto es obligatorio');
    }
    
    if (!wizardState.description?.trim()) {
      errors.push('La descripción del producto es obligatoria');
    }
    
    if (!wizardState.price || wizardState.price <= 0) {
      errors.push('Debes establecer un precio válido');
    }
    
    if (!wizardState.category?.trim()) {
      errors.push('Debes seleccionar una categoría');
    }

    console.log('✅ Validación completada:', { isValid: errors.length === 0, errors });
    return { isValid: errors.length === 0, errors };
  };

  // Retry function with exponential backoff
  const retryOperation = async <T,>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt}/${maxRetries}`);
        const result = await operation();
        console.log(`✅ Operación exitosa en intento ${attempt}`);
        return result;
      } catch (error) {
        console.log(`❌ Intento ${attempt} falló:`, error);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        const delay = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏰ Esperando ${delay}ms antes del próximo intento...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Máximo número de intentos alcanzado');
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    let uploadedImageUrls: string[] = [];
    
    try {
      console.log('🚀 INICIANDO PUBLICACIÓN COMPLETA DEL PRODUCTO...');
      
      // PASO 1: Validación exhaustiva pre-publicación
      const validation = validateForPublishing();
      if (!validation.isValid) {
        console.error('❌ VALIDACIÓN FALLIDA:', validation.errors);
        toast.error('Faltan datos obligatorios', {
          description: validation.errors.join(', ')
        });
        return;
      }
      
      // PASO 2: Verificación de autenticación robusta
      console.log('🔐 VERIFICANDO AUTENTICACIÓN...');
      const authResult = await retryOperation(
        () => supabase.auth.getUser()
      );
      
      const { data: { user }, error: authError } = authResult;
      
      if (authError || !user) {
        console.error('❌ ERROR DE AUTENTICACIÓN:', authError);
        toast.error('Error de autenticación', {
          description: 'Por favor, inicia sesión nuevamente',
          action: {
            label: 'Iniciar sesión',
            onClick: () => window.location.href = '/auth'
          }
        });
        throw new Error(`Error de autenticación: ${authError?.message || 'Usuario no encontrado'}`);
      }

      console.log('✅ USUARIO AUTENTICADO:', {
        id: user.id,
        email: user.email,
        isAnonymous: user.is_anonymous
      });

      // PASO 3: Verificación de tienda con reintentos
      console.log('🏪 VERIFICANDO TIENDA...');
      const shopResult = await retryOperation(
        async () => {
          const result = await supabase
            .from('artisan_shops')
            .select('id, shop_name, active, user_id')
            .eq('user_id', user.id)
            .eq('active', true)
            .maybeSingle();
          return result;
        }
      );

      const { data: shop, error: shopError } = shopResult;
      console.log('🏪 RESULTADO VERIFICACIÓN TIENDA:', { shop, shopError });

      if (shopError || !shop) {
        console.error('❌ TIENDA NO ENCONTRADA O INACTIVA:', shopError);
        toast.error('Problema con tu tienda', {
          description: 'No se encontró una tienda activa para tu usuario',
          action: {
            label: 'Ver tiendas',
            onClick: () => window.location.href = '/mi-tienda'
          }
        });
        throw new Error(`Error de tienda: ${shopError?.message || 'Tienda no encontrada'}`);
      }

      console.log('✅ TIENDA VERIFICADA:', {
        id: shop.id,
        name: shop.shop_name,
        active: shop.active,
        userId: shop.user_id
      });

      // PASO 4: Subida de imágenes con validación exhaustiva
      console.log('📸 INICIANDO SUBIDA DE IMÁGENES...');
      toast.info('Subiendo imágenes...', { description: `${wizardState.images.length} imagen(es) por subir` });
      
      uploadedImageUrls = await retryOperation(
        async () => {
          console.log('📤 Subiendo imágenes:', wizardState.images.map(img => ({
            name: img.name,
            size: img.size,
            type: img.type
          })));
          
          const urls = await uploadImages(wizardState.images);
          
          if (!urls || urls.length === 0) {
            throw new Error('No se pudieron subir las imágenes');
          }
          
          console.log('✅ IMÁGENES SUBIDAS EXITOSAMENTE:', urls);
          return urls;
        }
      );

      // PASO 5: Creación del producto con datos validados
      console.log('📦 CREANDO PRODUCTO EN BASE DE DATOS...');
      toast.info('Creando producto...', { description: 'Guardando en la base de datos' });
      
      const productData = {
        shop_id: shop.id,
        name: wizardState.name.trim(),
        description: wizardState.description.trim(),
        short_description: wizardState.shortDescription?.trim() || wizardState.description.trim().substring(0, 150),
        price: Number(wizardState.price),
        category: wizardState.category.trim(),
        images: uploadedImageUrls,
        tags: wizardState.tags || [],
        inventory: wizardState.inventory || 1,
        weight: wizardState.weight || null,
        dimensions: wizardState.dimensions || null,
        materials: wizardState.materials || [],
        production_time: wizardState.productionTime || null,
        active: true,
      };

      console.log('📦 DATOS FINALES DEL PRODUCTO:', productData);

      const productResult = await retryOperation(
        async () => {
          const result = await supabase
            .from('products')
            .insert([productData])
            .select('*')
            .single();
          return result;
        }
      );

      const { error: productError, data: createdProduct } = productResult;
      console.log('📦 RESULTADO CREACIÓN PRODUCTO:', { createdProduct, productError });

      if (productError) {
        console.error('❌ ERROR CREANDO PRODUCTO:', productError);
        throw new Error(`Error creando producto: ${productError.message}`);
      }

      if (!createdProduct) {
        throw new Error('No se pudo crear el producto - respuesta vacía');
      }

      // Verificar que el producto se insertó correctamente
      console.log('🔍 VERIFICANDO INSERCIÓN DEL PRODUCTO...');
      const { data: verifyProduct, error: verifyError } = await supabase
        .from('products')
        .select('id, name, shop_id')
        .eq('id', createdProduct.id)
        .single();
      
      if (verifyError || !verifyProduct) {
        throw new Error('Error verificando la inserción del producto');
      }

      console.log('🎉 PRODUCTO CREADO Y VERIFICADO EXITOSAMENTE:', {
        id: createdProduct.id,
        name: createdProduct.name,
        shop_id: createdProduct.shop_id
      });
      
      // PASO 6: Confirmación final y notificación
      toast.success('¡Producto publicado exitosamente!', {
        description: `"${productData.name}" ya está disponible en tu tienda`,
        duration: 5000,
        action: {
          label: 'Ver producto',
          onClick: () => {
            onPublish(); // Reset wizard state
            window.location.href = '/mi-tienda';
          }
        }
      });
      
      // PASO 7: Solo después de éxito completo - resetear wizard
      console.log('🏁 FINALIZANDO PUBLICACIÓN...');
      console.log('✅ PRODUCTO PUBLICADO CORRECTAMENTE - ID:', createdProduct.id);
      
      // Reset wizard state inmediatamente después del éxito
      onPublish();
      
    } catch (error) {
      console.error('❌ ERROR CRÍTICO EN PUBLICACIÓN:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        uploadedImages: uploadedImageUrls.length,
        wizardState: {
          name: wizardState.name,
          price: wizardState.price,
          imagesCount: wizardState.images?.length
        }
      });

      // Rollback: Si subimos imágenes pero falló la creación del producto, informar
      if (uploadedImageUrls.length > 0) {
        console.log('⚠️ ROLLBACK: Imágenes subidas pero producto no creado');
        toast.error('Error al crear el producto', {
          description: 'Las imágenes se subieron correctamente, pero falló la creación del producto. Intenta nuevamente.',
          duration: 8000
        });
      } else {
        toast.error('Error en la publicación', {
          description: error instanceof Error ? error.message : 'Error desconocido al publicar el producto',
          duration: 8000
        });
      }
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