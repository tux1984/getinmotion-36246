import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, UserCheck, UserX, RefreshCw, Shield, Users, Store, User } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { UserCreationWizard } from './UserCreationWizard';

import type { Database } from '@/integrations/supabase/types';

type AdminUser = Database['public']['Tables']['admin_users']['Row'];

interface ExtendedUser extends AdminUser {
  user_type: 'admin' | 'shop_owner' | 'regular';
  full_name?: string;
  is_shop_owner?: boolean;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching all users...');
      const allUsers: ExtendedUser[] = [];
      
      // Get admin users
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!adminError && adminUsers) {
        const enrichedAdmins = adminUsers.map(user => ({
          ...user,
          user_type: 'admin' as const,
          full_name: 'Admin User'
        }));
        allUsers.push(...enrichedAdmins);
      }

      // Get shop owners from user profiles joined with artisan shops
      const { data: shopOwners, error: shopError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          full_name,
          created_at,
          updated_at
        `)
        .eq('user_type', 'shop_owner')
        .order('created_at', { ascending: false });

      if (!shopError && shopOwners) {
        const enrichedShopOwners = shopOwners.map(user => ({
          id: user.id,
          email: 'shop@example.com', // Placeholder - would need auth lookup
          is_active: true,
          created_at: user.created_at,
          updated_at: user.updated_at,
          created_by: null,
          user_type: 'shop_owner' as const,
          full_name: user.full_name || 'Shop Owner',
          is_shop_owner: true
        }));
        allUsers.push(...enrichedShopOwners);
      }

      // Get regular users
      const { data: regularUsers, error: regularError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          user_id,
          full_name,
          created_at,
          updated_at
        `)
        .eq('user_type', 'regular')
        .order('created_at', { ascending: false });

      if (!regularError && regularUsers) {
        const enrichedRegulars = regularUsers.map(user => ({
          id: user.id,
          email: 'user@example.com', // Placeholder - would need auth lookup
          is_active: true,
          created_at: user.created_at,
          updated_at: user.updated_at,
          created_by: null,
          user_type: 'regular' as const,
          full_name: user.full_name || 'Regular User'
        }));
        allUsers.push(...enrichedRegulars);
      }

      // Fallback to just admin users if no extended query worked
      if (allUsers.length === 0) {
        console.log('Fallback: Using Edge Function...');
        const { data, error } = await supabase.functions.invoke('get-admin-users');
        
        if (!error && data?.users) {
          const fallbackUsers = data.users.map((user: any) => ({
            ...user,
            user_type: 'admin' as const,
            full_name: 'Admin User'
          }));
          allUsers.push(...fallbackUsers);
        }
      }

      console.log('Users fetched successfully:', allUsers.length);
      setUsers(allUsers);
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

  const toggleUserStatus = async (userId: string, currentStatus: boolean, userType: string) => {
    try {
      if (userType === 'admin') {
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
      } else {
        toast({
          title: 'Información',
          description: 'Gestión de estado para este tipo de usuario en desarrollo.',
        });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del usuario.',
        variant: 'destructive',
      });
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'shop_owner':
        return <Store className="w-4 h-4" />;
      case 'regular':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'Administrador';
      case 'shop_owner':
        return 'Propietario de Tienda';
      case 'regular':
        return 'Usuario Regular';
      default:
        return 'Usuario';
    }
  };

  const getUserTypeBadgeVariant = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'destructive' as const;
      case 'shop_owner':
        return 'secondary' as const;
      case 'regular':
        return 'outline' as const;
      default:
        return 'outline' as const;
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
            <CardTitle className="text-xl">Gestión de Usuarios</CardTitle>
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
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <UserCreationWizard 
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getUserTypeBadgeVariant(user.user_type)}>
                        <span className="flex items-center gap-1">
                          {getUserTypeIcon(user.user_type)}
                          {getUserTypeLabel(user.user_type)}
                        </span>
                      </Badge>
                    </TableCell>
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
                        onClick={() => toggleUserStatus(user.id, user.is_active, user.user_type)}
                        title={user.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                        disabled={user.user_type !== 'admin'}
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
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="w-8 h-8" />
                        <p>No hay usuarios creados</p>
                        <p className="text-sm">Haz clic en "Crear Usuario" para añadir el primero</p>
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