import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArtisanShop, Product } from '@/types/artisan';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Phone, Mail, ExternalLink, Instagram, Facebook, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { useDataAudit } from '@/hooks/useDataAudit';
import { useRateLimit } from '@/hooks/useRateLimit';
import { logger } from '@/utils/logger';

export const PublicShopPage: React.FC = () => {
  const { shopSlug } = useParams<{ shopSlug: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ArtisanShop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const { logPublicDataAccess } = useDataAudit();
  const { checkRateLimit } = useRateLimit();

  useEffect(() => {
    const fetchShopData = async () => {
      if (!shopSlug) return;

      // Check rate limit
      const rateCheck = checkRateLimit('shopView');
      if (!rateCheck.allowed) {
        setRateLimited(true);
        setLoading(false);
        logger.security.rateLimitExceeded(
          'anonymous',
          100,
          '60s'
        );
        return;
      }

      try {
        // Fetch shop data with privacy controls
        const { data: shopData, error: shopError } = await supabase
          .from('artisan_shops')
          .select(`
            id,
            user_id,
            shop_name,
            shop_slug,
            description,
            story,
            banner_url,
            logo_url,
            craft_type,
            region,
            public_profile,
            privacy_level,
            contact_info,
            social_links,
            certifications,
            active,
            featured,
            seo_data,
            created_at,
            updated_at
          `)
          .eq('shop_slug', shopSlug)
          .eq('active', true)
          .single();

        if (shopError) {
          toast.error('Tienda no encontrada');
          navigate('/tiendas');
          return;
        }

        setShop(shopData);

        // Fetch products
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

        // Track shop view
        await supabase
          .from('artisan_analytics')
          .upsert({
            shop_id: shopData.id,
            date: new Date().toISOString().split('T')[0],
            views: 1
          }, {
            onConflict: 'shop_id,date',
            ignoreDuplicates: false
          });

      } catch (error) {
        console.error('Error fetching shop:', error);
        toast.error('Error al cargar la tienda');
      } finally {
        setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Cargando tienda...</div>
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

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        {/* Header with banner */}
        <div className="relative h-64 bg-gradient-to-r from-primary/80 to-accent overflow-hidden">
          {shop.banner_url && (
            <img 
              src={shop.banner_url} 
              alt={`Banner de ${shop.shop_name}`}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex items-end gap-6">
              {shop.logo_url && (
                <img 
                  src={shop.logo_url} 
                  alt={`Logo de ${shop.shop_name}`}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              )}
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{shop.shop_name}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {shop.craft_type?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  {shop.region && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="capitalize">{shop.region.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {shop.featured && (
                    <Badge variant="default" className="bg-accent">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main content */}
            <div className="lg:col-span-3">
              {/* About section */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Sobre {shop.shop_name}</h2>
                  <p className="text-muted-foreground mb-4">{shop.description}</p>
                  {shop.story && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Nuestra Historia</h3>
                      <p className="text-muted-foreground">{shop.story}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Products section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Productos</h2>
                  <Badge variant="outline">
                    {products.length} producto{products.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {products.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Próximamente tendremos productos disponibles</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <Card 
                        key={product.id}
                        className="group cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/tienda/${shop.shop_slug}/producto/${product.id}`)}
                      >
                        <CardContent className="p-0">
                          <div className="aspect-square bg-muted overflow-hidden rounded-t-lg">
                            {(product.images as any)?.[0] ? (
                              <img 
                                src={(product.images as any)[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                            {product.short_description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {product.short_description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-lg font-bold text-primary">
                                  {formatPrice(product.price)}
                                </span>
                                {product.compare_price && product.compare_price > product.price && (
                                  <span className="text-sm text-muted-foreground line-through ml-2">
                                    {formatPrice(product.compare_price)}
                                  </span>
                                )}
                              </div>
                              {product.featured && (
                                <Badge variant="secondary">Destacado</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                  
                  <div className="space-y-3">
                    {contactInfo.email && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleContactClick('email', contactInfo.email)}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar email
                      </Button>
                    )}
                    
                    {contactInfo.phone && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleContactClick('phone', contactInfo.phone)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Llamar
                      </Button>
                    )}
                    
                    {contactInfo.whatsapp && (
                      <Button 
                        variant="default" 
                        className="w-full justify-start bg-green-600 hover:bg-green-700"
                        onClick={() => handleContactClick('whatsapp', contactInfo.whatsapp)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    )}
                  </div>

                  {/* Social links */}
                  {(socialLinks.instagram || socialLinks.facebook) && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Redes Sociales</h4>
                      <div className="flex gap-2">
                        {socialLinks.instagram && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(socialLinks.instagram, '_blank')}
                          >
                            <Instagram className="w-4 h-4" />
                          </Button>
                        )}
                        {socialLinks.facebook && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(socialLinks.facebook, '_blank')}
                          >
                            <Facebook className="w-4 h-4" />
                          </Button>
                        )}
                        {socialLinks.website && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(socialLinks.website, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {shop.certifications && (shop.certifications as any).length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Certificaciones</h4>
                      <div className="space-y-2">
                        {(shop.certifications as any).map((cert: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
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