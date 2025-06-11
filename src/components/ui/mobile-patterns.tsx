
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  onBack,
  onClose,
  rightAction,
  className
}) => {
  return (
    <div className={cn(
      "sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-9 w-9 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h1>
        </div>
        {rightAction && (
          <div className="flex-shrink-0">
            {rightAction}
          </div>
        )}
      </div>
    </div>
  );
};

interface MobileSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const MobileSection: React.FC<MobileSectionProps> = ({
  title,
  children,
  className,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div className={cn('bg-white', paddingClasses[padding], className)}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

interface MobileCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered';
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  onClick,
  className,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-sm border border-gray-100',
    bordered: 'bg-white border-2 border-gray-200'
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg transition-all',
        variantClasses[variant],
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileTouchTargetProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MobileTouchTarget: React.FC<MobileTouchTargetProps> = ({
  children,
  onClick,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'min-h-[40px] min-w-[40px]',
    md: 'min-h-[44px] min-w-[44px]',
    lg: 'min-h-[48px] min-w-[48px]'
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-center transition-all',
        sizeClasses[size],
        onClick && 'cursor-pointer hover:bg-gray-50 active:bg-gray-100 rounded-lg',
        className
      )}
    >
      {children}
    </div>
  );
};
