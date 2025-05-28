
import React from 'react';
import { TextField, TextAreaField, SelectField } from './FormField';
import { CheckboxGroup } from './CheckboxGroup';
import { WaitlistFormData } from './types';

interface WaitlistFormFieldsProps {
  formData: WaitlistFormData;
  translations: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRoleChange: (value: string) => void;
  onCheckboxChange: (id: string, checked: boolean) => void;
}

export const WaitlistFormFields: React.FC<WaitlistFormFieldsProps> = ({
  formData,
  translations: t,
  onInputChange,
  onRoleChange,
  onCheckboxChange
}) => {
  return (
    <div className="space-y-4">
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
      
      <SelectField
        id="role"
        label={t.role}
        value={formData.role}
        onChange={onRoleChange}
        options={t.roleOptions}
      />
      
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
    </div>
  );
};
