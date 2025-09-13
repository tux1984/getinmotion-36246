import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DEFAULT_LANGUAGE, type Language } from '@/types/language';

interface LanguageSystemHook {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  isLoading: boolean;
  needsLanguageSelection: boolean;
  updateMasterCoordinatorLanguage: (language: Language) => Promise<void>;
}

export const useLanguageSystem = (): LanguageSystemHook => {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [needsLanguageSelection, setNeedsLanguageSelection] = useState(false);

  // Load user's language preference
  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (!user) return;

      try {
        // Check user profile first
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('language_preference')
          .eq('user_id', user.id)
          .single();

        if (profile?.language_preference) {
          setLanguageState(profile.language_preference as Language);
          setNeedsLanguageSelection(false);
        } else {
          // Check master context as fallback
          const { data: context } = await supabase
            .from('user_master_context')
            .select('language_preference')
            .eq('user_id', user.id)
            .single();

          if (context?.language_preference) {
            setLanguageState(context.language_preference as Language);
            setNeedsLanguageSelection(false);
          } else {
            // No language preference found - need selection
            setNeedsLanguageSelection(true);
          }
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
        setNeedsLanguageSelection(true);
      }
    };

    loadLanguagePreference();
  }, [user]);

  // Update Master Coordinator with new language
  const updateMasterCoordinatorLanguage = useCallback(async (newLanguage: Language) => {
    if (!user) return;

    try {
      // Update or create master context
      const { error } = await supabase
        .from('user_master_context')
        .upsert({
          user_id: user.id,
          language_preference: newLanguage,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      // Notify Master Coordinator about language change
      await supabase.functions.invoke('contexto-maestro', {
        body: {
          action: 'update',
          userId: user.id,
          agentId: 'master-coordinator',
          newInsight: `User changed language preference to ${newLanguage}`
        }
      });

    } catch (error) {
      console.error('Error updating Master Coordinator language:', error);
      throw error;
    }
  }, [user]);

  // Set language and persist it
  const setLanguage = useCallback(async (newLanguage: Language) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          language_preference: newLanguage,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) throw profileError;

      // Update Master Coordinator
      await updateMasterCoordinatorLanguage(newLanguage);

      // Update local state
      setLanguageState(newLanguage);
      setNeedsLanguageSelection(false);

      // Update localStorage for immediate UI updates
      localStorage.setItem('user_language_preference', newLanguage);

      toast.success('Idioma actualizado correctamente');
    } catch (error) {
      console.error('Error setting language:', error);
      toast.error('Error al actualizar el idioma');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, updateMasterCoordinatorLanguage]);

  return {
    language,
    setLanguage,
    isLoading,
    needsLanguageSelection,
    updateMasterCoordinatorLanguage
  };
};