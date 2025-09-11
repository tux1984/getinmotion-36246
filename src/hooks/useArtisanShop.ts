import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ArtisanShop } from '@/types/artisan';
import { useToast } from '@/components/ui/use-toast';

export const useArtisanShop = () => {
  const [shop, setShop] = useState<ArtisanShop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchShop = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('artisan_shops')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setShop(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching artisan shop:', err);
    } finally {
      setLoading(false);
    }
  };

  const createShop = async (shopData: any) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      
      // Generate unique slug
      const baseSlug = shopData.shop_name?.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'tienda';
      
      let slug = baseSlug;
      let counter = 1;
      
      // Check if slug exists
      while (true) {
        const { data } = await supabase
          .from('artisan_shops')
          .select('id')
          .eq('shop_slug', slug)
          .single();
        
        if (!data) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const { data, error } = await supabase
        .from('artisan_shops')
        .insert({
          ...shopData,
          user_id: user.id,
          shop_slug: slug,
        })
        .select()
        .single();

      if (error) throw error;

      setShop(data);
      toast({
        title: "¡Tienda creada!",
        description: "Tu tienda digital ha sido creada exitosamente.",
      });

      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo crear la tienda. Inténtalo de nuevo.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateShop = async (updates: any) => {
    if (!shop || !user) throw new Error('Shop or user not found');

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('artisan_shops')
        .update(updates)
        .eq('id', shop.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setShop(data);
      toast({
        title: "Tienda actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });

      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, [user]);

  return {
    shop,
    loading,
    error,
    createShop,
    updateShop,
    refreshShop: fetchShop,
  };
};