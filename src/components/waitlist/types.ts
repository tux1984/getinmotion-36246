
export interface FormData {
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
}

export const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  role: '',
  city: '',
  country: '',
  sector: '',
  description: '',
  copilotsInterest: [],
  problemToSolve: '',
};

export interface WaitlistFormProps {
  onSubmit?: () => void;
  language: 'en' | 'es';
}
