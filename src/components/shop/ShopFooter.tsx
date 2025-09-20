import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

interface ShopFooterProps {
  shopName: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export const ShopFooter: React.FC<ShopFooterProps> = ({
  shopName,
  contactEmail,
  contactPhone,
  address,
  socialLinks
}) => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {shopName}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Productos artesanales únicos, elaborados con la más alta calidad 
              y atención al detalle. Cada pieza cuenta una historia.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Contacto
            </h4>
            <div className="space-y-3">
              {contactEmail && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{contactEmail}</span>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{contactPhone}</span>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Enlaces
            </h4>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Términos y Condiciones
              </a>
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Devoluciones
              </a>
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Envíos
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2024 {shopName}. Todos los derechos reservados.
          </p>
          
          {/* Social Links */}
          {socialLinks && (
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              {socialLinks.instagram && (
                <a 
                  href={socialLinks.instagram} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialLinks.facebook && (
                <a 
                  href={socialLinks.facebook} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a 
                  href={socialLinks.twitter} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};