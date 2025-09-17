import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, UserCheck, UserX, RefreshCw, Shield, Users, Store, User, Settings, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CreateUserForm } from './CreateUserForm';
import { UserClassificationModal } from './UserClassificationModal';

interface AllUser {
  id: string;
  email: string;
  full_name: string;
  user_type: 'admin' | 'shop_owner' | 'regular' | 'unclassified';
  is_active: boolean;
  created_at: string;
  last_sign_in?: string;
  shop_name?: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<AllUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [classificationModalOpen, setClassificationModalOpen] = useState(false);
  const [selectedUserForClassification, setSelectedUserForClassification] = useState<AllUser | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log('Fetching all users using get-all-users function...');
      
      const { data, error } = await supabase.functions.invoke('get-all-users');
      
      if (error) {
        throw error;
      }

      if (data?.success && data?.users) {
        console.log('Users fetched successfully:', data.users.length);
        console.log('Full user data:', data.users);
        console.log('Users breakdown:', {
          admin: data.users.filter((u: AllUser) => u.user_type === 'admin').length,
          shop_owner: data.users.filter((u: AllUser) => u.user_type === 'shop_owner').length,
          regular: data.users.filter((u: AllUser) => u.user_type === 'regular').length,
          unclassified: data.users.filter((u: AllUser) => u.user_type === 'unclassified').length
        });
        setUsers(data.users);
        console.log('Users state updated, new length:', data.users.length);
      } else {
        throw new Error('No se pudieron obtener los usuarios');
      }
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

  const handleClassifyUser = (user: AllUser) => {
    setSelectedUserForClassification(user);
    setClassificationModalOpen(true);
  };

  const handleClassificationSuccess = () => {
    setClassificationModalOpen(false);
    setSelectedUserForClassification(null);
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
      case 'unclassified':
        return <AlertTriangle className="w-4 h-4" />;
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
      case 'unclassified':
        return 'Sin Clasificar';
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
      case 'unclassified':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  const getStats = () => {
    const admin = users.filter(u => u.user_type === 'admin').length;
    const shopOwner = users.filter(u => u.user_type === 'shop_owner').length;
    const regular = users.filter(u => u.user_type === 'regular').length;
    const unclassified = users.filter(u => u.user_type === 'unclassified').length;
    return { admin, shopOwner, regular, unclassified };
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Gestión de Usuarios</CardTitle>
            <div className="flex items-center gap-2 ml-2">
              <Badge variant="outline">
                <Users className="w-3 h-3 mr-1" />
                {users.length} Total
              </Badge>
              {getStats().unclassified > 0 && (
                <Badge variant="default">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {getStats().unclassified} Sin Clasificar
                </Badge>
              )}
            </div>
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
              <DialogContent className="sm:max-w-md">
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
                      <div className="flex gap-1">
                        {user.user_type === 'unclassified' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClassifyUser(user)}
                            title="Clasificar usuario"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        ) : (
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
                        )}
                      </div>
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

      {/* Classification Modal */}
      {selectedUserForClassification && (
        <UserClassificationModal
          isOpen={classificationModalOpen}
          onClose={() => {
            setClassificationModalOpen(false);
            setSelectedUserForClassification(null);
          }}
          user={selectedUserForClassification}
          onSuccess={handleClassificationSuccess}
        />
      )}
    </Card>
  );
};