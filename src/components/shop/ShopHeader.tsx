import React from 'react';
import { Button } from '@/components/ui/button';
import { MotionLogo } from '@/components/MotionLogo';
import { ArrowLeft, Package, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface ShopHeaderProps {
  title: string;
  showBackButton?: boolean;
  showUploadButton?: boolean;
  showDashboardButton?: boolean;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  title,
  showBackButton = true,
  showUploadButton = true,
  showDashboardButton = true
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 shadow-sm">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <MotionLogo size="md" />
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <span className="text-primary font-medium text-sm">{title}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          )}
          
          {showUploadButton && (
            <Link to="/productos/subir">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Cargar Producto
              </Button>
            </Link>
          )}
          
          {showDashboardButton && (
            <Link to="/dashboard">
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};