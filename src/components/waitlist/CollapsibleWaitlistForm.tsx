
import React, { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { translations } from './translations';
import { useWaitlistForm } from './useWaitlistForm';
import { useAccessCodeValidation } from './useAccessCodeValidation';
import { CollapsibleWaitlistFormHeader } from './CollapsibleWaitlistFormHeader';
import { CollapsibleWaitlistFormAlerts } from './CollapsibleWaitlistFormAlerts';
import { CollapsibleWaitlistFormSections } from './CollapsibleWaitlistFormSections';

interface CollapsibleWaitlistFormProps {
  language: 'en' | 'es';
}

export const CollapsibleWaitlistForm: React.FC<CollapsibleWaitlistFormProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);
  
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
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    }
  });

  const { validateAccessCode, isValidating, validationError, clearValidationError } = useAccessCodeValidation();

  const t = translations[language];

  // Validate access code when it changes
  React.useEffect(() => {
    const validateCode = async () => {
      if (formData.accessCode && formData.accessCode.trim()) {
        clearValidationError();
        const isValid = await validateAccessCode(formData.accessCode.trim());
        setCodeValidated(isValid);
      } else {
        setCodeValidated(false);
        clearValidationError();
      }
    };

    // Debounce validation to avoid too many requests
    const debounceTimer = setTimeout(validateCode, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.accessCode, validateAccessCode, clearValidationError]);

  // Listen for URL hash changes to open the form automatically
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#waitlist' || window.location.pathname.includes('waitlist')) {
        setIsOpen(true);
      }
    };

    // Check initial hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Auto-open when scrolled to
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setIsOpen(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    const waitlistElement = document.getElementById('waitlist');
    if (waitlistElement) {
      observer.observe(waitlistElement);
    }

    return () => {
      if (waitlistElement) {
        observer.unobserve(waitlistElement);
      }
    };
  }, []);

  return (
    <div className="w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8" id="waitlist">
      <div className="w-full max-w-4xl mx-auto">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleWaitlistFormHeader 
            language={language}
            isOpen={isOpen}
          />

          <CollapsibleContent className="space-y-6 animate-accordion-down">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/50 to-purple-600/50 rounded-xl blur-sm opacity-50"></div>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden relative border border-gray-200">
                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                  <CollapsibleWaitlistFormAlerts 
                    submitted={submitted}
                    error={error}
                    language={language}
                  />

                  <CollapsibleWaitlistFormSections
                    formData={formData}
                    translations={t}
                    language={language}
                    codeValidated={codeValidated}
                    onInputChange={handleInputChange}
                    onRoleChange={handleRoleChange}
                    onCheckboxChange={handleCheckboxChange}
                  />
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading || submitted}
                    >
                      {isLoading ? t.submitting : submitted ? (language === 'en' ? 'Submitted!' : '¡Enviado!') : t.submitButton}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
