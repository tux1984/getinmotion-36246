import { useState, useEffect } from 'react';
import { useRobustAuth } from '@/hooks/useRobustAuth';
import { ArtisanShop } from '@/types/artisan';
import { useToast } from '@/components/ui/use-toast';
import { db } from '@/types/supabase-overrides';

export const useArtisanShop = () => {
  const [shop, setShop] = useState<ArtisanShop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useRobustAuth();
  const { toast } = useToast();

  const fetchShop = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await db.selectSingle('artisan_shops', '*', { user_id: user.id });

      if (error) {
        throw error;
      }

      setShop(data || null);
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
        const { data } = await db.selectSingle('artisan_shops', 'id', { shop_slug: slug });
        if (!data) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const { data, error } = await db.insert('artisan_shops', {
        ...shopData,
        user_id: user.id,
        shop_slug: slug,
      });

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

      const { data, error } = await db.update('artisan_shops', updates, {
        id: shop.id,
        user_id: user.id
      });

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