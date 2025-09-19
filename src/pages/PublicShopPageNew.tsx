import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { LazyImage } from '@/components/shop/LazyImage';
import { ProductRating } from '@/components/trust/ProductRating';
import { Heart, Star, ArrowLeft, ShoppingCart, Verified, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PublicShopPageNew() {
  const { shopSlug } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        console.log('🚀 FETCHING SHOP DATA:', shopSlug);
        
        // Fetch shop data
        const { data: shopData, error: shopError } = await supabase
          .from('artisan_shops')
          .select('*')
          .eq('shop_slug', shopSlug)
          .single();

        if (shopError) {
          console.error('❌ Shop error:', shopError);
          return;
        }

        console.log('✅ SHOP DATA:', shopData);
        setShop(shopData);

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopData.id);

        if (productsError) {
          console.error('❌ Products error:', productsError);
          return;
        }

        console.log('✅ PRODUCTS DATA:', productsData);
        setProducts(productsData || []);
      } catch (error) {
        console.error('❌ FETCH ERROR:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shopSlug) {
      fetchShopData();
    }
  }, [shopSlug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">🔄 CARGANDO NUEVA VERSIÓN...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-red-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">❌ TIENDA NO ENCONTRADA</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Helmet>
        <title>{shop.shop_name} - Tienda Artesanal</title>
        <meta name="description" content={shop.description} />
      </Helmet>

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/tiendas')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Tiendas
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {shop.logo_url && (
                  <LazyImage
                    src={shop.logo_url}
                    alt={`Logo de ${shop.shop_name}`}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                )}
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {shop.shop_name}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Artesanías {shop.craft_type}
                  </p>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {shop.description}
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Verified className="h-5 w-5 text-green-500" />
                  Artesano Verificado
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-5 w-5 text-blue-500" />
                  Envío Nacional
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Compra Segura
                </div>
              </div>
            </div>
            
            <div className="lg:text-right">
              <div className="inline-block bg-primary/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  ¡Productos Únicos y Auténticos!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Descubre nuestra colección de artesanías hechas a mano con amor y tradición.
                </p>
                <Button size="lg" className="gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Explorar Productos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nuestros Productos
            </h2>
            <p className="text-lg text-muted-foreground">
              Cada pieza cuenta una historia única
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Esta tienda aún no tiene productos disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border-0 shadow-md"
                  onClick={() => navigate(`/tienda/${shop.shop_slug}/producto/${product.id}`)}
                >
                  <div className="aspect-square overflow-hidden">
                    <LazyImage
                      src={product.images?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <ProductRating 
                      productId={product.id} 
                      size="sm" 
                      showCount={false}
                    />
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('❤️ Wishlist clicked for:', product.name);
                        }}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SHOP STORY SECTION */}
      {shop.story && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Nuestra Historia
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {shop.story}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}