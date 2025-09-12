import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, UserCheck, UserX, RefreshCw, Edit, Trash2, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useSessionHealth } from '@/hooks/useSessionHealth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import type { Database } from '@/integrations/supabase/types';

type AdminUser = Database['public']['Tables']['admin_users']['Row'];

// Security validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password);
};

const sanitizeInput = (input: string): string => {
  return input.trim().toLowerCase().replace(/[<>\"']/g, '');
};

export const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{email?: string; password?: string}>({});
  const { toast } = useToast();
  const { isSessionHealthy, isChecking, checkSessionHealth, forceSessionRefresh } = useSessionHealth();

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

  const validateForm = (): boolean => {
    const errors: {email?: string; password?: string} = {};
    
    if (!newUserEmail) {
      errors.email = 'Email es requerido';
    } else if (!validateEmail(newUserEmail)) {
      errors.email = 'Email inválido';
    }
    
    if (!newUserPassword) {
      errors.password = 'Contraseña es requerida';
    } else if (!validatePassword(newUserPassword)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula y número';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = (): boolean => {
    const errors: {email?: string; password?: string} = {};
    
    if (!editUserEmail) {
      errors.email = 'Email es requerido';
    } else if (!validateEmail(editUserEmail)) {
      errors.email = 'Email inválido';
    }
    
    if (editUserPassword && !validatePassword(editUserPassword)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula y número';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsCreating(true);
    
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        attempt++;
        console.log(`🔄 Intento ${attempt}/${maxRetries} - Creating admin user:`, newUserEmail);
        
        // Force session refresh to ensure token is valid
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('📋 Session check:', { 
          hasSession: !!session, 
          hasToken: !!session?.access_token,
          userId: session?.user?.id,
          email: session?.user?.email,
          sessionError
        });
        
        if (sessionError || !session?.access_token) {
          console.log('🔄 Refreshing session...');
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshData.session?.access_token) {
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          }
          console.log('✅ Session refreshed successfully');
        }

        const currentSession = session || (await supabase.auth.getSession()).data.session;
        if (!currentSession?.access_token) {
          throw new Error('No se pudo obtener token de autenticación');
        }

        console.log('🔑 Calling edge function with valid token...');
        
        const { data, error } = await supabase.functions.invoke('create-admin-user', {
          body: {
            email: sanitizeInput(newUserEmail),
            password: newUserPassword
          },
          headers: {
            Authorization: `Bearer ${currentSession.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('📥 Edge function response:', { data, error });
        
        if (error) {
          // Check if it's a network/connection error that might be retryable
          if (error.message?.includes('503') || error.message?.includes('network') || error.message?.includes('fetch')) {
            if (attempt < maxRetries) {
              console.log(`⚠️ Retryable error on attempt ${attempt}, retrying in 2s...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
          }
          console.error('❌ Edge function error:', error);
          throw new Error(`Error de conexión: ${error.message || 'Servicio no disponible'}`);
        }
        
        if (data?.error) {
          console.error('❌ Function returned error:', data.error);
          throw new Error(data.error);
        }
        
        console.log('✅ Usuario creado exitosamente');
        toast({
          title: 'Usuario creado',
          description: `Usuario ${newUserEmail} creado exitosamente.`,
        });
        
        setNewUserEmail('');
        setNewUserPassword('');
        setValidationErrors({});
        setDialogOpen(false);
        fetchUsers();
        return; // Success - exit retry loop
        
      } catch (error: any) {
        console.error(`❌ Error en intento ${attempt}:`, error);
        
        if (attempt >= maxRetries) {
          // Final attempt failed
          toast({
            title: 'Error',
            description: error.message || 'Error al crear usuario después de varios intentos',
            variant: 'destructive',
          });
        } else {
          // Will retry
          console.log(`⏱️ Esperando antes del siguiente intento...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    setIsCreating(false);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setEditUserEmail(user.email);
    setEditUserPassword('');
    setEditDialogOpen(true);
    setValidationErrors({});
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEditForm() || !editingUser) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const sanitizedEmail = sanitizeInput(editUserEmail);
      
      const updateData: any = {
        userId: editingUser.id,
        email: sanitizedEmail
      };

      if (editUserPassword) {
        updateData.password = editUserPassword;
      }

      const { data, error } = await supabase.functions.invoke('update-admin-user', {
        body: updateData
      });
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      toast({
        title: 'Usuario actualizado',
        description: `Usuario ${sanitizedEmail} actualizado exitosamente.`,
      });
      
      setEditUserEmail('');
      setEditUserPassword('');
      setValidationErrors({});
      setEditDialogOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar el usuario.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    setIsDeletingUser(user.id);
    
    try {
      const { data, error } = await supabase.functions.invoke('delete-admin-user', {
        body: {
          userId: user.id
        }
      });
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      toast({
        title: 'Usuario eliminado',
        description: `Usuario ${user.email} eliminado exitosamente.`,
      });
      
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el usuario.',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingUser(null);
    }
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
    <Card className="bg-indigo-900/40 border-indigo-800/30 text-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
              Gestión de Usuarios
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                variant={isSessionHealthy ? "default" : "destructive"}
                className={`${isSessionHealthy ? 'bg-green-600' : 'bg-red-600'} text-white`}
              >
                {isSessionHealthy ? (
                  <><Wifi className="h-3 w-3 mr-1" /> Conectado</>
                ) : (
                  <><WifiOff className="h-3 w-3 mr-1" /> Desconectado</>
                )}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={forceSessionRefresh}
                disabled={isChecking}
                className="border-indigo-600 text-indigo-100 hover:bg-indigo-800/50"
                title="Renovar sesión"
              >
                <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchUsers}
              variant="outline"
              size="sm"
              disabled={loading}
              className="border-indigo-600 text-indigo-100 hover:bg-indigo-800/50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-indigo-900 border-indigo-700 text-white">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => {
                        setNewUserEmail(e.target.value);
                        if (validationErrors.email) {
                          setValidationErrors(prev => ({ ...prev, email: undefined }));
                        }
                      }}
                      className="bg-indigo-800 border-indigo-600 text-white"
                      placeholder="usuario@ejemplo.com"
                      maxLength={254}
                    />
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm">{validationErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => {
                        setNewUserPassword(e.target.value);
                        if (validationErrors.password) {
                          setValidationErrors(prev => ({ ...prev, password: undefined }));
                        }
                      }}
                      className="bg-indigo-800 border-indigo-600 text-white"
                      placeholder="Mínimo 8 caracteres"
                      minLength={8}
                      maxLength={128}
                    />
                    {validationErrors.password && (
                      <p className="text-red-400 text-sm">{validationErrors.password}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creando...' : 'Crear Usuario'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Cargando usuarios...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-indigo-200">Email</TableHead>
                <TableHead className="text-indigo-200">Estado</TableHead>
                <TableHead className="text-indigo-200">Fecha Creación</TableHead>
                <TableHead className="text-indigo-200">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.is_active ? "default" : "secondary"}
                      className={user.is_active ? "bg-green-600" : "bg-gray-600"}
                    >
                      {user.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-indigo-200">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        className="border-blue-600 text-blue-100 hover:bg-blue-800/50"
                        disabled={isUpdating}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className="border-indigo-600 text-indigo-100 hover:bg-indigo-800/50"
                      >
                        {user.is_active ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-100 hover:bg-red-800/50"
                            disabled={isDeletingUser === user.id}
                          >
                            {isDeletingUser === user.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-indigo-900 border-indigo-700 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription className="text-indigo-200">
                              Esta acción eliminará permanentemente el usuario <strong>{user.email}</strong>. 
                              No se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-indigo-800 border-indigo-600 text-white hover:bg-indigo-700">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-indigo-300 py-4">
                    No hay usuarios creados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        
        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-indigo-900 border-indigo-700 text-white">
            <DialogHeader>
              <DialogTitle>Editar Usuario Administrador</DialogTitle>
              <DialogDescription className="text-indigo-200">
                Modifica la información del usuario. Deja la contraseña vacía si no quieres cambiarla.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => {
                    setEditUserEmail(e.target.value);
                    if (validationErrors.email) {
                      setValidationErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  className="bg-indigo-800 border-indigo-600 text-white"
                  placeholder="usuario@ejemplo.com"
                  maxLength={254}
                />
                {validationErrors.email && (
                  <p className="text-red-400 text-sm">{validationErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">Contraseña (opcional)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editUserPassword}
                  onChange={(e) => {
                    setEditUserPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors(prev => ({ ...prev, password: undefined }));
                    }
                  }}
                  className="bg-indigo-800 border-indigo-600 text-white"
                  placeholder="Nueva contraseña"
                  maxLength={128}
                />
                {validationErrors.password && (
                  <p className="text-red-400 text-sm">{validationErrors.password}</p>
                )}
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                  className="bg-indigo-800 border-indigo-600 text-white hover:bg-indigo-700"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};