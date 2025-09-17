import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArtisanShop, Product } from '@/types/artisan';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, Star, Package, Ruler, Timer, ShoppingBag, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

export const PublicProductPage: React.FC = () => {
  const { shopSlug, productId } = useParams<{ shopSlug: string; productId: string }>();
  const navigate = useNavigate();
  const [shop, setShop] = useState<ArtisanShop | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!shopSlug || !productId) return;

      try {
        // First get shop data
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-subtle to-secondary/10">
        <div className="text-center animate-fade-in">
          <div className="animate-float mb-4">
            <ShoppingBag className="w-16 h-16 mx-auto text-primary/60" />
          </div>
          <div className="text-xl font-medium text-primary">Cargando producto...</div>
          <div className="text-sm text-muted-foreground mt-2">Explorando arte colombiano</div>
        </div>
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

      <div className="min-h-screen bg-gradient-to-br from-background via-primary-subtle to-secondary/10">
        {/* Enhanced Navigation */}
        <div className="border-b bg-gradient-glass backdrop-blur-glass">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-6">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
                  className="bg-background/50 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a la tienda
                </Button>
                <div className="text-sm text-muted-foreground">
                  <span>Artesano: </span>
                  <button 
                    onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
                    className="text-primary font-medium hover:underline transition-colors duration-300"
                  >
                    {shop.shop_name}
                  </button>
                </div>
              </div>
              <Badge variant="outline" className="px-4 py-2 border-primary/30">
                {shop.craft_type?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Enhanced Product images */}
            <div className="animate-fade-in">
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl overflow-hidden mb-6 shadow-glass">
                {images.length > 0 ? (
                  <img 
                    src={images[selectedImage] || images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-float">
                      <ShoppingBag className="w-20 h-20 text-primary/40" />
                    </div>
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                        selectedImage === index 
                          ? 'border-primary shadow-glow' 
                          : 'border-transparent hover:border-primary/40'
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

            {/* Enhanced Product info */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="mb-6">
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary/80">
                  {product.category || shop.craft_type?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                  {product.name}
                </h1>
                <div className="flex items-center gap-6 mb-6 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.compare_price)}
                      </span>
                    )}
                  </div>
                  {product.featured && (
                    <Badge className="bg-gradient-accent text-white border-0 shadow-glow animate-glow-pulse px-4 py-2">
                      <Star className="w-4 h-4 mr-2 fill-current" />
                      Producto Destacado
                    </Badge>
                  )}
                </div>
              </div>

              {product.short_description && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{product.short_description}</p>
              )}

              {/* Enhanced Product details */}
              <div className="space-y-4 mb-8 p-6 bg-gradient-glass backdrop-blur-sm rounded-2xl border-0">
                <h3 className="font-bold text-lg text-primary mb-4">Detalles del producto</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.inventory !== undefined && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">
                        {product.inventory > 0 ? `${product.inventory} disponibles` : 'Agotado'}
                      </span>
                    </div>
                  )}

                  {product.production_time && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Timer className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">Tiempo: {product.production_time}</span>
                    </div>
                  )}

                  {(dimensions.length || dimensions.width || dimensions.height) && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Ruler className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">
                        {dimensions.length}×{dimensions.width}×{dimensions.height} {dimensions.unit || 'cm'}
                      </span>
                    </div>
                  )}

                  {product.weight && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">Peso: {product.weight}g</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Contact buttons */}
              <div className="space-y-4">
                <Button 
                  onClick={handleContactShop}
                  className="w-full h-14 text-lg bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Contactar para comprar
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
                  className="w-full h-12 bg-background/50 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
                >
                  Ver más de {shop.shop_name}
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Product description and details */}
          <div className="grid lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-glass animate-fade-in" style={{ animationDelay: '400ms' }}>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                    Descripción detallada
                  </h2>
                  <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                    {product.description || 'Esta hermosa pieza artesanal representa la tradición y maestría de nuestros artesanos colombianos.'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* Enhanced Materials */}
              {materials.length > 0 && (
                <Card className="bg-gradient-glass backdrop-blur-sm border-0 shadow-glass animate-fade-in" style={{ animationDelay: '500ms' }}>
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                      <div className="p-1 rounded bg-primary/10">
                        <Package className="w-4 h-4" />
                      </div>
                      Materiales
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {materials.map((material: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-primary/30 text-primary/80">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Techniques */}
              {techniques.length > 0 && (
                <Card className="bg-gradient-glass backdrop-blur-sm border-0 shadow-glass animate-fade-in" style={{ animationDelay: '600ms' }}>
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                      <div className="p-1 rounded bg-primary/10">
                        <Star className="w-4 h-4" />
                      </div>
                      Técnicas artesanales
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {techniques.map((technique: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-secondary/30 text-secondary/80">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Artisan info */}
              <Card className="bg-gradient-glass backdrop-blur-sm border-0 shadow-glass animate-fade-in" style={{ animationDelay: '700ms' }}>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4 text-primary">Conoce al artesano</h3>
                  <div className="flex items-center gap-4 mb-4">
                    {shop.logo_url && (
                      <img 
                        src={shop.logo_url}
                        alt={shop.shop_name}
                        className="w-16 h-16 rounded-full object-cover shadow-card"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-lg">{shop.shop_name}</p>
                      <p className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {shop.region?.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
                    className="w-full bg-background/50 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
                  >
                    Explorar toda la tienda
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Related products */}
          {relatedProducts.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: '800ms' }}>
              <h2 className="text-3xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
                Más creaciones de {shop.shop_name}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct, index) => (
                  <Card 
                    key={relatedProduct.id}
                    className="group cursor-pointer bg-gradient-card backdrop-blur-sm border-0 shadow-card hover:shadow-hover transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                    style={{ animationDelay: `${800 + index * 100}ms` }}
                    onClick={() => navigate(`/tienda/${shop.shop_slug}/producto/${relatedProduct.id}`)}
                  >
                    <CardContent className="p-0 overflow-hidden">
                      <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
                        {(relatedProduct.images as any)?.[0] ? (
                          <img 
                            src={(relatedProduct.images as any)[0]}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {relatedProduct.name}
                        </h3>
                        <span className="text-xl font-bold text-primary">
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