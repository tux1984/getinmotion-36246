
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface AdminLoginProps {
  onLogin: (password: string) => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };
  
  return (
    <Card className="bg-indigo-900/40 border-indigo-800/30 text-white">
      <CardHeader>
        <CardTitle className="text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
          Panel de Administración
        </CardTitle>
        <CardDescription className="text-center text-indigo-200">
          Ingresa tu contraseña para acceder al panel de administración
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
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
          >
            Acceder
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
