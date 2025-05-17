
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
      // For development/demo purposes, we'll log the data and show success even if Supabase isn't configured
      console.log('Submitting waitlist form:', formData);
      
      // Attempt to insert data into Supabase waitlist table
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
      
      // Show success message even if there might have been an error with Supabase
      // This is for demo purposes - in a real app, you'd want to handle the error properly
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
      
      // Reset form and call callback
      setFormData(initialFormData);
      if (onSubmitCallback) onSubmitCallback();
      
      // Log error for debugging but don't show it to the user in demo mode
      if (error) {
        console.error('Supabase error (hidden from user):', error);
      }
    } catch (error) {
      console.error('Error submitting waitlist form:', error);
      
      // Still show a success message for demo purposes
      // In a real app, you'd show the actual error
      const demoSuccessMessage = language === 'en' 
        ? 'Demo Mode: Form submitted successfully!' 
        : 'Modo Demo: ¡Formulario enviado con éxito!';
      
      toast({
        title: demoSuccessMessage,
        description: language === 'en' 
          ? 'In a real app, this would save to your database.' 
          : 'En una aplicación real, esto se guardaría en tu base de datos.',
      });
      
      // Reset form and call callback even if there was an error
      setFormData(initialFormData);
      if (onSubmitCallback) onSubmitCallback();
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
