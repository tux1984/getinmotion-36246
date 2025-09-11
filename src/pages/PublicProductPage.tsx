import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArtisanShop, Product } from '@/types/artisan';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, Star, Package, Ruler, Timer, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { useDataAudit } from '@/hooks/useDataAudit';
import { useRateLimit } from '@/hooks/useRateLimit';
import { logger } from '@/utils/logger';

export const PublicProductPage: React.FC = () => {
  const { shopSlug, productId } = useParams<{ shopSlug: string; productId: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ArtisanShop | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const { logPublicDataAccess } = useDataAudit();
  const { checkRateLimit } = useRateLimit();

  useEffect(() => {
    const fetchProductData = async () => {
      if (!shopSlug || !productId) return;

      // Check rate limit
      const rateCheck = checkRateLimit('shopView');
      if (!rateCheck.allowed) {
        setRateLimited(true);
        setLoading(false);
        return;
      }

      try {
        // First get shop data with privacy controls
        const { data: shopData, error: shopError } = await supabase
          .from('artisan_shops')
          .select(`
            id,
            user_id,
            shop_name,
            shop_slug,
            description,
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

        // Get product data
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .eq('shop_id', shopData.id)
          .eq('active', true)
          .single();

        if (productError) {
          toast.error('Producto no encontrado');
          navigate(`/tienda/${shopSlug}`);
          return;
        }

        setProduct(productData);

        // Get related products (same shop, different product)
        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('shop_id', shopData.id)
          .eq('active', true)
          .neq('id', productId)
          .limit(4);

        setRelatedProducts(relatedData || []);

      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [shopSlug, productId, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleContactShop = () => {
    const contactInfo = shop?.contact_info as any || {};
    if (contactInfo.whatsapp) {
      const message = `Hola! Me interesa el producto "${product?.name}" de su tienda ${shop?.shop_name}. ¿Podrían darme más información?`;
      window.open(`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else if (contactInfo.email) {
      const subject = `Consulta sobre ${product?.name}`;
      const body = `Hola! Me interesa el producto "${product?.name}" de su tienda ${shop?.shop_name}. ¿Podrían darme más información?`;
      window.open(`mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Cargando producto...</div>
      </div>
    );
  }

  if (!shop || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <Button onClick={() => navigate('/tiendas')}>Ver todas las tiendas</Button>
      </div>
    );
  }

  const images = (product.images as any) || [];
  const materials = (product.materials as any) || [];
  const techniques = (product.techniques as any) || [];
  const dimensions = (product.dimensions as any) || {};
  const seoData = (product.seo_data as any) || {};

  return (
    <>
      <Helmet>
        <title>{seoData.title || `${product.name} - ${shop.shop_name}`}</title>
        <meta name="description" content={seoData.description || product.description || `${product.name} - Artesanía ${shop.craft_type} de ${shop.shop_name}`} />
        <meta name="keywords" content={seoData.keywords?.join(', ') || `${product.name}, artesanías, ${shop.craft_type}, ${shop.region}`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description || `Artesanía ${shop.craft_type} de ${shop.shop_name}`} />
        <meta property="og:image" content={images[0]} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="COP" />
        <link rel="canonical" href={`${window.location.origin}/tienda/${shop.shop_slug}/producto/${product.id}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        {/* Navigation */}
        <div className="border-b bg-background/80 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(`/tienda/${shop.shop_slug}`)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a {shop.shop_name}
              </Button>
              <div className="text-sm text-muted-foreground">
                <span>Tienda: </span>
                <button 
                  onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
                  className="text-primary hover:underline"
                >
                  {shop.shop_name}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Product images */}
            <div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                {images.length > 0 ? (
                  <img 
                    src={images[selectedImage] || images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">
                  {product.category || shop.craft_type?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                  )}
                  {product.featured && (
                    <Badge variant="secondary">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                </div>
              </div>

              {product.short_description && (
                <p className="text-lg text-muted-foreground mb-6">{product.short_description}</p>
              )}

              {/* Product details */}
              <div className="space-y-4 mb-6">
                {product.inventory !== undefined && (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {product.inventory > 0 ? `${product.inventory} disponibles` : 'Agotado'}
                    </span>
                  </div>
                )}

                {product.production_time && (
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Tiempo de producción: {product.production_time}</span>
                  </div>
                )}

                {(dimensions.length || dimensions.width || dimensions.height) && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Dimensiones: {dimensions.length}x{dimensions.width}x{dimensions.height} {dimensions.unit || 'cm'}
                    </span>
                  </div>
                )}

                {product.weight && (
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Peso: {product.weight}g</span>
                  </div>
                )}
              </div>

              {/* Contact buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleContactShop}
                  className="w-full"
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contactar para comprar
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
                  className="w-full"
                >
                  Ver más productos de {shop.shop_name}
                </Button>
              </div>
            </div>
          </div>

          {/* Product description and details */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Descripción</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || 'No hay descripción disponible para este producto.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Materials */}
              {materials.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Materiales</h3>
                    <div className="space-y-2">
                      {materials.map((material: string, index: number) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Techniques */}
              {techniques.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3">Técnicas</h3>
                    <div className="space-y-2">
                      {techniques.map((technique: string, index: number) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Artisan info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Artesano</h3>
                  <div className="flex items-center gap-3 mb-3">
                    {shop.logo_url && (
                      <img 
                        src={shop.logo_url}
                        alt={shop.shop_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{shop.shop_name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {shop.region?.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
                    className="w-full"
                  >
                    Ver tienda completa
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Más productos de {shop.shop_name}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card 
                    key={relatedProduct.id}
                    className="group cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigate(`/tienda/${shop.shop_slug}/producto/${relatedProduct.id}`)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted overflow-hidden rounded-t-lg">
                        {(relatedProduct.images as any)?.[0] ? (
                          <img 
                            src={(relatedProduct.images as any)[0]}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{relatedProduct.name}</h3>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(relatedProduct.price)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};