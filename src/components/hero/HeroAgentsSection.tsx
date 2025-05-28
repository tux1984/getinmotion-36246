
import React from 'react';
import { ArrowRight, Bot, Users, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HeroAgentsSectionProps {
  language: 'en' | 'es';
}

export const HeroAgentsSection: React.FC<HeroAgentsSectionProps> = ({ language }) => {
  const translations = {
    en: {
      title: "Meet Your AI Back Office Team",
      subtitle: "20+ specialized AI agents designed to handle your business operations while you focus on creating",
      features: {
        instant: {
          title: "Instant Activation",
          description: "Deploy agents in seconds with zero configuration"
        },
        specialized: {
          title: "Specialized Expertise",
          description: "Each agent is trained for specific creative business needs"
        },
        secure: {
          title: "Secure & Private",
          description: "Your data stays protected with enterprise-grade security"
        },
        collaborative: {
          title: "Works Together",
          description: "Agents coordinate seamlessly for complex workflows"
        }
      },
      categories: {
        financial: "Financial Agents",
        legal: "Legal Experts",
        operational: "Operations Team",
        marketing: "Marketing Suite"
      },
      cta: "Explore All Agents",
      preview: "See Agents in Action"
    },
    es: {
      title: "Conoce Tu Equipo de IA para Back Office",
      subtitle: "Más de 20 agentes de IA especializados diseñados para manejar las operaciones de tu negocio mientras te enfocas en crear",
      features: {
        instant: {
          title: "Activación Instantánea",
          description: "Despliega agentes en segundos sin configuración"
        },
        specialized: {
          title: "Experiencia Especializada",
          description: "Cada agente está entrenado para necesidades específicas de negocios creativos"
        },
        secure: {
          title: "Seguro y Privado",
          description: "Tus datos se mantienen protegidos con seguridad empresarial"
        },
        collaborative: {
          title: "Trabaja en Conjunto",
          description: "Los agentes se coordinan perfectamente para flujos complejos"
        }
      },
      categories: {
        financial: "Agentes Financieros",
        legal: "Expertos Legales",
        operational: "Equipo Operativo",
        marketing: "Suite de Marketing"
      },
      cta: "Explorar Todos los Agentes",
      preview: "Ver Agentes en Acción"
    }
  };

  const t = translations[language];

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      title: t.features.instant.title,
      description: t.features.instant.description
    },
    {
      icon: <Bot className="w-6 h-6 text-purple-600" />,
      title: t.features.specialized.title,
      description: t.features.specialized.description
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: t.features.secure.title,
      description: t.features.secure.description
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: t.features.collaborative.title,
      description: t.features.collaborative.description
    }
  ];

  const agentCategories = [
    {
      name: t.categories.financial,
      count: 3,
      color: "bg-green-50 border-green-200 text-green-800",
      icon: "💰"
    },
    {
      name: t.categories.legal,
      count: 6,
      color: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "⚖️"
    },
    {
      name: t.categories.operational,
      count: 4,
      color: "bg-purple-50 border-purple-200 text-purple-800",
      icon: "⚙️"
    },
    {
      name: t.categories.marketing,
      count: 7,
      color: "bg-pink-50 border-pink-200 text-pink-800",
      icon: "📈"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Agent Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t.preview}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentCategories.map((category, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 ${category.color} transition-all hover:scale-105`}>
                <div className="text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h4 className="font-semibold mb-2">{category.name}</h4>
                  <p className="text-sm opacity-75">{category.count} agentes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/agents">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              {t.cta}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
