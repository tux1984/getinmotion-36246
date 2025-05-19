
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FormData, initialFormData } from './types';

export const useWaitlistForm = (language: 'en' | 'es', onSubmitCallback?: (success: boolean) => void) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing again
    if (error) setError(null);
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
    // Clear error when user makes a change
    if (error) setError(null);
  };
  
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      copilotsInterest: checked 
        ? [...prev.copilotsInterest, id] 
        : prev.copilotsInterest.filter(item => item !== id)
    }));
    // Clear error when user makes a change
    if (error) setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // Log the data being submitted
      console.log('Submitting waitlist form:', formData);
      
      if (!formData.email || !formData.fullName) {
        const errorMessage = language === 'en' 
          ? 'Please fill in required fields (name and email)'
          : 'Por favor, complete los campos requeridos (nombre y correo electrónico)';
        setError(errorMessage);
        setIsLoading(false);
        return;
      }
      
      // Attempt to insert data into Supabase waitlist table
      const { error: supabaseError } = await supabase
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
      
      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        
        // Show appropriate error message
        let errorMessage = '';
        if (supabaseError.code === '23505') { // Código para violación de restricción única
          errorMessage = language === 'en' 
            ? 'This email is already registered in our waitlist.'
            : 'Este correo electrónico ya está registrado en nuestra lista de espera.';
        } else {
          errorMessage = language === 'en' 
            ? 'There was a problem submitting your information. Please try again.' 
            : 'Hubo un problema al enviar tu información. Por favor, inténtalo de nuevo.';
        }
        
        setError(errorMessage);
        if (onSubmitCallback) onSubmitCallback(false);
      } else {
        // Show success message
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
        if (onSubmitCallback) onSubmitCallback(true);
      }
    } catch (error) {
      console.error('Error submitting waitlist form:', error);
      
      // Show error message
      const errorMessage = language === 'en' 
        ? 'There was a problem submitting your information. Please try again.' 
        : 'Hubo un problema al enviar tu información. Por favor, inténtalo de nuevo.';
      
      setError(errorMessage);
      
      // Call callback with error flag
      if (onSubmitCallback) onSubmitCallback(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleRoleChange,
    handleCheckboxChange,
    handleSubmit,
    setError
  };
};
