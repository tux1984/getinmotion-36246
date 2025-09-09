import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

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
      logger.debug('Validating access code', { component: 'waitlist' });
      
      const { data, error } = await supabase.functions.invoke('validate-access-code', {
        body: { code: code.trim() }
      });

      if (error) {
        logger.warn('Access code validation failed', { 
          error: error.message,  
          component: 'waitlist'
        });
        setValidationError('Failed to validate access code');
        return false;
      }

      const validation: AccessCodeValidation = data;
      
      if (!validation.valid) {
        logger.info('Access code rejected', { component: 'waitlist' });
        setValidationError(validation.message);
        return false;
      }

      logger.info('Access code validated successfully', { component: 'waitlist' });
      return true;
    } catch (error) {
      logger.error('Access code validation error', error as Error, { component: 'waitlist' });
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