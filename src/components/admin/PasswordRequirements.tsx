import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ 
  password, 
  className 
}) => {
  const requirements = [
    {
      test: (pwd: string) => pwd.length >= 8,
      label: 'Mínimo 8 caracteres'
    },
    {
      test: (pwd: string) => /[A-Z]/.test(pwd),
      label: 'Al menos una letra mayúscula'
    },
    {
      test: (pwd: string) => /[a-z]/.test(pwd),
      label: 'Al menos una letra minúscula'
    },
    {
      test: (pwd: string) => /\d/.test(pwd),
      label: 'Al menos un número'
    },
    {
      test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd),
      label: 'Al menos un símbolo especial (recomendado)'
    }
  ];

  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="text-sm font-medium text-muted-foreground">Requisitos de la contraseña:</h4>
      <ul className="space-y-1">
        {requirements.map((req, index) => {
          const isMet = password ? req.test(password) : false;
          const isOptional = index === 4; // Último requisito es opcional
          
          return (
            <li key={index} className="flex items-center gap-2 text-sm">
              <div className={cn(
                'w-4 h-4 rounded-full flex items-center justify-center',
                isMet 
                  ? 'bg-green-500 text-white' 
                  : password 
                    ? 'bg-red-500 text-white' 
                    : 'bg-muted text-muted-foreground'
              )}>
                {isMet ? (
                  <Check className="w-3 h-3" />
                ) : password ? (
                  <X className="w-3 h-3" />
                ) : null}
              </div>
              <span className={cn(
                isMet && 'text-green-400',
                !isMet && password && !isOptional && 'text-red-400',
                !password && 'text-muted-foreground',
                isOptional && !isMet && 'text-muted-foreground'
              )}>
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};