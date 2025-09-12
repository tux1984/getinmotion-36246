import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Store, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Globe, 
  ArrowRight, 
  CheckCircle,
  Palette,
  Camera,
  MessageCircle,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { mapToLegacyLanguage } from '@/utils/languageMapper';

export const CreateShopLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const compatibleLanguage = mapToLegacyLanguage(language);

  const translations = {
    en: {
      title: 'Create Your Digital Shop',
      subtitle: 'Turn your craft into a thriving online business with AI',
      description: 'Join thousands of artisans who have transformed their passion into profit with our intelligent shop creation platform.',
      createNow: 'Create Shop Now',
      getStarted: 'Get Started Free',
      features: {
        ai: 'AI-Powered Setup',
        aiDesc: 'Our AI analyzes your profile and creates a personalized shop',
        design: 'Beautiful Design',
        designDesc: 'Professional templates that showcase your crafts perfectly',
        global: 'Global Reach',
        globalDesc: 'Reach customers worldwide with multilingual support',
        analytics: 'Smart Analytics',
        analyticsDesc: 'Track sales, customers, and optimize your business'
      },
      howItWorks: {
        title: 'How It Works',
        step1: 'Share Your Story',
        step1Desc: 'Tell us about your craft and experience',
        step2: 'AI Creates Your Shop',
        step2Desc: 'Our AI builds a personalized store for you',
        step3: 'Start Selling',
        step3Desc: 'Add products and start reaching customers'
      },
      testimonials: {
        title: 'What Artisans Say',
        testimonial1: '"My sales increased by 200% in just 3 months!"',
        author1: 'María García, Ceramist',
        testimonial2: '"The AI setup was incredible - everything was perfect!"',
        author2: 'Carlos López, Woodworker'
      }
    },
    es: {
      title: 'Crea tu Tienda Digital',
      subtitle: 'Convierte tu artesanía en un negocio online próspero con IA',
      description: 'Únete a miles de artesanos que han transformado su pasión en ganancias con nuestra plataforma inteligente de creación de tiendas.',
      createNow: 'Crear Tienda Ahora',
      getStarted: 'Comenzar Gratis',
      features: {
        ai: 'Configuración con IA',
        aiDesc: 'Nuestra IA analiza tu perfil y crea una tienda personalizada',
        design: 'Diseño Hermoso',
        designDesc: 'Plantillas profesionales que muestran tus artesanías perfectamente',
        global: 'Alcance Global',
        globalDesc: 'Alcanza clientes mundialmente con soporte multiidioma',
        analytics: 'Analíticas Inteligentes',
        analyticsDesc: 'Rastrea ventas, clientes y optimiza tu negocio'
      },
      howItWorks: {
        title: 'Cómo Funciona',
        step1: 'Comparte tu Historia',
        step1Desc: 'Cuéntanos sobre tu artesanía y experiencia',
        step2: 'IA Crea tu Tienda',
        step2Desc: 'Nuestra IA construye una tienda personalizada para ti',
        step3: 'Comienza a Vender',
        step3Desc: 'Agrega productos y comienza a alcanzar clientes'
      },
      testimonials: {
        title: 'Lo que Dicen los Artesanos',
        testimonial1: '"¡Mis ventas aumentaron 200% en solo 3 meses!"',
        author1: 'María García, Ceramista',
        testimonial2: '"La configuración con IA fue increíble - ¡todo perfecto!"',
        author2: 'Carlos López, Carpintero'
      }
    }
  };

  const t = translations[compatibleLanguage];

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-16"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Store className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t.title}
          </h1>
          
          <p className="text-2xl text-emerald-600 dark:text-emerald-400 font-medium mb-4">
            {t.subtitle}
          </p>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/dashboard/create-shop')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 px-12 py-6 text-xl"
            >
              <Store className="w-6 h-6 mr-3" />
              {t.createNow}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="ml-3"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.div>
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            ¿Por qué Elegir Nuestra Plataforma?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-emerald-200 dark:border-emerald-800 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.features.ai}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.features.aiDesc}</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.features.design}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.features.designDesc}</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.features.global}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.features.globalDesc}</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.features.analytics}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t.features.analyticsDesc}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div variants={itemVariants} className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t.howItWorks.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-xl">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.howItWorks.step1}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">{t.howItWorks.step1Desc}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-xl">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.howItWorks.step2}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">{t.howItWorks.step2Desc}</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-xl">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.howItWorks.step3}</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">{t.howItWorks.step3Desc}</p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div variants={itemVariants} className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t.testimonials.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-emerald-200 dark:border-emerald-800 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 italic">
                  {t.testimonials.testimonial1}
                </p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {t.testimonials.author1}
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 dark:border-emerald-800 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 italic">
                  {t.testimonials.testimonial2}
                </p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {t.testimonials.author2}
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">
              ¿Listo para Transformar tu Artesanía?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Únete a miles de artesanos exitosos. Crea tu tienda digital en minutos.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/dashboard/create-shop')}
              className="bg-white text-emerald-600 hover:bg-gray-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 px-12 py-6 text-xl font-bold"
            >
              <Store className="w-6 h-6 mr-3" />
              {t.getStarted}
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};