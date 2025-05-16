
import React from 'react';
import { Button } from '@/components/ui/button';
import { translations } from './translations';
import { TextField, TextAreaField, SelectField } from './FormField';
import { CheckboxGroup } from './CheckboxGroup';
import { useWaitlistForm } from './useWaitlistForm';
import { WaitlistFormProps } from './types';

export const WaitlistForm = ({ onSubmit, language }: WaitlistFormProps) => {
  const {
    formData,
    isLoading,
    handleInputChange,
    handleRoleChange,
    handleCheckboxChange,
    handleSubmit
  } = useWaitlistForm(language, onSubmit);
  
  const t = translations[language];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <h3 className="text-xl font-semibold text-center mb-6">{t.title}</h3>
      
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
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        disabled={isLoading}
      >
        {isLoading ? t.submitting : t.submitButton}
      </Button>
    </form>
  );
};
