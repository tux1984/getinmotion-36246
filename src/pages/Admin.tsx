import React, { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { WaitlistTable } from '@/components/admin/WaitlistTable';
import { UserManagement } from '@/components/admin/UserManagement';
import { EmergencySessionReset } from '@/components/admin/EmergencySessionReset';
import { SessionDiagnostics } from '@/components/admin/SessionDiagnostics';
import { SessionSyncManager } from '@/components/admin/SessionSyncManager';
import { ImageManager } from '@/components/admin/ImageManager';
import { CompanyDocuments } from '@/components/admin/CompanyDocuments';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SupabaseStatus } from '@/components/waitlist/SupabaseStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { SiteImageManager } from '@/components/admin/SiteImageManager';

const Admin = () => {
  const [waitlistData, setWaitlistData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, session, signOut } = useRobustAuth();
  
  // Load waitlist data when user is available
  useEffect(() => {
    if (user && session) {
      console.log('User is available, fetching waitlist data');
      fetchWaitlistData();
    }
  }, [user, session]);
  
  const fetchWaitlistData = async () => {
    if (!session) {
      console.log('No session, skipping fetch');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Fetching waitlist data...');
      
      // Try direct query first
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Direct query error:', error);
        
        // Fallback to edge function
        const { data: functionData, error: functionError } = await supabase.functions.invoke('get-waitlist', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        if (functionError) {
          console.error('Function error:', functionError);
          throw functionError;
        }
        
        if (functionData?.error) {
          throw new Error(functionData.error);
        }
        
        console.log('Waitlist fetched via function:', functionData?.waitlist?.length);
        setWaitlistData(functionData?.waitlist || []);
      } else {
        console.log('Waitlist fetched directly:', data?.length);
        setWaitlistData(data || []);
      }
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
  };
  
  const handleRefresh = () => {
    fetchWaitlistData();
  };

  // Admin component is now protected by BypassProtectedRoute
  // No need for additional authorization checks here
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-white">
      <AdminHeader onLogout={handleLogout} isAuthenticated={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-indigo-900/40 rounded-xl border border-indigo-800/30 p-6">
            <SupabaseStatus />
          </div>
          
          <Tabs defaultValue="waitlist" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-indigo-900/50">
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
                Galería de Imágenes
              </TabsTrigger>
              <TabsTrigger 
                value="site-images"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
              >
                Imágenes del Sitio
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
              <div className="space-y-4">
                <SessionSyncManager />
                <SessionDiagnostics />
                <EmergencySessionReset />
                <UserManagement />
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-6">
              <ImageManager />
            </TabsContent>
            
            <TabsContent value="site-images" className="mt-6">
              <SiteImageManager />
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
