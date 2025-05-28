import React, { useState } from 'react';
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
  const { isDark } = useTheme();
  const [imageError, setImageError] = useState(false);
  
  // Determine which logo to show based on variant and theme
  const shouldUseLightLogo = variant === 'light' || (variant === 'auto' && isDark);
  
  // Use correct logo files from the uploads directory
  const logoSrc = shouldUseLightLogo 
    ? "/lovable-uploads/a049cc5b-c8c3-463f-a2e8-eb2cfa2232db.png" // New logo for dark backgrounds
    : "/lovable-uploads/98f35650-02b1-4578-9248-60db60c6688d.png"; // Logo for light backgrounds
  
  // Set size based on prop
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto'
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Fallback text logo if image fails to load
  if (imageError) {
    return (
      <Link to="/" className={`inline-flex items-center ${className}`}>
        <span className={`font-bold ${shouldUseLightLogo ? 'text-white' : 'text-gray-900'} ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base'}`}>
          Get in Motion
        </span>
      </Link>
    );
  }
  
  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img 
        src={logoSrc}
        alt="Get in Motion Logo" 
        className={`${sizeClasses[size]}`}
        onError={handleImageError}
      />
    </Link>
  );
};
