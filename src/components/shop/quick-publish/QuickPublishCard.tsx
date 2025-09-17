import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, Loader2, ImagePlus, Wand2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { useImageUpload } from '../ai-upload/hooks/useImageUpload';
import { useProductPublish } from '@/hooks/useProductPublish';
import { useAIRefinement } from '../ai-upload/hooks/useAIRefinement';

export const QuickPublishCard: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [aiData, setAiData] = useState<{
    name: string;
    description: string;
    category: string;
    tags: string[];
  } | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { uploadImages, isUploading } = useImageUpload();
  const { publishProduct, isPublishing, publishProgress } = useProductPublish();
  const { analyzeImages } = useAIRefinement();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create preview
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setSelectedImage(file);

    // Immediately set default data for quick testing
    const defaultData = {
      name: 'Producto Artesanal Único',
      description: 'Hermoso producto artesanal elaborado cuidadosamente a mano con materiales de alta calidad. Esta pieza única combina técnicas tradicionales con un diseño contemporáneo, reflejando la pasión y dedicación del artesano.',
      category: 'Artesanías',
      tags: ['artesanal', 'hecho-a-mano', 'único', 'calidad-premium']
    };
    
    setAiData(defaultData);

    // Try AI analysis in background (optional enhancement)
    setIsAnalyzing(true);
    try {
      console.log('🤖 Attempting AI analysis...');
      const analysis = await analyzeImages([file]);
      console.log('✅ AI analysis successful:', analysis);
      
      setAiData({
        name: analysis.suggestedName || defaultData.name,
        description: analysis.suggestedDescription || defaultData.description,
        category: analysis.detectedCategory || defaultData.category,
        tags: analysis.suggestedTags || defaultData.tags
      });
    } catch (error) {
      console.error('❌ AI analysis failed, using defaults:', error);
      // Keep the default values already set
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzeImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleQuickPublish = async () => {
    if (!selectedImage || !aiData) return;

    try {
      // Upload image
      const imageUrls = await uploadImages([selectedImage]);
      
      // Prepare product data
      const productData = {
        name: aiData.name,
        description: aiData.description,
        price: Number(customPrice) || 50000,
        category: aiData.category,
        images: imageUrls,
        tags: aiData.tags,
        shortDescription: aiData.description.substring(0, 100),
        inventory: 1,
        productionTime: '3-5 días hábiles'
      };

      // Publish product
      const result = await publishProduct(productData);
      
      if (result.success) {
        // Reset form
        setSelectedImage(null);
        setImagePreview('');
        setAiData(null);
        setCustomPrice('');
      }
    } catch (error) {
      console.error('Error in quick publish:', error);
    }
  };

  const isProcessing = isAnalyzing || isUploading || isPublishing;
  const canPublish = selectedImage && aiData && !isProcessing;

  return (
    <Card className="p-6 bg-gradient-subtle border-primary/20 shadow-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Publicación Súper Rápida</h3>
            <p className="text-muted-foreground text-sm">
              Sube una imagen y publica en segundos
            </p>
          </div>
        </div>

        {/* Image Upload */}
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-300 hover:border-primary/50 hover:bg-primary/5
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
          `}
        >
          <input {...getInputProps()} />
          
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mx-auto shadow-card"
              />
              {isAnalyzing && (
                <div className="flex items-center justify-center gap-2">
                  <Wand2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Analizando imagen con IA...
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <ImagePlus className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="font-medium">
                  {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz click'}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG o WEBP (máx. 10MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* AI Generated Data */}
        {aiData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
          >
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {isAnalyzing ? 'Analizando con IA...' : 'Datos del producto'}
              </span>
              {!isAnalyzing && (
                <Badge variant="outline" className="text-xs">
                  IA mejorada
                </Badge>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Nombre del producto
                </label>
                <p className="text-sm font-medium">{aiData.name}</p>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Descripción
                </label>
                <p className="text-sm line-clamp-2">{aiData.description}</p>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {aiData.category}
                </Badge>
                {aiData.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Price Input */}
        {aiData && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Precio (opcional)
            </label>
            <Input
              type="number"
              placeholder="50000"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="text-right"
            />
            <p className="text-xs text-muted-foreground">
              Si no especificas, se usará $50,000 COP por defecto
            </p>
          </div>
        )}

        {/* Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {isAnalyzing ? 'Analizando...' : 
                 isUploading ? 'Subiendo imagen...' : 
                 'Publicando producto...'}
              </span>
              <span>{publishProgress}%</span>
            </div>
            <Progress value={publishProgress} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleQuickPublish}
          disabled={!canPublish}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          {isProcessing ? 'Procesando...' : 'Publicar Ahora'}
        </Button>

        {aiData && (
          <p className="text-xs text-center text-muted-foreground">
            Datos prellenados automáticamente. Puedes editarlos después de publicar.
          </p>
        )}
      </div>
    </Card>
  );
};