
import React from 'react';
import { Button } from '@/components/ui/button';
import { MotionLogo } from '@/components/MotionLogo';
import { LogOut, Database } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

export const AdminHeader = ({ onLogout, isAuthenticated }: AdminHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-indigo-950/80 border-b border-indigo-800/30 shadow-md">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <MotionLogo />
          <div className="bg-pink-500/20 px-3 py-1 rounded-full flex items-center gap-1">
            <Database size={16} />
            <span className="text-pink-200 font-medium text-sm">Admin Panel</span>
          </div>
        </div>
        
        {isAuthenticated && (
          <Button 
            variant="ghost"
            onClick={onLogout}
            className="text-indigo-200 hover:text-white hover:bg-indigo-800/50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        )}
      </div>
    </header>
  );
};
