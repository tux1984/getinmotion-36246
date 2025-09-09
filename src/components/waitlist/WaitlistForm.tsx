
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { translations } from './translations';
import { useWaitlistForm } from './useWaitlistForm';
import { useAccessCodeValidation } from './useAccessCodeValidation';
import { WaitlistFormProps } from './types';
import { supabase } from '@/integrations/supabase/client';
import { WaitlistFormHeader } from './WaitlistFormHeader';
import { WaitlistFormAlerts } from './WaitlistFormAlerts';
import { WaitlistFormFields } from './WaitlistFormFields';
import { WaitlistAccessCodeSection } from './WaitlistAccessCodeSection';

const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('waitlist').select('count').limit(1);
    return { connected: !error };
  } catch (error) {
    return { connected: false };
  }
};

export const WaitlistForm = ({ onSubmit, onCodeSubmit, language, showWaitlist = true }: WaitlistFormProps & { showWaitlist?: boolean }) => {
  const {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleRoleChange,
    handleCheckboxChange,
    handleSubmit
  } = useWaitlistForm(language, (success) => {
    if (success) {
      setSubmitted(true);
      // Reset the submitted state after 5 seconds to allow for another submission
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
    
    if (onSubmit) onSubmit();
  });

  const { validateAccessCode, isValidating, validationError, clearValidationError } = useAccessCodeValidation();
  
  const [submitted, setSubmitted] = useState(false);
  const [showConnectionStatus, setShowConnectionStatus] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);
  const t = translations[language];
  
  useEffect(() => {
    // Only show connection status in admin view or if there's an error
    const checkIfMockMode = async () => {
      const status = await checkSupabaseConnection();
      setShowConnectionStatus(!status.connected);
    };
    
    checkIfMockMode();
  }, []);

  // Validate access code when it changes
  useEffect(() => {
    const validateCode = async () => {
      if (formData.accessCode && formData.accessCode.trim()) {
        clearValidationError();
        const isValid = await validateAccessCode(formData.accessCode.trim());
        setCodeValidated(isValid);
        if (isValid && onCodeSubmit) {
          onCodeSubmit(formData.accessCode);
        }
      } else {
        setCodeValidated(false);
        clearValidationError();
      }
    };

    // Debounce validation to avoid too many requests
    const debounceTimer = setTimeout(validateCode, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.accessCode, validateAccessCode, clearValidationError, onCodeSubmit]);

  // Don't render anything if showWaitlist is false
  if (!showWaitlist) {
    return null;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <WaitlistFormHeader 
        title={t.title}
        showConnectionStatus={showConnectionStatus}
      />
      
      <WaitlistFormAlerts 
        submitted={submitted}
        error={error}
        language={language}
      />
      
      <WaitlistFormFields
        formData={formData}
        translations={t}
        onInputChange={handleInputChange}
        onRoleChange={handleRoleChange}
        onCheckboxChange={handleCheckboxChange}
      />

      <WaitlistAccessCodeSection
        accessCode={formData.accessCode}
        codeValidated={codeValidated}
        language={language}
        onInputChange={handleInputChange}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        disabled={isLoading || submitted}
      >
        {isLoading ? t.submitting : submitted ? (language === 'en' ? 'Submitted!' : '¡Enviado!') : t.submitButton}
      </Button>
    </form>
  );
};
