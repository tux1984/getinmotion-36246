import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, UserPlus, Users, Mail, AlertTriangle } from 'lucide-react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { safeSupabase } from '@/utils/supabase-safe';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export const SecureUserManagement: React.FC = () => {
  const { user } = useRobustAuth();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Cargar usuarios admin
  const loadAdminUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await safeSupabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  // Crear nuevo usuario admin
  const createAdminUser = async () => {
    if (!newUserEmail.trim()) {
      toast.error('Email es requerido');
      return;
    }

    if (!user?.email) {
      toast.error('Usuario no autorizado');
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await safeSupabase
        .rpc('create_secure_admin_user', {
          user_email: newUserEmail.trim().toLowerCase(),
          invited_by_admin_email: user.email
        });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; message?: string };

      if (result.success) {
        toast.success(result.message || 'Usuario creado exitosamente');
        setNewUserEmail('');
        await loadAdminUsers();
      } else {
        toast.error(result.error || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast.error('Error al crear usuario admin');
    } finally {
      setIsCreating(false);
    }
  };

  // Desactivar usuario
  const deactivateUser = async (userId: string) => {
    try {
      const { error } = await safeSupabase
        .from('admin_users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuario desactivado');
      await loadAdminUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Error al desactivar usuario');
    }
  };

  // Activar usuario
  const activateUser = async (userId: string) => {
    try {
      const { error } = await safeSupabase
        .from('admin_users')
        .update({ is_active: true })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuario activado');
      await loadAdminUsers();
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('Error al activar usuario');
    }
  };

  const activeUsers = adminUsers.filter(u => u.is_active);
  const inactiveUsers = adminUsers.filter(u => !u.is_active);
  const currentUserEmail = user?.email;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Gestión Segura de Usuarios</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-green-700">{activeUsers.length}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-orange-600">Usuarios Inactivos</p>
                <p className="text-2xl font-bold text-orange-700">{inactiveUsers.length}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Mail className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-blue-700">{adminUsers.length}</p>
              </div>
            </div>
          </div>

          {/* Crear nuevo usuario */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <UserPlus className="h-4 w-4" />
                <span>Invitar Nuevo Administrador</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="email">Email del nuevo administrador</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="admin@empresa.com"
                    disabled={isCreating}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={createAdminUser}
                    disabled={isCreating || !newUserEmail.trim()}
                  >
                    {isCreating ? 'Creando...' : 'Invitar'}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Se creará un nuevo usuario administrador con permisos completos del sistema.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Usuarios Activos ({activeUsers.length})</TabsTrigger>
          <TabsTrigger value="inactive">Usuarios Inactivos ({inactiveUsers.length})</TabsTrigger>
          <TabsTrigger value="all">Todos los Usuarios ({adminUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            activeUsers.map(adminUser => (
              <UserCard 
                key={adminUser.id} 
                user={adminUser} 
                isCurrentUser={adminUser.email === currentUserEmail}
                onDeactivate={deactivateUser}
                onActivate={activateUser}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {inactiveUsers.map(adminUser => (
            <UserCard 
              key={adminUser.id} 
              user={adminUser} 
              isCurrentUser={adminUser.email === currentUserEmail}
              onDeactivate={deactivateUser}
              onActivate={activateUser}
            />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {adminUsers.map(adminUser => (
            <UserCard 
              key={adminUser.id} 
              user={adminUser} 
              isCurrentUser={adminUser.email === currentUserEmail}
              onDeactivate={deactivateUser}
              onActivate={activateUser}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const UserCard: React.FC<{
  user: AdminUser;
  isCurrentUser: boolean;
  onDeactivate: (id: string) => void;
  onActivate: (id: string) => void;
}> = ({ user, isCurrentUser, onDeactivate, onActivate }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{user.email}</h4>
                {isCurrentUser && (
                  <Badge variant="secondary">Tu cuenta</Badge>
                )}
                {user.is_active ? (
                  <Badge className="bg-green-100 text-green-800">Activo</Badge>
                ) : (
                  <Badge variant="destructive">Inactivo</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Creado: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            {user.is_active ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeactivate(user.id)}
                disabled={isCurrentUser}
              >
                Desactivar
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onActivate(user.id)}
              >
                Activar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};