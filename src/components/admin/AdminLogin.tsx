
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const { recordFailedAttempt, recordSuccessfulLogin, isRateLimited } = useSecurityMonitoring();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting before attempting login
    if (isRateLimited(email)) {
      toast({
        title: 'Demasiados intentos',
        description: 'Has superado el límite de intentos. Espera 15 minutos antes de volver a intentar.',
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting admin login for:', email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Admin login error:', error);
        
        // Record failed attempt for security monitoring
        recordFailedAttempt(email);
        
        toast({
          title: 'Error de autenticación',
          description: error.message || 'Credenciales incorrectas',
          variant: "destructive",
        });
      } else {
        console.log('Login successful');
        
        // Record successful login
        recordSuccessfulLogin(email);
        
        toast({
          title: 'Acceso concedido',
          description: 'Bienvenido al panel de administración',
        });
      }
    } catch (error) {
      console.error('Admin login exception:', error);
      
      // Record failed attempt on exception
      recordFailedAttempt(email);
      
      toast({
        title: 'Error',
        description: 'Error al intentar iniciar sesión',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="bg-indigo-900/40 border-indigo-800/30 text-white">
      <CardHeader>
        <CardTitle className="text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
          Panel de Administración
        </CardTitle>
        <CardDescription className="text-center text-indigo-200">
          Ingresa tus credenciales de administrador
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu-email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-indigo-900/50 border-indigo-700 placeholder:text-indigo-400 text-indigo-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-indigo-900/50 border-indigo-700 placeholder:text-indigo-400 text-indigo-100"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Acceder'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
