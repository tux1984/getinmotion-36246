import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AIRefinementOptions {
  context: string;
  currentValue: string;
  userPrompt: string;
  additionalContext?: Record<string, any>;
}

export const useAIRefinement = () => {
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refineContent = useCallback(async ({
    context,
    currentValue,
    userPrompt,
    additionalContext = {}
  }: AIRefinementOptions): Promise<string | null> => {
    setIsRefining(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-content-refiner', {
        body: {
          context,
          currentValue,
          userPrompt,
          additionalContext
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.refinedContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error refinando contenido';
      setError(errorMessage);
      console.error('AI Refinement error:', err);
      return null;
    } finally {
      setIsRefining(false);
    }
  }, []);

  const analyzeImages = useCallback(async (images: File[]): Promise<{
    suggestedName: string;
    suggestedDescription: string;
    detectedCategory: string;
    suggestedTags: string[];
  } | null> => {
    setIsRefining(true);
    setError(null);

    try {
      console.log('🔄 Starting image analysis for', images.length, 'images');
      
      // Validate files
      for (const file of images) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error(`Image ${file.name} is too large (max 10MB)`);
        }
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} is not a valid image`);
        }
      }

      // Convert images to base64 for analysis
      const imagePromises = images.slice(0, 3).map(async (image, index) => {
        return new Promise<string>((resolve, reject) => {
          console.log(`📷 Converting image ${index + 1}:`, image.name, image.type, image.size);
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            console.log(`✅ Image ${index + 1} converted, size:`, result.length, 'chars');
            resolve(result);
          };
          reader.onerror = () => {
            console.error(`❌ Failed to convert image ${index + 1}:`, reader.error);
            reject(new Error(`Failed to convert image ${image.name}`));
          };
          reader.readAsDataURL(image);
        });
      });

      const base64Images = await Promise.all(imagePromises);
      console.log('📤 Sending images to AI analyzer...');

      const { data, error } = await supabase.functions.invoke('ai-image-analyzer', {
        body: {
          images: base64Images
        }
      });

      console.log('📥 AI analyzer response:', { data, error });

      if (error) {
        console.error('🚨 Service error:', error);
        throw new Error(error.message);
      }

      if (data?.error) {
        console.error('🚨 Data error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.analysis) {
        console.error('🚨 No analysis data received:', data);
        throw new Error('No analysis data received from AI service');
      }

      console.log('✅ Analysis completed successfully:', data.analysis);
      return data.analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error analizando imágenes';
      setError(errorMessage);
      console.error('❌ AI Image Analysis error:', err);
      return null;
    } finally {
      setIsRefining(false);
    }
  }, []);

  return {
    refineContent,
    analyzeImages,
    isRefining,
    error,
  };
};