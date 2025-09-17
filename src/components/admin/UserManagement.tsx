
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, UserCheck, UserX, RefreshCw, Shield, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateUserForm } from './CreateUserForm';

import type { Database } from '@/integrations/supabase/types';

type AdminUser = Database['public']['Tables']['admin_users']['Row'];

export const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching users using Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('get-admin-users');
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      console.log('Users fetched successfully:', data?.users?.length);
      setUsers(data?.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = () => {
    setDialogOpen(false);
    fetchUsers();
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: !currentStatus } as any)
        .eq('id', userId as any);
        
      if (error) throw error;
      
      toast({
        title: 'Estado actualizado',
        description: `Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente.`,
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del usuario.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Gestión de Usuarios Admin</CardTitle>
            <Badge variant="outline" className="ml-2">
              <Users className="w-3 h-3 mr-1" />
              {users.length}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchUsers}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Usuario Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Crear Nuevo Usuario Admin
                  </DialogTitle>
                </DialogHeader>
                <CreateUserForm 
                  onSuccess={handleUserCreated}
                  onCancel={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Cargando usuarios...
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.is_active ? "default" : "secondary"}
                      >
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                      >
                        {user.is_active ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="w-8 h-8" />
                        <p>No hay usuarios administradores creados</p>
                        <p className="text-sm">Haz clic en "Crear Usuario Admin" para añadir el primero</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
