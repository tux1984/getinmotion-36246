import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useArtisanShop } from '@/hooks/useArtisanShop';
import { useProducts } from '@/hooks/useProducts';
import { ArtisanOnboarding } from './ArtisanOnboarding';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  Eye,
  AlertCircle,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ArtisanDashboard: React.FC = () => {
  const { shop, loading } = useArtisanShop();
  const { products } = useProducts(shop?.id);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return <ArtisanOnboarding />;
  }

  const stats = [
    {
      title: 'Productos',
      value: products.length,
      icon: Package,
      description: 'productos en tu catálogo',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Ventas',
      value: 0,
      icon: ShoppingCart,
      description: 'pedidos este mes',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Visitas',
      value: 0,
      icon: Eye,
      description: 'visitas a tu tienda',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Ingresos',
      value: '$0',
      icon: TrendingUp,
      description: 'ingresos totales',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const quickActions = [
    {
      title: 'Agregar Producto',
      description: 'Sube un nuevo producto a tu catálogo',
      icon: Plus,
      action: () => navigate('/dashboard/artisan/products/new'),
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      title: 'Ver mi Tienda',
      description: 'Mira cómo se ve tu tienda online',
      icon: Store,
      action: () => window.open(`/tienda/${shop.shop_slug}`, '_blank'),
      color: 'bg-gradient-to-r from-green-500 to-green-600',
    },
    {
      title: 'Gestionar Productos',
      description: 'Edita o elimina productos existentes',
      icon: Package,
      action: () => navigate('/dashboard/artisan/products'),
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
  ];

  const suggestions = [
    {
      title: 'Completa tu perfil',
      description: 'Agrega más información sobre tu historia y certificaciones',
      completed: !!(shop.story && shop.certifications?.length),
    },
    {
      title: 'Sube tu primera foto de perfil',
      description: 'Una buena foto aumenta la confianza de los clientes',
      completed: !!shop.logo_url,
    },
    {
      title: 'Agrega 5 productos',
      description: 'Los artesanos con más productos venden más',
      completed: products.length >= 5,
    },
    {
      title: 'Configura redes sociales',
      description: 'Conecta tus redes para atraer más clientes',
      completed: !!(shop.social_links?.instagram || shop.social_links?.facebook),
    },
  ];

  const completedSuggestions = suggestions.filter(s => s.completed).length;
  const progressPercentage = (completedSuggestions / suggestions.length) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola, {shop.shop_name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu tienda digital y vende tus artesanías en línea
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge variant="secondary" className="text-sm">
            {shop.craft_type?.charAt(0).toUpperCase() + shop.craft_type?.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Gestiona tu tienda con estas acciones frecuentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className={`${action.color} text-white p-6 rounded-lg cursor-pointer transition-transform hover:scale-105`}
                onClick={action.action}
              >
                <action.icon className="w-8 h-8 mb-3" />
                <h3 className="font-semibold text-lg mb-2">
                  {action.title}
                </h3>
                <p className="text-sm opacity-90">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress and Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Progreso de tu Tienda
            </CardTitle>
            <CardDescription>
              {completedSuggestions} de {suggestions.length} tareas completadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {progressPercentage === 100 
                  ? '¡Felicitaciones! Has completado todas las tareas recomendadas.'
                  : `Completa las tareas restantes para optimizar tu tienda.`
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Sugerencias
            </CardTitle>
            <CardDescription>
              Mejora tu tienda con estas recomendaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    suggestion.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                        suggestion.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {suggestion.completed ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {suggestion.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};