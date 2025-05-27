
import React, { useState } from 'react';
import { ChevronDown, Users, Sparkles, Clock } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, KeyRound } from 'lucide-react';
import { translations } from './translations';
import { TextField, TextAreaField, SelectField } from './FormField';
import { CheckboxGroup } from './CheckboxGroup';
import { useWaitlistForm } from './useWaitlistForm';
import { WaitlistFormProps } from './types';

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

  const t = translations[language];

  // Check if access code is valid on change
  React.useEffect(() => {
    if (formData.accessCode && formData.accessCode.trim() === "motionproject") {
      setCodeValidated(true);
    } else {
      setCodeValidated(false);
    }
  }, [formData.accessCode]);

  const headerTranslations = {
    en: {
      title: "Join the Motion Waitlist",
      subtitle: "Be among the first to experience the future of cultural creation",
      stats: "Join 500+ creators already waiting",
      expandText: "Join Waitlist",
      collapseText: "Close Form"
    },
    es: {
      title: "Únete a la Lista de Motion",
      subtitle: "Sé parte de los primeros en experimentar el futuro de la creación cultural",
      stats: "Únete a más de 500 creadores esperando",
      expandText: "Unirse a Lista",
      collapseText: "Cerrar Formulario"
    }
  };

  const ht = headerTranslations[language];

  return (
    <div className="w-full py-8 md:py-12 px-4 sm:px-6 lg:px-8" id="waitlist">
      <div className="w-full max-w-4xl mx-auto">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* Attractive Header - Always Visible */}
          <div className="relative group mb-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="bg-gradient-to-br from-indigo-950/95 to-purple-950/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden relative border border-indigo-700/30">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl border border-pink-300/20">
                        <Sparkles className="h-6 w-6 text-pink-300" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                          {ht.title}
                        </h2>
                        <p className="text-indigo-200/80 text-sm md:text-base mt-1">
                          {ht.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-indigo-300/70">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{ht.stats}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{language === 'en' ? 'Early access' : 'Acceso anticipado'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CollapsibleTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-none text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isOpen ? ht.collapseText : ht.expandText}
                      <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Form Content */}
          <CollapsibleContent className="space-y-6 animate-accordion-down">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/50 to-purple-600/50 rounded-xl blur-sm opacity-50"></div>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden relative border border-gray-200">
                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                  {submitted && (
                    <Alert className="bg-green-50 border-green-200 mb-6">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {language === 'en' ? 
                          'Your information has been submitted. Thank you!' : 
                          '¡Tu información ha sido enviada. Gracias!'}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {error && (
                    <Alert className="bg-red-50 border-red-200 mb-6">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Accordion type="single" collapsible defaultValue="personal" className="space-y-4">
                    {/* Personal Information Section */}
                    <AccordionItem value="personal" className="border border-gray-200 rounded-lg px-4">
                      <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                        {language === 'en' ? '👤 Personal Information' : '👤 Información Personal'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
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
                      </AccordionContent>
                    </AccordionItem>

                    {/* Professional Information Section */}
                    <AccordionItem value="professional" className="border border-gray-200 rounded-lg px-4">
                      <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                        {language === 'en' ? '💼 Professional Information' : '💼 Información Profesional'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <SelectField
                          id="role"
                          label={t.role}
                          value={formData.role}
                          onChange={handleRoleChange}
                          options={t.roleOptions}
                        />
                        
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
                      </AccordionContent>
                    </AccordionItem>

                    {/* Interests & Needs Section */}
                    <AccordionItem value="interests" className="border border-gray-200 rounded-lg px-4">
                      <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                        {language === 'en' ? '🎯 Interests & Needs' : '🎯 Intereses y Necesidades'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
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
                      </AccordionContent>
                    </AccordionItem>

                    {/* Access Code Section */}
                    <AccordionItem value="access" className="border border-pink-200 rounded-lg px-4 bg-gradient-to-r from-pink-50 to-purple-50">
                      <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:no-underline">
                        {language === 'en' ? '🔑 Special Access' : '🔑 Acceso Especial'}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="flex items-start space-x-3">
                          <KeyRound className="h-5 w-5 text-pink-500 mt-1" />
                          <div className="flex-1">
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
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
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
