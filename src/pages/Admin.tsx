
import React, { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { WaitlistTable } from '@/components/admin/WaitlistTable';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { supabaseClient } from '@/lib/supabase-client';
import { useToast } from '@/components/ui/use-toast';
import { SupabaseStatus } from '@/components/waitlist/SupabaseStatus';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [waitlistData, setWaitlistData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Check if there's a saved admin token
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken === 'motion-admin-2025') {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Load waitlist data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWaitlistData();
    }
  }, [isAuthenticated]);
  
  const fetchWaitlistData = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabaseClient
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setWaitlistData(data || []);
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
  
  const handleLogin = (password: string) => {
    // Simple password verification - consider using a more secure method in production
    if (password === 'motionadmin2025') {
      localStorage.setItem('adminToken', 'motion-admin-2025');
      setIsAuthenticated(true);
      toast({
        title: 'Acceso concedido',
        description: 'Bienvenido al panel de administración.',
      });
    } else {
      toast({
        title: 'Acceso denegado',
        description: 'Contraseña incorrecta.',
        variant: 'destructive',
      });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };
  
  const handleRefresh = () => {
    fetchWaitlistData();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-white">
      <AdminHeader onLogout={handleLogout} isAuthenticated={isAuthenticated} />
      
      <div className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto mt-16">
            <AdminLogin onLogin={handleLogin} />
            <div className="mt-4">
              <SupabaseStatus />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-indigo-900/40 rounded-xl border border-indigo-800/30 p-6">
              <SupabaseStatus />
            </div>
            
            <div className="bg-indigo-900/40 rounded-xl border border-indigo-800/30 p-6">
              <WaitlistTable 
                data={waitlistData} 
                isLoading={isLoading} 
                onRefresh={handleRefresh} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
