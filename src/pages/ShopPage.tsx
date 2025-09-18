import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// import { Header } from '@/components/layout/Header';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CategoryFilters } from '@/types/category';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/contexts/ShoppingCartContext';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, Heart, Eye, Star, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  images: any;
  category_id?: string;
  inventory: number;
  active: boolean;
  featured: boolean;
  shop_id: string;
  created_at: string;
}

export const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getCategoryBySlug } = useCategories();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CategoryFilters>({
    sortBy: 'newest',
  });

  // Get category from URL
  const categorySlug = searchParams.get('category');
  const selectedCategory = categorySlug ? getCategoryBySlug(categorySlug) : null;

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('active', true);

      // Apply category filter
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory.id);
      }

      // Apply price range filter
      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange.min)
          .lte('price', filters.priceRange.max);
      }

      // Apply stock filter
      if (filters.inStock) {
        query = query.gt('inventory', 0);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (product.inventory <= 0) {
      toast.error('Producto sin stock');
      return;
    }

    try {
      await addToCart(product.id, 1, product.price);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleProductClick = (product: Product) => {
    // Navigate to product detail page - we'll need shop slug for this
    navigate(`/producto/shop/${product.id}`);
  };

  const clearFilters = () => {
    setFilters({ sortBy: 'newest' });
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, filters]);

  return (
    <>
      <Helmet>
        <title>
          {selectedCategory 
            ? `${selectedCategory.name} - Productos Artesanales` 
            : 'Tienda de Productos Artesanales'
          }
        </title>
        <meta 
          name="description" 
          content={
            selectedCategory 
              ? `Descubre ${selectedCategory.name.toLowerCase()} artesanales únicos. ${selectedCategory.description}`
              : 'Explora nuestra colección completa de productos artesanales colombianos hechos a mano.'
          }
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-subtle">
        {/* <Header /> */}
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {selectedCategory ? selectedCategory.name : 'Todos los Productos'}
            </h1>
            {selectedCategory?.description && (
              <p className="text-muted-foreground mt-2">{selectedCategory.description}</p>
            )}
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="glass-panel animate-pulse">
                      <div className="aspect-square bg-muted rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-6 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                  <p className="text-muted-foreground">
                    Intenta ajustar los filtros o explora otras categorías
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card 
                      key={product.id} 
                      className="glass-panel hover-glow group cursor-pointer transition-all duration-300"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={product.images?.[0] || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.featured && (
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 left-2"
                          >
                            Destacado
                          </Badge>
                        )}
                        {product.inventory <= 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute top-2 right-2"
                          >
                            Sin stock
                          </Badge>
                        )}
                        {product.compare_price && product.compare_price > product.price && (
                          <Badge 
                            variant="destructive" 
                            className="absolute bottom-2 left-2"
                          >
                            -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                          </Badge>
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                          <Button 
                            size="icon" 
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to wishlist functionality
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">(4.0)</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold">
                              {formatPrice(product.price)}
                            </span>
                            {product.compare_price && product.compare_price > product.price && (
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                {formatPrice(product.compare_price)}
                              </span>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            disabled={product.inventory <= 0}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Agregar
                          </Button>
                        </div>
                        
                        {product.inventory <= 5 && product.inventory > 0 && (
                          <p className="text-xs text-orange-600 mt-2">
                            ¡Solo quedan {product.inventory} unidades!
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};