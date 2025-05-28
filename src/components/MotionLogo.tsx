
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
  
  // Use the new final logos
  const logoSrc = shouldUseLightLogo 
    ? "/lovable-uploads/83544840-d1c3-4b9f-928d-eccc7a19598d.png" // Logo invertido para fondos oscuros
    : "/lovable-uploads/77e14212-9338-4d00-861e-6e21561b333c.png"; // Logo en colores para fondos claros
  
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
