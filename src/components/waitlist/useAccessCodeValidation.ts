import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AccessCodeValidation {
  valid: boolean;
  message: string;
  codeInfo?: {
    description: string;
  };
}

export const useAccessCodeValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAccessCode = useCallback(async (code: string): Promise<boolean> => {
    if (!code || !code.trim()) {
      return false;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const { data, error } = await supabase.functions.invoke('validate-access-code', {
        body: { code: code.trim() }
      });

      if (error) {
        setValidationError('Failed to validate access code');
        return false;
      }

      const validation: AccessCodeValidation = data;
      
      if (!validation.valid) {
        setValidationError(validation.message);
        return false;
      }

      return true;
    } catch (error) {
      setValidationError('Network error while validating code');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidationError = useCallback(() => {
    setValidationError(null);
  }, []);

  return {
    validateAccessCode,
    isValidating,
    validationError,
    clearValidationError
  };
};