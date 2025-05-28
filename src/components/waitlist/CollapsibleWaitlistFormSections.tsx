
import React from 'react';
import { KeyRound, CheckCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TextField, TextAreaField, SelectField } from './FormField';
import { CheckboxGroup } from './CheckboxGroup';
import { WaitlistFormData } from './types';

interface CollapsibleWaitlistFormSectionsProps {
  formData: WaitlistFormData;
  translations: any;
  language: 'en' | 'es';
  codeValidated: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRoleChange: (value: string) => void;
  onCheckboxChange: (id: string, checked: boolean) => void;
}

export const CollapsibleWaitlistFormSections: React.FC<CollapsibleWaitlistFormSectionsProps> = ({
  formData,
  translations: t,
  language,
  codeValidated,
  onInputChange,
  onRoleChange,
  onCheckboxChange
}) => {
  return (
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
            onChange={onInputChange}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              id="email"
              name="email"
              label={t.email}
              value={formData.email}
              onChange={onInputChange}
              required
              type="email"
            />
            <TextField
              id="phone"
              name="phone"
              label={t.phone}
              value={formData.phone}
              onChange={onInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              id="city"
              name="city"
              label={t.city}
              value={formData.city}
              onChange={onInputChange}
            />
            <TextField
              id="country"
              name="country"
              label={t.country}
              value={formData.country}
              onChange={onInputChange}
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
            onChange={onRoleChange}
            options={t.roleOptions}
          />
          
          <TextField
            id="sector"
            name="sector"
            label={t.sector}
            value={formData.sector}
            onChange={onInputChange}
            placeholder={t.sectorPlaceholder}
          />
          
          <TextAreaField
            id="description"
            name="description"
            label={t.description}
            value={formData.description}
            onChange={onInputChange}
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
            onChange={onCheckboxChange}
          />
          
          <TextAreaField
            id="problemToSolve"
            name="problemToSolve"
            label={t.problemToSolve}
            value={formData.problemToSolve}
            onChange={onInputChange}
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
                onChange={onInputChange}
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
  );
};
