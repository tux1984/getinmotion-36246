
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, KeyRound } from 'lucide-react';
import { translations } from './translations';
import { TextField, TextAreaField, SelectField } from './FormField';
import { CheckboxGroup } from './CheckboxGroup';
import { useWaitlistForm } from './useWaitlistForm';
import { WaitlistFormProps } from './types';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseStatus } from './SupabaseStatus';

const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('waitlist').select('count').limit(1);
    return { connected: !error };
  } catch (error) {
    return { connected: false };
  }
};

export const WaitlistForm = ({ onSubmit, onCodeSubmit, language }: WaitlistFormProps) => {
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

  // Check if access code is valid on change
  useEffect(() => {
    if (formData.accessCode && formData.accessCode.trim() === "motionproject") {
      setCodeValidated(true);
      if (onCodeSubmit) onCodeSubmit(formData.accessCode);
    } else {
      setCodeValidated(false);
    }
  }, [formData.accessCode, onCodeSubmit]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <h3 className="text-xl font-semibold text-center mb-6">{t.title}</h3>
      
      {showConnectionStatus && (
        <div className="mb-4">
          <SupabaseStatus />
        </div>
      )}
      
      {submitted && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {language === 'en' ? 
              'Your information has been submitted. Thank you!' : 
              '¡Tu información ha sido enviada. Gracias!'}
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <TextField
          id="fullName"
          name="fullName"
          label={t.fullName}
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            id="email"
            name="email"
            label={t.email}
            value={formData.email}
            onChange={handleInputChange}
            required
            type="email"
          />
          <TextField
            id="phone"
            name="phone"
            label={t.phone}
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        
        <SelectField
          id="role"
          label={t.role}
          value={formData.role}
          onChange={handleRoleChange}
          options={t.roleOptions}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            id="city"
            name="city"
            label={t.city}
            value={formData.city}
            onChange={handleInputChange}
          />
          <TextField
            id="country"
            name="country"
            label={t.country}
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
        
        <TextField
          id="sector"
          name="sector"
          label={t.sector}
          value={formData.sector}
          onChange={handleInputChange}
          placeholder={t.sectorPlaceholder}
        />
        
        <TextAreaField
          id="description"
          name="description"
          label={t.description}
          value={formData.description}
          onChange={handleInputChange}
          placeholder={t.descriptionPlaceholder}
        />
        
        <CheckboxGroup
          title={t.copilotsInterest}
          options={t.copilotOptions}
          selectedValues={formData.copilotsInterest}
          onChange={handleCheckboxChange}
        />
        
        <TextAreaField
          id="problemToSolve"
          name="problemToSolve"
          label={t.problemToSolve}
          value={formData.problemToSolve}
          onChange={handleInputChange}
          placeholder={t.problemPlaceholder}
        />

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 opacity-20 blur-sm rounded-lg"></div>
          <div className="relative p-4 border border-pink-200 rounded-lg bg-white/80">
            <div className="flex items-start space-x-3">
              <KeyRound className="h-5 w-5 text-pink-500 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {language === 'en' ? 'Have an access code?' : '¿Tienes un código de acceso?'}
                </h4>
                <TextField
                  id="accessCode"
                  name="accessCode"
                  label={language === 'en' ? 'Access Code' : 'Código de Acceso'}
                  value={formData.accessCode || ''}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'Enter your code' : 'Ingresa tu código'}
                />
                {codeValidated && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Valid code!' : '¡Código válido!'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
