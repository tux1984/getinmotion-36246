import React from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Package, 
  BarChart3, 
  Settings, 
  Edit3, 
  Eye, 
  Plus,
  ShoppingBag,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useArtisanShop } from '@/hooks/useArtisanShop';
import { useProducts } from '@/hooks/useProducts';
import { useNavigate } from 'react-router-dom';

export const ShopDashboard: React.FC = () => {
  const { shop, loading: shopLoading } = useArtisanShop();
  const { products, loading: productsLoading } = useProducts(shop?.id);
  const navigate = useNavigate();

  if (shopLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="h-48 bg-muted rounded-lg"></div>
              <div className="h-48 bg-muted rounded-lg"></div>
              <div className="h-48 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">No tienes tienda creada</h2>
          <p className="text-muted-foreground mb-6">
            Crea tu tienda digital para empezar a vender tus productos
          </p>
          <Button onClick={() => navigate('/dashboard/create-shop')}>
            <Plus className="w-4 h-4 mr-2" />
            Crear mi tienda
          </Button>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Productos',
      value: products.length,
      icon: Package,
      trend: '+2 esta semana',
      color: 'text-blue-600'
    },
    {
      title: 'Visitas',
      value: '0',
      icon: Users,
      trend: 'Próximamente',
      color: 'text-green-600'
    },
    {
      title: 'Ventas',
      value: '0',
      icon: ShoppingBag,
      trend: 'Próximamente',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">Mi Tienda</h1>
            <p className="text-muted-foreground">
              Gestiona tu tienda digital {shop.shop_name}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Ver tienda pública
            </Button>
            <Button 
              onClick={() => navigate('/dashboard/create-shop')}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Editar tienda
            </Button>
          </div>
        </motion.div>

        {/* Shop Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                {shop.logo_url ? (
                  <img 
                    src={shop.logo_url} 
                    alt={shop.shop_name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Store className="w-8 h-8 text-primary" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold">{shop.shop_name}</h2>
                  <Badge variant={shop.active ? "default" : "secondary"}>
                    {shop.active ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-3">{shop.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Tipo: {shop.craft_type}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Región: {shop.region}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>0.0 (0 reseñas)</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions & Products */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 h-fit">
              <h3 className="font-bold mb-4">Acciones rápidas</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/productos/subir')}
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Agregar producto
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/dashboard/create-shop')}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Configurar tienda
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/tienda/${shop.shop_slug}`)}
                >
                  <Eye className="w-4 h-4 mr-3" />
                  Vista pública
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled
                >
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Analíticas
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Pronto
                  </Badge>
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Products Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Mis productos</h3>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/productos/subir')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo producto
                </Button>
              </div>
              
              {productsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-semibold mb-2">No tienes productos</h4>
                  <p className="text-muted-foreground mb-6">
                    Agrega tu primer producto para empezar a vender
                  </p>
                  <Button onClick={() => navigate('/productos/subir')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar producto
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${product.price.toLocaleString()} COP
                        </p>
                      </div>
                      
                      <Badge variant={product.active ? "default" : "secondary"}>
                        {product.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  ))}
                  
                  {products.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" size="sm">
                        Ver todos los productos ({products.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};