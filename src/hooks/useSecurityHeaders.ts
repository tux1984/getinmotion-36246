import { useEffect } from 'react';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Set security headers via meta tags for client-side
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[http-equiv="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.httpEquiv = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Content Security Policy
    setMetaTag('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ylooqmqmoufqtxvetxuj.supabase.co https://ce8310d2-4cb9-4865-a8e3-9274d5cd98f4.sandbox.lovable.dev blob:; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://ylooqmqmoufqtxvetxuj.supabase.co https://api.openai.com wss://ylooqmqmoufqtxvetxuj.supabase.co; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
    );

    // X-Frame-Options
    setMetaTag('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    setMetaTag('X-Content-Type-Options', 'nosniff');

    // Referrer Policy
    setMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy
    setMetaTag('Permissions-Policy', 
      'geolocation=(), microphone=(), camera=(), payment=(), usb=(), ' +
      'magnetometer=(), gyroscope=(), accelerometer=()'
    );

  }, []);
};