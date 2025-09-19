import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArtisanShop, Product } from '@/types/artisan';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Phone, Mail, ExternalLink, Instagram, Facebook, ShoppingBag, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SocialShare } from '@/components/shop/SocialShare';
import { ProductRating } from '@/components/trust/ProductRating';
import { ProductSkeleton } from '@/components/shop/ProductSkeleton';
import { LazyImage } from '@/components/shop/LazyImage';
import { useWishlist } from '@/hooks/useWishlist';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export const PublicShopPage: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ArtisanShop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchShopData = async () => {
      if (!shopSlug) return;

      try {
        // Fetch shop data
        const { data: shopData, error: shopError } = await supabase
          .from('artisan_shops')
          .select('*')
          .eq('shop_slug', shopSlug)
          .eq('active', true)
          .single();

        if (shopError) {
          console.error('Error fetching shop:', shopError);
          toast.error('Tienda no encontrada');
          navigate('/tiendas');
          return;
        }

        console.log('Shop data loaded:', shopData);
        setShop(shopData);
        setLoading(false);

        // Fetch products for this shop
        setProductsLoading(true);
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopData.id)
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (productsError) {
          console.error('Error fetching products:', productsError);
          toast.error('Error al cargar productos');
        } else {
          console.log('Products loaded:', productsData?.length || 0);
          setProducts(productsData || []);
        }
        setProductsLoading(false);

      } catch (error) {
        console.error('Error in fetchShopData:', error);
        toast.error('Error al cargar la tienda');
        setLoading(false);
        setProductsLoading(false);
      }
    };

    fetchShopData();
  }, [shopSlug, navigate]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContactClick = (method: string, value: string) => {
    switch (method) {
      case 'email':
        window.open(`mailto:${value}`, '_blank');
        break;
      case 'phone':
        window.open(`tel:${value}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/[^0-9]/g, '')}`, '_blank');
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Cargando tienda...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Tienda no encontrada</h1>
            <p className="text-muted-foreground">La tienda que buscas no existe o no está disponible.</p>
            <Button onClick={() => navigate('/tiendas')}>
              Volver a las tiendas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{shop.shop_name} - Tienda Artesanal | ArteCoolombia</title>
        <meta name="description" content={`Descubre los productos artesanales únicos de ${shop.shop_name}. ${shop.description}`} />
        <meta property="og:title" content={`${shop.shop_name} - Tienda Artesanal`} />
        <meta property="og:description" content={shop.description} />
        <meta property="og:image" content={shop.logo_url || shop.banner_url} />
        <link rel="canonical" href={`${window.location.origin}/tienda/${shop.shop_slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs 
            items={[
              { label: 'Inicio', path: '/' },
              { label: 'Tiendas', path: '/tiendas' },
              { label: shop.shop_name }
            ]}
          />
        </div>

        {/* Professional Hero Section */}
        <div className="bg-primary text-white py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6 mb-8">
              {shop.logo_url && (
                <LazyImage
                  src={shop.logo_url} 
                  alt={`Logo de ${shop.shop_name}`}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-white/20"
                  fallback={<ShoppingBag className="w-12 h-12 text-white/60" />}
                />
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">{shop.shop_name}</h1>
                <p className="text-primary-foreground/80 text-lg">
                  {shop.craft_type?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {shop.region && ` • ${shop.region.replace(/_/g, ' ')}`}
                </p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-2">🎨 Productos Artesanales Únicos</h2>
              <p className="text-primary-foreground/90">
                Descubre nuestra colección de productos hechos a mano con dedicación y amor por el arte tradicional.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Products Section - Main Content */}
            <div className="lg:col-span-3">
              {/* About Section */}
              {shop.description && (
                <Card className="mb-8 border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      Sobre {shop.shop_name}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">{shop.description}</p>
                    {shop.story && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-3 text-foreground">Nuestra Historia</h3>
                        <p className="text-muted-foreground leading-relaxed">{shop.story}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Products Grid */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Productos ({products.length})
                </h2>
              </div>

              {productsLoading ? (
                <ProductSkeleton count={8} />
              ) : products.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-muted-foreground/40" />
                    <h3 className="text-xl font-semibold mb-2">Productos en preparación</h3>
                    <p className="text-muted-foreground">Pronto tendremos hermosas creaciones artesanales disponibles</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card 
                      key={product.id}
                      className="group cursor-pointer border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-card"
                      onClick={() => navigate(`/tienda/${shop.shop_slug}/producto/${product.id}`)}
                    >
                      <CardContent className="p-0">
                        {/* Product Image */}
                        <div className="relative aspect-square bg-muted/20 overflow-hidden rounded-t-lg">
                          {(product.images as any)?.[0] ? (
                            <LazyImage
                              src={(product.images as any)[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              fallback={<ShoppingBag className="w-12 h-12 text-muted-foreground/40" />}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
                            </div>
                          )}
                          
                          {/* Wishlist button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className={`absolute top-3 right-3 bg-background/80 backdrop-blur-sm border-0 shadow-sm transition-all duration-300 hover:scale-110 ${
                              isInWishlist(product.id) ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id);
                            }}
                          >
                            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                          </Button>

                          {product.featured && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-primary text-primary-foreground">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Destacado
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          
                          {/* Product rating */}
                          <div className="mb-3">
                            <ProductRating 
                              productId={product.id} 
                              size="sm"
                              showCount={true}
                            />
                          </div>
                          
                          {product.short_description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {product.short_description}
                            </p>
                          )}

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-lg font-bold text-primary">
                                {formatPrice(product.price)}
                              </span>
                              {product.compare_price && product.compare_price > product.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(product.compare_price)}
                                </span>
                              )}
                            </div>
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Contactar Artesano</h3>
                    <div className="space-y-3">
                      {shop.contact_info?.email && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleContactClick('email', shop.contact_info.email)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                      )}
                      {shop.contact_info?.phone && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleContactClick('phone', shop.contact_info.phone)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Teléfono
                        </Button>
                      )}
                      {shop.contact_info?.whatsapp && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleContactClick('whatsapp', shop.contact_info.whatsapp)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                {(shop.social_links?.instagram || shop.social_links?.facebook || shop.social_links?.website) && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4">Redes Sociales</h3>
                      <div className="space-y-3">
                        {shop.social_links?.instagram && (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => window.open(shop.social_links.instagram, '_blank')}
                          >
                            <Instagram className="w-4 h-4 mr-2" />
                            Instagram
                          </Button>
                        )}
                        {shop.social_links?.facebook && (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => window.open(shop.social_links.facebook, '_blank')}
                          >
                            <Facebook className="w-4 h-4 mr-2" />
                            Facebook
                          </Button>
                        )}
                        {shop.social_links?.website && (
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => window.open(shop.social_links.website, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Sitio Web
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Certifications */}
                {shop.certifications && shop.certifications.length > 0 && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4">Certificaciones</h3>
                      <div className="space-y-2">
                        {shop.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="w-full justify-center py-2">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};