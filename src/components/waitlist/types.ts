
export interface WaitlistFormProps {
  onSubmit?: () => void;
  onCodeSubmit?: (code: string) => void;
  language: 'en' | 'es';
}

export type FormData = {
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
};

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
