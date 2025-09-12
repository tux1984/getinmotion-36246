import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, LogOut, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const EmergencySessionReset = () => {
  const { toast } = useToast();

  const handleCompleteReset = async () => {
    try {
      console.log('🚨 EMERGENCY: Starting complete session reset...');
      
      // 1. Sign out completely
      await supabase.auth.signOut();
      
      // 2. Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Clear cookies if possible
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      toast({
        title: "✅ Reset completado",
        description: "Redirigiendo al login...",
        variant: "default"
      });
      
      // 4. Force page reload after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      
    } catch (error) {
      console.error('❌ Reset failed:', error);
      toast({
        title: "❌ Error en reset",
        description: "Recarga la página manualmente",
        variant: "destructive"
      });
    }
  };

  const handleQuickLogin = () => {
    window.location.href = '/login';
  };

  return (
    <Card className="border-red-600 bg-red-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="h-5 w-5" />
          Sistema de Emergencia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-red-300">
          La sesión está desincronizada. auth.uid() retorna null mientras hay sesión cliente.
        </p>
        
        <div className="flex gap-2">
          <Button
            onClick={handleQuickLogin}
            variant="outline"
            className="border-yellow-600 text-yellow-200 hover:bg-yellow-900/20"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Ir a Login
          </Button>
          
          <Button
            onClick={handleCompleteReset}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Completo
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Quick Login: navega al login sin limpiar datos</p>
          <p>• Reset Completo: limpia todo y fuerza nueva autenticación</p>
        </div>
      </CardContent>
    </Card>
  );
};