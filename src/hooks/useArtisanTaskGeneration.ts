import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { ArtisanProfile } from '@/utils/artisanTaskGenerator';

export const useArtisanTaskGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const generateArtisanTasks = async (profileData: ArtisanProfile) => {
    if (!user) {
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'Debes estar autenticado para generar tareas'
          : 'You must be authenticated to generate tasks',
        variant: 'destructive',
      });
      return false;
    }

    setIsGenerating(true);
    
    try {
      console.log('Generating artisan tasks for profile:', profileData);
      
      const { data, error } = await supabase.functions.invoke('generate-artisan-tasks', {
        body: {
          userId: user.id,
          profileData,
          language
        }
      });

      if (error) {
        console.error('Error generating artisan tasks:', error);
        toast({
          title: language === 'es' ? 'Error' : 'Error',
          description: language === 'es' 
            ? 'Error al generar tareas para artesanos'
            : 'Error generating artisan tasks',
          variant: 'destructive',
        });
        return false;
      }

      const tasksCreated = data?.tasksCreated || 0;
      
      toast({
        title: language === 'es' ? '¡Tareas artesanales creadas!' : 'Artisan tasks created!',
        description: language === 'es' 
          ? `Se crearon ${tasksCreated} tareas personalizadas para tu arte de ${profileData.productType}`
          : `Created ${tasksCreated} personalized tasks for your ${profileData.productType} craft`,
        variant: 'default',
      });

      console.log('Artisan tasks generated successfully:', {
        tasksCreated,
        profileAnalysis: data?.profileAnalysis
      });

      return true;
    } catch (error) {
      console.error('Failed to generate artisan tasks:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'Error inesperado al generar tareas artesanales'
          : 'Unexpected error generating artisan tasks',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateArtisanTasks,
    isGenerating
  };
};