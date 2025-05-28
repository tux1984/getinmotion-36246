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
  
  // Use the correct logo files that are available in the uploads directory
  const logoSrc = shouldUseLightLogo 
    ? "/lovable-uploads/aad610ec-9f67-4ed0-93dc-8c2b3e8f98d3.png" // Logo invertido para fondos oscuros
    : "/lovable-uploads/c131a30d-0ce5-4b65-ae3c-5715f73e4f4c.png"; // Logo en colores para fondos claros
  
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
