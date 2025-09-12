import { useState, useEffect } from 'react';
import { safeSupabase } from '@/utils/supabase-safe';
import { Product } from '@/types/artisan';
import { useToast } from '@/components/ui/use-toast';

export const useProducts = (shopId?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    if (!shopId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await safeSupabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data as any || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: any) => {
    if (!shopId) throw new Error('Shop ID required');

    try {
      setLoading(true);

      const { data, error } = await safeSupabase
        .from('products')
        .insert({
          ...productData,
          shop_id: shopId,
        })
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [data as any, ...prev]);
      toast({
        title: "¡Producto creado!",
        description: "Tu producto ha sido agregado al catálogo.",
      });

      return data;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo crear el producto. Inténtalo de nuevo.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, updates: any) => {
    try {
      setLoading(true);

      const { data, error } = await safeSupabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .eq('shop_id', shopId)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? (data as any) : product
        )
      );

      toast({
        title: "Producto actualizado",
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

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);

      const { error } = await safeSupabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('shop_id', shopId);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== productId));
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del catálogo.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [shopId]);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };
};