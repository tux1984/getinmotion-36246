
import React from 'react';
import { MotionLogo } from './MotionLogo';
import { Link } from 'react-router-dom';

interface FooterProps {
  language: 'en' | 'es';
}

export const Footer = ({ language }: FooterProps) => {
  const translations = {
    en: {
      tagline: "Empowering cultural creators with AI-powered tools for sustainable creative careers",
      product: "Product",
      platform: "Platform",
      calculator: "Maturity Calculator", 
      dashboard: "Dashboard",
      agents: "AI Agents",
      agentsGallery: "Agents Gallery",
      resources: "Resources",
      login: "Login",
      admin: "Admin Access",
      waitlist: "Join Waitlist",
      legal: "Legal",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      copyright: `© ${new Date().getFullYear()} Motion Project. All rights reserved.`,
      followUs: "Follow Us"
    },
    es: {
      tagline: "Empoderando a creadores culturales con herramientas de IA para carreras creativas sostenibles",
      product: "Producto",
      platform: "Plataforma",
      calculator: "Calculadora de Madurez",
      dashboard: "Dashboard", 
      agents: "Agentes de IA",
      agentsGallery: "Galería de Agentes",
      resources: "Recursos",
      login: "Iniciar Sesión",
      admin: "Acceso Admin",
      waitlist: "Unirse a Lista",
      legal: "Legal",
      privacyPolicy: "Política de Privacidad",
      termsOfService: "Términos de Servicio",
      copyright: `© ${new Date().getFullYear()} Motion Project. Todos los derechos reservados.`,
      followUs: "Síguenos"
    }
  };

  const t = translations[language];

  return (
    <footer className="relative w-full bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 text-pink-300/20 text-6xl opacity-40 rotate-12 animate-pulse" style={{animationDuration: '4s'}}>♪</div>
        <div className="absolute bottom-32 right-20 text-indigo-300/20 text-7xl opacity-30 -rotate-6 animate-pulse" style={{animationDuration: '6s'}}>♫</div>
        <div className="absolute top-1/2 left-1/4 text-purple-300/15 text-5xl opacity-25 rotate-45 animate-pulse" style={{animationDuration: '5s'}}>♬</div>
      </div>

      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-transparent backdrop-blur-sm"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <MotionLogo variant="light" size="lg" />
            </div>
            <p className="text-indigo-200 text-sm leading-relaxed mb-6 max-w-sm">
              {t.tagline}
            </p>
            
            {/* Social media links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-indigo-300 hover:text-white hover:bg-gradient-to-br hover:from-pink-500/30 hover:to-purple-600/30 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-indigo-300 hover:text-white hover:bg-gradient-to-br hover:from-pink-500/30 hover:to-purple-600/30 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-indigo-300 hover:text-white hover:bg-gradient-to-br hover:from-pink-500/30 hover:to-purple-600/30 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Product section */}
          <div>
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-6">
              {t.product}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#product-explanation" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
                  {t.platform}
                </a>
              </li>
              <li>
                <Link to="/maturity-calculator" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
                  {t.calculator}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
                  {t.dashboard}
                </Link>
              </li>
              <li>
                <Link to="/agents" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
                  {t.agentsGallery}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Access section */}
          <div>
            <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300 mb-6">
              {t.resources}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
                  {t.login}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
                  {t.admin}
                </Link>
              </li>
              <li>
                <a href="#access" className="text-indigo-200 hover:text-white transition-colors duration-200 text-sm">
                  {t.waitlist}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider with gradient */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mb-8"></div>
        
        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-indigo-300 text-sm mb-4 md:mb-0">
            {t.copyright}
          </div>
          
          {/* Legal links */}
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-indigo-300 hover:text-white transition-colors duration-200">
              {t.privacyPolicy}
            </a>
            <a href="#" className="text-indigo-300 hover:text-white transition-colors duration-200">
              {t.termsOfService}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
