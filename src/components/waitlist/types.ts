
export interface WaitlistFormData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  city: string;
  country: string;
  sector: string;
  description: string;
  copilotsInterest: string[];
  problemToSolve: string;
  accessCode?: string;
}

export interface WaitlistFormProps {
  onSubmit?: () => void;
  onCodeSubmit?: (code: string) => void;
  language: 'en' | 'es';
  showWaitlist?: boolean;
}

export type Language = 'en' | 'es';

// Export FormData as an alias for WaitlistFormData for backward compatibility
export type FormData = WaitlistFormData;

// Export the initial form data
export const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  role: 'artist',
  city: '',
  country: '',
  sector: '',
  description: '',
  copilotsInterest: [],
  problemToSolve: '',
  accessCode: '',
};
