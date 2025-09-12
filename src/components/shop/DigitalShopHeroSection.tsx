import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Sparkles, TrendingUp, Users, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DigitalShopHeroSectionProps {
  language?: 'en' | 'es';
}

export const DigitalShopHeroSection: React.FC<DigitalShopHeroSectionProps> = ({ 
  language = 'es' 
}) => {
  const navigate = useNavigate();

  const translations = {
    en: {
      title: 'Create Your Digital Shop',
      subtitle: 'Turn your craft into a thriving online business',
      description: 'Build a beautiful digital storefront with AI assistance. Reach more customers and increase your sales.',
      createNow: 'Create Shop Now',
      features: {
        ai: 'AI-Powered Setup',
        reach: 'Global Reach',
        sales: 'Boost Sales'
      },
      stats: {
        artisans: '1,200+ Artisans',
        sales: '85% Sales Increase',
        reach: '50+ Countries'
      }
    },
    es: {
      title: 'Crea tu Tienda Digital',
      subtitle: 'Convierte tu artesanía en un negocio online próspero',
      description: 'Construye una hermosa tienda digital con asistencia de IA. Alcanza más clientes y aumenta tus ventas.',
      createNow: 'Crear Tienda Ahora',
      features: {
        ai: 'Configuración con IA',
        reach: 'Alcance Global',
        sales: 'Aumenta Ventas'
      },
      stats: {
        artisans: '1,200+ Artesanos',
        sales: '85% Más Ventas',
        reach: '50+ Países'
      }
    }
  };

  const t = translations[language];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950 dark:via-gray-900 dark:to-teal-950 rounded-2xl p-8 mb-8 border border-emerald-200 dark:border-emerald-800"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-teal-500/10 rounded-full blur-xl" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left content */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-4 h-4" />
              ¡Nuevo! Creación automática con IA
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {t.title}
            </h2>
            
            <p className="text-xl text-emerald-600 dark:text-emerald-400 font-medium">
              {t.subtitle}
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {t.description}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/dashboard/create-shop')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg"
            >
              <Store className="w-5 h-5 mr-2" />
              {t.createNow}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {t.stats.artisans.split(' ')[0]}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t.stats.artisans.split(' ').slice(1).join(' ')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {t.stats.sales.split(' ')[0]}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t.stats.sales.split(' ').slice(1).join(' ')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {t.stats.reach.split(' ')[0]}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t.stats.reach.split(' ').slice(1).join(' ')}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right content - Feature cards */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="grid gap-4">
            <Card className="border-emerald-200 dark:border-emerald-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t.features.ai}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    IA configura tu tienda automáticamente
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-200 dark:border-teal-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t.features.reach}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Vende a clientes de todo el mundo
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t.features.sales}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Aumenta tus ventas hasta 85%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};