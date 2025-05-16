
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabaseClient } from '@/lib/supabase-client';
import { FormData, initialFormData } from './types';

export const useWaitlistForm = (language: 'en' | 'es', onSubmitCallback?: () => void) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };
  
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      copilotsInterest: checked 
        ? [...prev.copilotsInterest, id] 
        : prev.copilotsInterest.filter(item => item !== id)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Insert data into Supabase waitlist table
      const { error } = await supabaseClient
        .from('waitlist')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            city: formData.city,
            country: formData.country,
            sector: formData.sector,
            description: formData.description,
            copilots_interest: formData.copilotsInterest,
            problem_to_solve: formData.problemToSolve,
            language: language
          }
        ]);
      
      if (error) throw error;
      
      const successMessage = language === 'en' 
        ? 'Thank you for joining our waitlist!' 
        : '¡Gracias por unirte a nuestra lista de espera!';
      
      const successDescription = language === 'en'
        ? 'We\'ll keep you updated on our progress.'
        : 'Te mantendremos informado sobre nuestro progreso.';
      
      toast({
        title: successMessage,
        description: successDescription,
      });
      
      setFormData(initialFormData);
      if (onSubmitCallback) onSubmitCallback();
    } catch (error) {
      console.error('Error submitting waitlist form:', error);
      toast({
        title: language === 'en' ? 'Error' : 'Error',
        description: language === 'en' 
          ? 'There was a problem submitting your information. Please try again.' 
          : 'Hubo un problema al enviar tu información. Por favor intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleRoleChange,
    handleCheckboxChange,
    handleSubmit
  };
};
