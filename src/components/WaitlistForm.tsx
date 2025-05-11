
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WaitlistFormProps {
  onSubmit?: () => void;
  language: 'en' | 'es';
}

interface FormData {
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

const initialFormData: FormData = {
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

export const WaitlistForm = ({ onSubmit, language }: WaitlistFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  
  const translations = {
    en: {
      title: 'Join the Waitlist',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone Number (WhatsApp optional)',
      role: 'Your Role',
      roleOptions: {
        artist: 'Artist',
        manager: 'Manager',
        politician: 'Politician',
        producer: 'Producer',
        other: 'Other'
      },
      city: 'City',
      country: 'Country',
      sector: 'Cultural or Creative Sector',
      sectorPlaceholder: 'E.g. Music, Visual Arts, Theatre, etc.',
      description: 'Brief description of your practice',
      descriptionPlaceholder: 'Tell us about your creative work or organization...',
      copilotsInterest: 'Which copilots are you interested in?',
      copilotOptions: {
        sales: 'Sales',
        legal: 'Legal',
        content: 'Content',
        scheduling: 'Scheduling',
        collaborations: 'Collaborations'
      },
      problemToSolve: 'What problem do you hope to solve with AI?',
      problemPlaceholder: 'Share your challenges or what you expect from Motion...',
      submitButton: 'Join the Waitlist',
      submitting: 'Submitting...',
      successMessage: 'Thank you for joining our waitlist!',
      successDescription: 'We\'ll keep you updated on our progress.',
    },
    es: {
      title: 'Únete a la Lista de Espera',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono (WhatsApp opcional)',
      role: 'Tu Rol',
      roleOptions: {
        artist: 'Artista',
        manager: 'Gestor',
        politician: 'Político',
        producer: 'Productor',
        other: 'Otro'
      },
      city: 'Ciudad',
      country: 'País',
      sector: 'Sector Cultural o Creativo',
      sectorPlaceholder: 'Ej. Música, Artes Visuales, Teatro, etc.',
      description: 'Breve descripción de tu práctica',
      descriptionPlaceholder: 'Cuéntanos sobre tu trabajo creativo u organización...',
      copilotsInterest: '¿Qué copilotos te interesan?',
      copilotOptions: {
        sales: 'Ventas',
        legal: 'Legal',
        content: 'Contenido',
        scheduling: 'Agenda',
        collaborations: 'Colaboraciones'
      },
      problemToSolve: '¿Qué problema esperas resolver con IA?',
      problemPlaceholder: 'Comparte tus desafíos o lo que esperas de Motion...',
      submitButton: 'Unirme a la Lista de Espera',
      submitting: 'Enviando...',
      successMessage: '¡Gracias por unirte a nuestra lista de espera!',
      successDescription: 'Te mantendremos informado sobre nuestro progreso.',
    }
  };

  const t = translations[language];
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t.successMessage,
        description: t.successDescription,
      });
      setFormData(initialFormData);
      if (onSubmit) onSubmit();
    }, 1000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <h3 className="text-xl font-semibold text-center mb-6">{t.title}</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">{t.fullName}</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">{t.phone}</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="role">{t.role}</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder=" " />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="artist">{t.roleOptions.artist}</SelectItem>
              <SelectItem value="manager">{t.roleOptions.manager}</SelectItem>
              <SelectItem value="politician">{t.roleOptions.politician}</SelectItem>
              <SelectItem value="producer">{t.roleOptions.producer}</SelectItem>
              <SelectItem value="other">{t.roleOptions.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">{t.city}</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="country">{t.country}</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="sector">{t.sector}</Label>
          <Input
            id="sector"
            name="sector"
            placeholder={t.sectorPlaceholder}
            value={formData.sector}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="description">{t.description}</Label>
          <Textarea
            id="description"
            name="description"
            placeholder={t.descriptionPlaceholder}
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
        
        <div>
          <Label className="mb-2 block">{t.copilotsInterest}</Label>
          <div className="grid grid-cols-2 gap-3">
            {['sales', 'legal', 'content', 'scheduling', 'collaborations'].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={option} 
                  checked={formData.copilotsInterest.includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                />
                <Label htmlFor={option} className="cursor-pointer">
                  {t.copilotOptions[option as keyof typeof t.copilotOptions]}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="problemToSolve">{t.problemToSolve}</Label>
          <Textarea
            id="problemToSolve"
            name="problemToSolve"
            placeholder={t.problemPlaceholder}
            value={formData.problemToSolve}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
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
