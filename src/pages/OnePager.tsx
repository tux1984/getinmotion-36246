
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MotionLogo } from '@/components/MotionLogo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Footer } from '@/components/Footer';
import { CheckCircle, ArrowRight, Globe, DollarSign, Users, Calendar, Lightbulb, Sparkles, Target } from 'lucide-react';

const OnePager = () => {
  const { language } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  
  const translations = {
    en: {
      title: "Get in Motion",
      subtitle: "AI agents platform for emerging cultural creators",
      nav: {
        home: "Home",
        back: "Back to Home"
      },
      sections: {
        problem: {
          title: "Problem / Key Insight",
          content: "Cultural creators are left behind in the digital economy. They lack tools, time, and knowledge to manage their careers. Most live day-to-day and struggle to grow without infrastructure."
        },
        solution: {
          title: "Solution",
          content: "A suite of AI agents that automate admin and growth workflows, personalized to the creator's digital maturity:",
          bullets: [
            "Publishing and visibility",
            "Contracts and payments",
            "Promotion and audience building",
            "Collaboration and scaling opportunities"
          ]
        },
        traction: {
          title: "Traction",
          bullets: [
            "100+ interviews completed",
            "200+ creators on waitlist (in one week)",
            "Early partnerships in Colombia and U.S. Hispanic markets"
          ]
        },
        business: {
          title: "Business Model",
          bullets: [
            "Freemium SaaS: Free tier + $10–20/month",
            "Commissions: 5–10% on bookings/sales",
            "Partnerships: Cultural orgs, marketplaces, brand collabs"
          ]
        },
        market: {
          title: "Market",
          bullets: [
            "6M+ cultural creators in LATAM + U.S. Hispanics",
            "$4.3T global creative economy",
            "$1.9T global handicrafts market by 2033",
            "117M+ LATAM international tourists in 2023"
          ]
        },
        team: {
          title: "Team",
          bullets: [
            "Carlos Carrascal (CEO): Ex Workana, Nearpod, Andela. Expert in product/growth/marketplaces. Co-founder of Travelbot.",
            "Manuel Duque (CPO): Designer & researcher with 10+ years in civic tech and cultural platforms.",
            "Advisor: Federico Mesplet (co-founder & ex-CTO of Nearpod). Supporting CTO recruitment."
          ]
        },
        roadmap: {
          title: "Roadmap",
          bullets: [
            "Q2 2025: Final MVP + pilots in Colombia & U.S.",
            "Q3 2025: Verticalized copilots + expanded features",
            "Q4 2025: Raise $1M Seed Round"
          ]
        },
        raising: {
          title: "What we're raising",
          content: "$240K USD via SAFE:",
          bullets: [
            "$60K for MVP + UX",
            "$120K for tech team (CTO + devs)",
            "$60K for GTM and pilots"
          ]
        }
      }
    },
    es: {
      title: "Get in Motion",
      subtitle: "Plataforma de agentes de IA para creadores culturales emergentes",
      nav: {
        home: "Inicio",
        back: "Volver al Inicio"
      },
      sections: {
        problem: {
          title: "Problema / Insight Clave",
          content: "Los creadores culturales están excluidos de la economía digital. No tienen tiempo, herramientas ni recursos para gestionar su carrera. La mayoría vive del día a día y queda fuera de plataformas tradicionales."
        },
        solution: {
          title: "Solución",
          content: "Una suite de agentes de IA que automatizan tareas administrativas y de crecimiento, adaptados a la madurez digital de cada creador. Ayudamos a:",
          bullets: [
            "Publicar y visibilizar su trabajo",
            "Manejar contratos y pagos",
            "Escalar en plataformas digitales",
            "Colaborar con otros creadores y mercados culturales"
          ]
        },
        traction: {
          title: "Validación",
          bullets: [
            "100+ entrevistas realizadas",
            "200+ creadores en lista de espera (en una semana)",
            "Alianzas iniciales en Colombia y EE.UU. hispano"
          ]
        },
        business: {
          title: "Modelo de negocio",
          bullets: [
            "SaaS freemium: Plan gratuito + pagos mensuales entre USD 10–20",
            "Comisiones: 5–10% sobre ventas o reservas culturales",
            "Partnerships: Alianzas con plataformas, marcas y espacios culturales"
          ]
        },
        market: {
          title: "Mercado",
          bullets: [
            "+6M creadores culturales en LATAM y comunidades hispanas en EE.UU.",
            "+$4.3T economía creativa global",
            "+$1.9T mercado de artesanías proyectado a 2033",
            "+117M turistas internacionales en LATAM (2023)"
          ]
        },
        team: {
          title: "Equipo",
          bullets: [
            "Carlos Carrascal (CEO): Ex Workana, Nearpod, Andela. Experto en producto, growth y marketplaces. Co-founder de Travelbot.",
            "Manuel Duque (CPO): Diseñador UX con 10+ años en plataformas creativas y proyectos culturales.",
            "Advisor: Federico Mesplet (ex-CTO y cofundador de Nearpod). Asiste en selección de CTO."
          ]
        },
        roadmap: {
          title: "Roadmap",
          bullets: [
            "Q2 2025: MVP final + primeros pilotos (COL y EE.UU.)",
            "Q3 2025: Expansión a nuevas verticales y features",
            "Q4 2025: Búsqueda de ronda Seed ($1M+)"
          ]
        },
        raising: {
          title: "Lo que buscamos",
          content: "$240K USD en formato SAFE:",
          bullets: [
            "$60K para MVP + UX final",
            "$120K para equipo técnico (CTO + devs)",
            "$60K para GTM y pilotos"
          ]
        }
      }
    }
  };

  const t = translations[selectedLanguage];

  const handleTabChange = (value) => {
    setSelectedLanguage(value);
  };

  // Fixed the renderSection function to properly handle null content/bullets
  const renderSection = (icon, title, content, bullets = null) => (
    <div className="bg-gradient-to-br from-indigo-950 to-purple-950 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-indigo-800/30">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-bold ml-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">{title}</h3>
      </div>
      {content && <p className="text-indigo-100 mb-4">{content}</p>}
      {bullets && (
        <ul className="space-y-2">
          {bullets.map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-pink-400 mr-2 mt-1 flex-shrink-0" />
              <span className="text-indigo-100">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-indigo-950/80 border-b border-indigo-800/30 shadow-md">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <MotionLogo />
          <div className="flex items-center gap-4">
            <div className="bg-indigo-900/40 p-2 rounded-lg">
              <Tabs value={selectedLanguage} onValueChange={handleTabChange} className="w-[180px]">
                <TabsList className="grid w-full grid-cols-2 bg-indigo-900/50">
                  <TabsTrigger 
                    value="en" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
                  >
                    English
                  </TabsTrigger>
                  <TabsTrigger 
                    value="es"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/80 data-[state=active]:to-purple-600/80 data-[state=active]:text-white"
                  >
                    Español
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button 
              variant="outline" 
              className="text-xs sm:text-sm border-pink-500 text-pink-200 hover:bg-pink-900/30 hover:text-pink-100"
              onClick={() => window.location.href = "/"}
            >
              {t.nav.back} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {renderSection(
            <Lightbulb className="h-8 w-8 text-pink-400" />, 
            t.sections.problem.title, 
            t.sections.problem.content
          )}
          
          {renderSection(
            <Sparkles className="h-8 w-8 text-pink-400" />, 
            t.sections.solution.title, 
            t.sections.solution.content, 
            t.sections.solution.bullets
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {renderSection(
            <Target className="h-8 w-8 text-pink-400" />, 
            t.sections.traction.title, 
            null, 
            t.sections.traction.bullets
          )}
          
          {renderSection(
            <DollarSign className="h-8 w-8 text-pink-400" />, 
            t.sections.business.title, 
            null, 
            t.sections.business.bullets
          )}
          
          {renderSection(
            <Globe className="h-8 w-8 text-pink-400" />, 
            t.sections.market.title, 
            null, 
            t.sections.market.bullets
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {renderSection(
            <Users className="h-8 w-8 text-pink-400" />, 
            t.sections.team.title, 
            null, 
            t.sections.team.bullets
          )}
          
          {renderSection(
            <Calendar className="h-8 w-8 text-pink-400" />, 
            t.sections.roadmap.title, 
            null, 
            t.sections.roadmap.bullets
          )}
          
          {renderSection(
            <DollarSign className="h-8 w-8 text-pink-400" />, 
            t.sections.raising.title, 
            t.sections.raising.content, 
            t.sections.raising.bullets
          )}
        </div>
      </main>

      <Footer language={selectedLanguage} />
    </div>
  );
};

export default OnePager;
