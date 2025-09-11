import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArtisanShop, CraftType, Region } from '@/types/artisan';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, Search, Filter, ShoppingBag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const ShopDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [shops, setShops] = useState<ArtisanShop[]>([]);
  const [filteredShops, setFilteredShops] = useState<ArtisanShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCraft, setSelectedCraft] = useState(searchParams.get('craft') || 'all');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || 'all');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');

  const craftTypes: { value: CraftType; label: string }[] = [
    { value: 'textiles', label: 'Textiles' },
    { value: 'ceramics', label: 'Cerámica' },
    { value: 'jewelry', label: 'Joyería' },
    { value: 'woodwork', label: 'Madera' },
    { value: 'leather', label: 'Cuero' },
    { value: 'basketry', label: 'Cestería' },
    { value: 'metalwork', label: 'Metalistería' },
    { value: 'glasswork', label: 'Vidrio' },
    { value: 'painting', label: 'Pintura' },
    { value: 'sculpture', label: 'Escultura' },
    { value: 'other', label: 'Otros' }
  ];

  const regions: { value: Region; label: string }[] = [
    { value: 'antioquia', label: 'Antioquia' },
    { value: 'atlantico', label: 'Atlántico' },
    { value: 'bolivar', label: 'Bolívar' },
    { value: 'boyaca', label: 'Boyacá' },
    { value: 'caldas', label: 'Caldas' },
    { value: 'cauca', label: 'Cauca' },
    { value: 'cundinamarca', label: 'Cundinamarca' },
    { value: 'huila', label: 'Huila' },
    { value: 'narino', label: 'Nariño' },
    { value: 'quindio', label: 'Quindío' },
    { value: 'risaralda', label: 'Risaralda' },
    { value: 'santander', label: 'Santander' },
    { value: 'tolima', label: 'Tolima' },
    { value: 'valle_del_cauca', label: 'Valle del Cauca' },
    { value: 'bogota', label: 'Bogotá' }
  ];

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const { data, error } = await supabase
          .from('artisan_shops')
          .select('*')
          .eq('active', true)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setShops(data || []);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    let filtered = shops;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(shop => 
        shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.craft_type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Craft type filter
    if (selectedCraft !== 'all') {
      filtered = filtered.filter(shop => shop.craft_type === selectedCraft);
    }

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(shop => shop.region === selectedRegion);
    }

    // Featured filter
    if (featuredOnly) {
      filtered = filtered.filter(shop => shop.featured);
    }

    setFilteredShops(filtered);

    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCraft !== 'all') params.set('craft', selectedCraft);
    if (selectedRegion !== 'all') params.set('region', selectedRegion);
    if (featuredOnly) params.set('featured', 'true');
    setSearchParams(params);

  }, [shops, searchQuery, selectedCraft, selectedRegion, featuredOnly, setSearchParams]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCraft('all');
    setSelectedRegion('all');
    setFeaturedOnly(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Cargando tiendas...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Directorio de Artesanos - Descubre Artesanías Colombianas Auténticas</title>
        <meta name="description" content="Explora el directorio completo de artesanos colombianos. Encuentra textiles, cerámica, joyería y más artesanías auténticas de todas las regiones de Colombia." />
        <meta name="keywords" content="artesanos colombia, directorio artesanos, artesanías colombianas, textiles, cerámica, joyería, madera, cuero" />
        <meta property="og:title" content="Directorio de Artesanos Colombianos" />
        <meta property="og:description" content="Descubre artesanías auténticas de Colombia. Encuentra artesanos locales y sus creaciones únicas." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/tiendas`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Directorio de Artesanos
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Descubre las mejores artesanías colombianas directamente de los creadores
            </p>
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar artesanos o productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Filtros</h2>
                {(selectedCraft !== 'all' || selectedRegion !== 'all' || featuredOnly) && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
              </div>
              
              <div className="grid md:grid-cols-4 gap-4">
                <Select value={selectedCraft} onValueChange={setSelectedCraft}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de artesanía" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las artesanías</SelectItem>
                    {craftTypes.map(craft => (
                      <SelectItem key={craft.value} value={craft.value}>
                        {craft.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Región" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las regiones</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={featuredOnly ? "default" : "outline"}
                  onClick={() => setFeaturedOnly(!featuredOnly)}
                  className="justify-start"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Solo destacados
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {filteredShops.length} tienda{filteredShops.length !== 1 ? 's' : ''} encontrada{filteredShops.length !== 1 ? 's' : ''}
            </h2>
            <div className="text-sm text-muted-foreground">
              Total: {shops.length} artesanos registrados
            </div>
          </div>

          {/* Shop grid */}
          {filteredShops.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No se encontraron tiendas</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta ajustar los filtros o la búsqueda para encontrar más resultados.
                </p>
                <Button onClick={clearFilters}>Limpiar filtros</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredShops.map((shop) => (
                <Card 
                  key={shop.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
                >
                  <CardContent className="p-0">
                    {/* Shop banner/logo */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden rounded-t-lg">
                      {shop.banner_url ? (
                        <img 
                          src={shop.banner_url}
                          alt={`Banner de ${shop.shop_name}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Logo overlay */}
                      {shop.logo_url && (
                        <div className="absolute bottom-4 left-4">
                          <img 
                            src={shop.logo_url}
                            alt={`Logo de ${shop.shop_name}`}
                            className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                          />
                        </div>
                      )}

                      {/* Featured badge */}
                      {shop.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="default" className="bg-accent">
                            <Star className="w-3 h-3 mr-1" />
                            Destacado
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Shop info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <h3 className="font-bold text-lg line-clamp-1 mb-1">{shop.shop_name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {shop.craft_type && (
                            <Badge variant="outline" className="text-xs">
                              {shop.craft_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          )}
                          {shop.region && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="capitalize">{shop.region.replace(/_/g, ' ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {shop.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {shop.description}
                        </p>
                      )}

                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Ver tienda
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};