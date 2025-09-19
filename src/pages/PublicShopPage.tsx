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
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: productsRef, isVisible: productsVisible } = useScrollAnimation({ threshold: 0.1 });

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
          toast.error('Tienda no encontrada');
          navigate('/tiendas');
          return;
        }

        setShop(shopData);

        setLoading(false);

        // Fetch products with slight delay for better UX
        setProductsLoading(true);
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopData.id)
          .eq('active', true)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (!productsError) {
          setProducts(productsData || []);
        }
        setProductsLoading(false);

        // Track shop view - simplified to avoid constraint conflicts
        try {
          const today = new Date().toISOString().split('T')[0];
          const { error } = await supabase
            .from('artisan_analytics')
            .insert({
              shop_id: shopData.id,
              date: today,
              views: 1
            });
          
          if (error && !error.message.includes('duplicate key')) {
            console.warn('Analytics tracking failed:', error);
          }
        } catch (analyticsError) {
          console.warn('Analytics tracking error:', analyticsError);
        }

      } catch (error) {
        console.error('Error fetching shop:', error);
        toast.error('Error al cargar la tienda');
      } finally {
        setLoading(false);
        setProductsLoading(false);
      }
    };

    fetchShopData();
  }, [shopSlug, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleContactClick = (method: string, value: string) => {
    if (method === 'whatsapp') {
      window.open(`https://wa.me/${value.replace(/[^0-9]/g, '')}`, '_blank');
    } else if (method === 'email') {
      window.open(`mailto:${value}`, '_blank');
    } else if (method === 'phone') {
      window.open(`tel:${value}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-subtle to-secondary/10">
        <div className="text-center animate-fade-in">
          <div className="animate-float mb-4">
            <ShoppingBag className="w-16 h-16 mx-auto text-primary/60" />
          </div>
          <div className="text-xl font-medium text-primary">Cargando tienda...</div>
          <div className="text-sm text-muted-foreground mt-2">Preparando experiencia artesanal</div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Tienda no encontrada</h1>
        <Button onClick={() => navigate('/tiendas')}>Ver todas las tiendas</Button>
      </div>
    );
  }

  const contactInfo = shop.contact_info as any || {};
  const socialLinks = shop.social_links as any || {};
  const seoData = shop.seo_data as any || {};

  return (
    <>
      <Helmet>
        <title>{seoData.title || `${shop.shop_name} - Artesanías Colombianas`}</title>
        <meta name="description" content={seoData.description || shop.description || `Descubre las hermosas artesanías de ${shop.shop_name} en ${shop.region}`} />
        <meta name="keywords" content={seoData.keywords?.join(', ') || `artesanías, ${shop.craft_type}, ${shop.region}, colombia`} />
        <meta property="og:title" content={shop.shop_name} />
        <meta property="og:description" content={shop.description || `Artesanías ${shop.craft_type} de ${shop.region}`} />
        <meta property="og:image" content={shop.banner_url || shop.logo_url} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/tienda/${shop.shop_slug}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-primary-subtle to-secondary/10">
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4 pt-6">
          <Breadcrumbs 
            items={[
              { label: 'Inicio', path: '/' },
              { label: 'Tiendas', path: '/tiendas' },
              { label: shop.shop_name }
            ]}
            className="animate-fade-in"
          />
        </div>

        {/* Enhanced Header with parallax banner */}
        <div ref={heroRef} className={`relative h-80 lg:h-96 overflow-hidden transition-all duration-1000 ${heroVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-hero"></div>
          {shop.banner_url && (
            <img 
              src={shop.banner_url} 
              alt={`Banner de ${shop.shop_name}`}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
            <div className="flex items-end gap-8 w-full">
              {shop.logo_url && (
                <div className="relative group">
                  <LazyImage
                    src={shop.logo_url} 
                    alt={`Logo de ${shop.shop_name}`}
                    className="w-28 h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-glow object-cover group-hover:scale-105 transition-transform duration-300"
                    fallback={<ShoppingBag className="w-16 h-16 text-white/60" />}
                  />
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
              <div className="text-white flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                    {shop.shop_name}
                  </h1>
                  <SocialShare 
                    url={`/tienda/${shop.shop_slug}`}
                    title={shop.shop_name}
                    description={shop.description}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  />
                </div>
                <div className="flex items-center gap-6 text-white/90 flex-wrap">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
                    {shop.craft_type?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  {shop.region && (
                    <div className="flex items-center gap-2 text-lg">
                      <MapPin className="w-5 h-5" />
                      <span className="capitalize">{shop.region.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {shop.featured && (
                    <Badge className="bg-gradient-accent text-white border-0 animate-glow-pulse px-4 py-2">
                      <Star className="w-4 h-4 mr-2 fill-current" />
                      Artesano Destacado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Enhanced Main content */}
            <div className="lg:col-span-3">
              {/* Enhanced About section */}
              <Card className="mb-12 bg-gradient-card backdrop-blur-sm border-0 shadow-glass animate-fade-in">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                    Sobre {shop.shop_name}
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{shop.description}</p>
                  {shop.story && (
                    <div className="border-t border-primary/20 pt-6">
                      <h3 className="text-xl font-bold mb-4 text-primary">Nuestra Historia</h3>
                      <p className="text-muted-foreground leading-relaxed">{shop.story}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Products section */}
              <div 
                ref={productsRef}
                className={`transition-all duration-1000 ${productsVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: '200ms' }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Productos Artesanales
                  </h2>
                  <Badge variant="outline" className="px-4 py-2 text-sm border-primary/30">
                    {products.length} producto{products.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {productsLoading ? (
                  <ProductSkeleton count={6} />
                ) : products.length === 0 ? (
                  <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-card">
                    <CardContent className="p-12 text-center">
                      <div className="animate-float">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-primary/60" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Productos en preparación</h3>
                      <p className="text-muted-foreground">Pronto tendremos hermosas creaciones artesanales disponibles</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                      <Card 
                        key={product.id}
                        className="group cursor-pointer bg-gradient-card backdrop-blur-sm border-0 shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => navigate(`/tienda/${shop.shop_slug}/producto/${product.id}`)}
                      >
                        <CardContent className="p-0 overflow-hidden">
                          <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
                            {(product.images as any)?.[0] ? (
                              <>
                                <LazyImage
                                  src={(product.images as any)[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  fallback={<ShoppingBag className="w-16 h-16 text-primary/40" />}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-16 h-16 text-primary/40 group-hover:scale-110 transition-transform duration-300" />
                              </div>
                            )}
                            
                            {/* Wishlist button */}
                            <Button
                              size="sm"
                              variant="outline"
                              className={`absolute top-4 left-4 bg-background/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 hover:scale-110 ${
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
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-gradient-accent text-white border-0 shadow-glow animate-glow-pulse">
                                  <Star className="w-3 h-3 mr-1 fill-current" />
                                  Destacado
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
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
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                {product.short_description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-xl font-bold text-primary">
                                  {formatPrice(product.price)}
                                </span>
                                {product.compare_price && product.compare_price > product.price && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.compare_price)}
                                  </span>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="group-hover:bg-gradient-primary group-hover:text-white group-hover:border-transparent transition-all duration-300"
                              >
                                Ver más
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 bg-gradient-glass backdrop-blur-glass border-0 shadow-glass animate-fade-in" style={{ animationDelay: '300ms' }}>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                    Contactar Artesano
                  </h3>
                  
                  <div className="space-y-4">
                    {contactInfo.email && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-12 bg-background/50 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
                        onClick={() => handleContactClick('email', contactInfo.email)}
                      >
                        <Mail className="w-5 h-5 mr-3" />
                        Enviar email
                      </Button>
                    )}
                    
                    {contactInfo.phone && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-12 bg-background/50 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
                        onClick={() => handleContactClick('phone', contactInfo.phone)}
                      >
                        <Phone className="w-5 h-5 mr-3" />
                        Llamar ahora
                      </Button>
                    )}
                    
                    {contactInfo.whatsapp && (
                      <Button 
                        className="w-full justify-start h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-glow transition-all duration-300 hover:scale-105"
                        onClick={() => handleContactClick('whatsapp', contactInfo.whatsapp)}
                      >
                        <Phone className="w-5 h-5 mr-3" />
                        WhatsApp Directo
                      </Button>
                    )}
                  </div>

                  {/* Enhanced Social links */}
                  {(socialLinks.instagram || socialLinks.facebook) && (
                    <div className="mt-8">
                      <h4 className="font-semibold mb-4 text-primary">Síguenos</h4>
                      <div className="flex gap-3">
                        {socialLinks.instagram && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 bg-background/50 border-primary/20 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300"
                            onClick={() => window.open(socialLinks.instagram, '_blank')}
                          >
                            <Instagram className="w-4 h-4" />
                          </Button>
                        )}
                        {socialLinks.facebook && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 bg-background/50 border-primary/20 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all duration-300"
                            onClick={() => window.open(socialLinks.facebook, '_blank')}
                          >
                            <Facebook className="w-4 h-4" />
                          </Button>
                        )}
                        {socialLinks.website && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 bg-background/50 border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all duration-300"
                            onClick={() => window.open(socialLinks.website, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Certifications */}
                  {shop.certifications && (shop.certifications as any).length > 0 && (
                    <div className="mt-8">
                      <h4 className="font-semibold mb-4 text-primary">Certificaciones</h4>
                      <div className="space-y-2">
                        {(shop.certifications as any).map((cert: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary/80 w-full justify-center py-2">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};