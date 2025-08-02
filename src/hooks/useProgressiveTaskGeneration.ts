import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export const useProgressiveTaskGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const generateProgressiveTasks = async () => {
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
      console.log('Generating progressive tasks for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('generate-progressive-tasks', {
        body: {
          userId: user.id,
          language: language
        }
      });

      if (error) {
        console.error('Error generating progressive tasks:', error);
        toast({
          title: language === 'es' ? 'Error' : 'Error',
          description: language === 'es' 
            ? 'Error al generar tareas progresivas'
            : 'Error generating progressive tasks',
          variant: 'destructive',
        });
        return false;
      }

      const tasksCreated = data?.tasksCreated || 0;
      
      toast({
        title: language === 'es' ? '¡Tareas generadas!' : 'Tasks generated!',
        description: language === 'es' 
          ? `Se generaron ${tasksCreated} nuevas tareas basadas en tu progreso actual`
          : `Generated ${tasksCreated} new tasks based on your current progress`,
        variant: 'default',
      });

      console.log('Progressive tasks generated successfully:', {
        tasksCreated,
        analysisContext: data?.analysisContext
      });

      return true;
    } catch (error) {
      console.error('Failed to generate progressive tasks:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'Error inesperado al generar tareas'
          : 'Unexpected error generating tasks',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateProgressiveTasks,
    isGenerating
  };
};