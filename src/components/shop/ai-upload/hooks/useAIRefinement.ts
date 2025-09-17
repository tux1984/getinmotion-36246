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
      // Convert images to base64 for analysis
      const imagePromises = images.slice(0, 3).map(async (image) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(image);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      const { data, error } = await supabase.functions.invoke('ai-image-analyzer', {
        body: {
          images: base64Images
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error analizando imágenes';
      setError(errorMessage);
      console.error('AI Image Analysis error:', err);
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