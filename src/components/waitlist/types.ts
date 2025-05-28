
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
