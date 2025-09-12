import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRobustAuth } from '@/hooks/useRobustAuth';

import { useToast } from '@/hooks/use-toast';
// import { ArtisanProfile } from '@/types/artisan';

export const useArtisanTaskGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useRobustAuth();
  const language = 'en'; // Fixed to English only
  const { toast } = useToast();

  const generateArtisanTasks = async (profileData: any) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be authenticated to generate tasks',
        variant: 'destructive',
      });
      return false;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('intelligent-functions', {
        body: {
          action: 'generate_artisan_tasks',
          userId: user.id,
          profileData,
          language: 'en'
        }
      });

      if (error) {
        console.error('Error generating artisan tasks:', error);
        toast({
          title: 'Error',
          description: 'Error generating artisan tasks',
          variant: 'destructive',
        });
        return false;
      }

      const tasksCreated = data?.tasksCreated || 0;
      
      toast({
        title: 'Artisan tasks created!',
        description: `Created ${tasksCreated} personalized tasks for your ${profileData.productType} craft`,
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
        title: 'Error',
        description: 'Unexpected error generating artisan tasks',
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