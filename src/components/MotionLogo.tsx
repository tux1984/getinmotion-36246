
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
  
  // Use available logo files from the uploads directory
  const logoSrc = shouldUseLightLogo 
    ? "/lovable-uploads/aad610ec-9f67-4ed0-93dc-8c2b3e8f98d3.png" // Logo for dark backgrounds
    : "/lovable-uploads/c131a30d-0ce5-4b65-ae3c-5715f73e4f4c.png"; // Logo for light backgrounds
  
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
