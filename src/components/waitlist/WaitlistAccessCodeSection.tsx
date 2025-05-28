
import React from 'react';
import { KeyRound, CheckCircle } from 'lucide-react';
import { TextField } from './FormField';

interface WaitlistAccessCodeSectionProps {
  accessCode: string;
  codeValidated: boolean;
  language: 'en' | 'es';
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const WaitlistAccessCodeSection: React.FC<WaitlistAccessCodeSectionProps> = ({
  accessCode,
  codeValidated,
  language,
  onInputChange
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 opacity-20 blur-sm rounded-lg"></div>
      <div className="relative p-4 border border-pink-200 rounded-lg bg-white/80">
        <div className="flex items-start space-x-3">
          <KeyRound className="h-5 w-5 text-pink-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              {language === 'en' ? 'Have an access code?' : '¿Tienes un código de acceso?'}
            </h4>
            <TextField
              id="accessCode"
              name="accessCode"
              label={language === 'en' ? 'Access Code' : 'Código de Acceso'}
              value={accessCode || ''}
              onChange={onInputChange}
              placeholder={language === 'en' ? 'Enter your code' : 'Ingresa tu código'}
            />
            {codeValidated && (
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                {language === 'en' ? 'Valid code!' : '¡Código válido!'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
