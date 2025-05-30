import React, { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { WaitlistTable } from '@/components/admin/WaitlistTable';
import { UserManagement } from '@/components/admin/UserManagement';
import { ImageManager } from '@/components/admin/ImageManager';
import { CompanyDocuments } from '@/components/admin/CompanyDocuments';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SupabaseStatus } from '@/components/waitlist/SupabaseStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

const Admin = () => {
  const [waitlistData, setWaitlistData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { toast } = useToast();
  const { user, session, signOut } = useAuth();
  
  // Check admin status when user changes
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAuth(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          toast({
            title: 'Error de autorización',
            description: 'No se pudo verificar el estado de administrador.',
            variant: 'destructive',
          });
        } else {
          setIsAdmin(data || false);
          if (!data) {
            toast({
              title: 'Acceso denegado',
              description: 'No tienes permisos de administrador.',
              variant: 'destructive',
            });
          }
        }
      } catch (error) {
        console.error('Exception checking admin status:', error);
        setIsAdmin(false);
        toast({
          title: 'Error',
          description: 'Error al verificar permisos de administrador.',
          variant: 'destructive',
        });
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminStatus();
  }, [user, toast]);
  
  // Load waitlist data when authenticated as admin
  useEffect(() => {
    if (isAdmin && user) {
      fetchWaitlistData();
    }
  }, [isAdmin, user]);
  
  const fetchWaitlistData = async () => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    
    try {
      console.log('Fetching waitlist using Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('get-waitlist', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      
      if (error) {
        console.error('Function error:', error);
        throw error;
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      console.log('Waitlist fetched successfully:', data?.waitlist?.length);
      setWaitlistData(data?.waitlist || []);
    } catch (error) {
      console.error('Error fetching waitlist data:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos de la lista de espera.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    setIsAdmin(false);
  };
  
  const handleRefresh = () => {
    if (isAdmin) {
      fetchWaitlistData();
    }
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-white">
        <AdminHeader onLogout={handleLogout} isAuthenticated={false} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto mt-16">
            <AdminLogin />
            <div className="mt-4">
              <SupabaseStatus />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-white">
        <AdminHeader onLogout={handleLogout} isAuthenticated={true} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto mt-16 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Acceso Denegado</h2>
            <p className="text-indigo-200 mb-6">No tienes permisos de administrador para acceder a esta página.</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-white">
      <AdminHeader onLogout={handleLogout} isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-indigo-900/40 rounded-xl border border-indigo-800/30 p-6">
            <SupabaseStatus />
          </div>
          
          <Tabs defaultValue="waitlist" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-indigo-900/50">
              <TabsTrigger 
                value="waitlist"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
              >
                Lista de Espera
              </TabsTrigger>
              <TabsTrigger 
                value="users"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
              >
                Gestión de Usuarios
              </TabsTrigger>
              <TabsTrigger 
                value="images"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
              >
                Gestión de Imágenes
              </TabsTrigger>
              <TabsTrigger 
                value="documents"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
              >
                Documentos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="waitlist" className="mt-6">
              <div className="bg-indigo-900/40 rounded-xl border border-indigo-800/30 p-6">
                <WaitlistTable 
                  data={waitlistData} 
                  isLoading={isLoading} 
                  onRefresh={handleRefresh} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <ImageManager />
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <div className="bg-indigo-900/40 rounded-xl border border-indigo-800/30 p-6">
                <CompanyDocuments />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
