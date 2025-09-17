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
    console.log('🚀 INICIANDO PROCESO DE PUBLICACIÓN ROBUSTO...');
    
    // Validación inicial
    const validation = validateForPublishing();
    if (!validation.isValid) {
      console.error('❌ VALIDACIÓN FALLIDA:', validation.errors);
      toast.error('Faltan datos obligatorios', {
        description: validation.errors.join(', ')
      });
      return;
    }
    
    setIsPublishing(true);
    let uploadedImageUrls: string[] = [];

    try {
      // PASO 1: Verificar autenticación con detalles completos
      console.log('🔐 VERIFICANDO AUTENTICACIÓN...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('❌ ERROR DE AUTENTICACIÓN:', authError);
        throw new Error(`Error de autenticación: ${authError.message}`);
      }
      
      if (!user) {
        console.error('❌ USUARIO NO AUTENTICADO');
        throw new Error('Usuario no autenticado. Por favor, inicia sesión.');
      }
      
      console.log('✅ USUARIO AUTENTICADO:', {
        id: user.id,
        email: user.email,
        role: user.role || 'authenticated'
      });

      // PASO 2: Verificar tienda del usuario con logging detallado
      console.log('🏪 VERIFICANDO TIENDA DEL USUARIO...');
      const { data: shopData, error: shopError } = await supabase
        .from('artisan_shops')
        .select('id, shop_name, active, user_id')
        .eq('user_id', user.id)
        .eq('active', true)
        .maybeSingle();

      console.log('🏪 RESULTADO CONSULTA TIENDA:', { 
        shopData, 
        shopError,
        userId: user.id 
      });

      if (shopError) {
        console.error('❌ ERROR CONSULTANDO TIENDA:', shopError);
        throw new Error(`Error verificando tienda: ${shopError.message}`);
      }

      if (!shopData) {
        console.error('❌ TIENDA NO ENCONTRADA PARA USUARIO:', user.id);
        toast.error('No tienes una tienda activa', {
          description: 'Crea tu tienda antes de publicar productos',
          action: {
            label: 'Crear tienda',
            onClick: () => window.location.href = '/crear-tienda'
          }
        });
        throw new Error('No tienes una tienda activa. Crea tu tienda primero.');
      }

      console.log('✅ TIENDA VERIFICADA:', {
        id: shopData.id,
        name: shopData.shop_name,
        user_id: shopData.user_id
      });

      // PASO 3: Validar y subir imágenes
      console.log('📸 PROCESANDO IMÁGENES...');
      
      if (wizardState.images && wizardState.images.length > 0) {
        console.log(`📤 SUBIENDO ${wizardState.images.length} IMÁGENES...`);
        toast.info('Subiendo imágenes...', { 
          description: `Procesando ${wizardState.images.length} imagen(es)` 
        });
        
        try {
          uploadedImageUrls = await uploadImages(wizardState.images);
          console.log('✅ IMÁGENES SUBIDAS EXITOSAMENTE:', uploadedImageUrls);
          
          if (uploadedImageUrls.length === 0) {
            throw new Error('No se pudieron generar URLs válidas para las imágenes');
          }
        } catch (uploadError) {
          console.error('❌ ERROR SUBIENDO IMÁGENES:', uploadError);
          throw new Error(`Error subiendo imágenes: ${uploadError instanceof Error ? uploadError.message : 'Error desconocido'}`);
        }
      }

      // PASO 4: Preparar datos del producto con validación
      console.log('📦 PREPARANDO DATOS DEL PRODUCTO...');
      const productData = {
        shop_id: shopData.id,
        name: wizardState.name.trim(),
        description: wizardState.description?.trim() || '',
        short_description: wizardState.shortDescription?.trim() || wizardState.description?.trim().substring(0, 150) || '',
        price: Number(wizardState.price) || 0,
        category: wizardState.category?.trim() || '',
        tags: wizardState.tags || [],
        images: uploadedImageUrls,
        inventory: wizardState.inventory || 1,
        weight: wizardState.weight || null,
        dimensions: wizardState.dimensions || null,
        materials: wizardState.materials || [],
        production_time: wizardState.productionTime || null,
        active: true,
        featured: false
      };

      console.log('📝 DATOS FINALES DEL PRODUCTO:', {
        shop_id: productData.shop_id,
        name: productData.name,
        price: productData.price,
        category: productData.category,
        images_count: productData.images.length,
        user_id: user.id
      });

      // PASO 5: Insertar producto con manejo de errores RLS específico
      console.log('💾 INSERTANDO PRODUCTO EN BASE DE DATOS...');
      toast.info('Creando producto...', { 
        description: 'Guardando en la base de datos' 
      });

      const { data: createdProduct, error: productError } = await supabase
        .from('products')
        .insert([productData])
        .select('*')
        .single();

      console.log('📦 RESULTADO INSERCIÓN:', { 
        createdProduct, 
        productError,
        insertData: productData 
      });

      if (productError) {
        console.error('❌ ERROR INSERTANDO PRODUCTO:', {
          message: productError.message,
          details: productError.details,
          hint: productError.hint,
          code: productError.code
        });
        
        // Manejo específico de errores RLS
        if (productError.message?.includes('row-level security') || 
            productError.code === '42501' || 
            productError.message?.includes('policy')) {
          throw new Error('Error de permisos: No tienes autorización para crear productos en esta tienda');
        }
        
        // Otros errores específicos
        if (productError.code === '23503') {
          throw new Error('Error de referencia: La tienda especificada no existe');
        }
        
        if (productError.code === '23505') {
          throw new Error('Error de duplicado: Ya existe un producto con esos datos');
        }
        
        throw new Error(`Error creando producto: ${productError.message}`);
      }

      if (!createdProduct) {
        throw new Error('No se pudo crear el producto - respuesta vacía del servidor');
      }

      // PASO 6: Verificar inserción con reintentos y timeout
      console.log('🔍 VERIFICANDO INSERCIÓN DEL PRODUCTO...');
      
      let verifyAttempts = 0;
      const maxVerifyAttempts = 5;
      let verificationSuccessful = false;
      
      while (verifyAttempts < maxVerifyAttempts && !verificationSuccessful) {
        try {
          const { data: verifyProduct, error: verifyError } = await supabase
            .from('products')
            .select('id, name, shop_id, active, created_at')
            .eq('id', createdProduct.id)
            .single();
          
          if (!verifyError && verifyProduct) {
            console.log('✅ PRODUCTO VERIFICADO EXITOSAMENTE:', {
              id: verifyProduct.id,
              name: verifyProduct.name,
              shop_id: verifyProduct.shop_id,
              created_at: verifyProduct.created_at
            });
            verificationSuccessful = true;
            break;
          }
          
          verifyAttempts++;
          console.log(`⏳ Intento de verificación ${verifyAttempts}/${maxVerifyAttempts}...`);
          
          if (verifyAttempts < maxVerifyAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        } catch (verifyError) {
          console.error(`❌ Error en verificación ${verifyAttempts + 1}:`, verifyError);
          verifyAttempts++;
        }
      }
      
      if (!verificationSuccessful) {
        console.error('❌ NO SE PUDO VERIFICAR LA INSERCIÓN DEL PRODUCTO');
        throw new Error('El producto se creó pero no se puede verificar en la base de datos. Revisa tu tienda manualmente.');
      }

      // PASO 7: Éxito confirmado - mostrar notificación y limpiar estado
      console.log('🎉 PRODUCTO PUBLICADO EXITOSAMENTE:', {
        id: createdProduct.id,
        name: createdProduct.name,
        shop_id: createdProduct.shop_id
      });
      
      toast.success('¡Producto publicado exitosamente!', {
        description: `"${productData.name}" ya está disponible en tu tienda`,
        duration: 6000,
        action: {
          label: 'Ver tienda',
          onClick: () => {
            window.location.href = '/mi-tienda';
          }
        }
      });
      
      // PASO 8: Resetear wizard después de confirmar éxito completo
      console.log('🏁 FINALIZANDO PUBLICACIÓN...');
      
      // Esperar un momento para que el usuario vea el toast de éxito
      setTimeout(() => {
        console.log('🔄 Reseteando wizard...');
        onPublish(); // Reset wizard state
      }, 2000);
      
    } catch (error) {
      console.error('❌ ERROR CRÍTICO EN PUBLICACIÓN:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        uploadedImages: uploadedImageUrls.length,
        wizardState: {
          name: wizardState.name,
          price: wizardState.price,
          category: wizardState.category,
          images_count: wizardState.images?.length || 0
        }
      });

      // Rollback: limpiar imágenes subidas si el producto falló
      if (uploadedImageUrls.length > 0) {
        console.log('🗑️ INICIANDO ROLLBACK DE IMÁGENES...');
        try {
          const imageNames = uploadedImageUrls.map(url => {
            const parts = url.split('/');
            return parts[parts.length - 1];
          });
          
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove(imageNames.map(name => `products/${name}`));
          
          if (deleteError) {
            console.error('❌ ERROR EN ROLLBACK:', deleteError);
          } else {
            console.log('✅ ROLLBACK COMPLETADO - IMÁGENES ELIMINADAS');
          }
        } catch (cleanupError) {
          console.error('❌ ERROR DURANTE ROLLBACK:', cleanupError);
        }
      }

      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error('Error al publicar producto', {
        description: errorMessage,
        duration: 10000,
        action: {
          label: 'Reintentar',
          onClick: () => handlePublish()
        }
      });
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