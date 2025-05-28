
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

interface MotionLogoProps {
  variant?: 'auto' | 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MotionLogo: React.FC<MotionLogoProps> = ({ 
  variant = 'auto', 
  className = '',
  size = 'md'
}) => {
  // This hook will determine if we're on a dark or light background
  const { isDark } = useTheme();
  
  // Determine which logo to show based on variant and theme
  const shouldUseLightLogo = variant === 'light' || (variant === 'auto' && isDark);
  
  // Use the correct logo files provided by the user
  const logoSrc = shouldUseLightLogo 
    ? "/lovable-uploads/c6c643f0-5964-45a6-aa39-10286d505435.png" // Logo para fondos oscuros
    : "/lovable-uploads/98f35650-02b1-4578-9248-60db60c6688d.png"; // Logo para fondos claros
  
  // Set size based on prop
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto'
  };
  
  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img 
        src={logoSrc}
        alt="Get in Motion Logo" 
        className={`${sizeClasses[size]}`}
      />
    </Link>
  );
};
