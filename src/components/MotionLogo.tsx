
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
  
  // Set size based on prop
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto'
  };
  
  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/f8038b45-1f3e-4034-9af0-f7c1fd90dcab.png" 
        alt="Motion Logo" 
        className={`${sizeClasses[size]} filter ${shouldUseLightLogo ? 'brightness-100' : 'brightness-[0.2]'} ${shouldUseLightLogo ? 'drop-shadow-lg' : ''}`}
      />
    </Link>
  );
};
