
import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isDark, setIsDark] = useState(true);
  
  useEffect(() => {
    // Determine if the current route has a dark background
    // By default, assume dark background (main landing pages have dark backgrounds)
    const path = window.location.pathname;
    
    // Dashboard, admin pages, and other pages with light backgrounds
    const lightBackgroundPages = [
      '/dashboard',
      '/admin/dashboard',
    ];
    
    const hasDarkBackground = !lightBackgroundPages.some(route => 
      path === route || path.startsWith(`${route}/`)
    );
    
    setIsDark(hasDarkBackground);
    setTheme(hasDarkBackground ? 'dark' : 'light');
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsDark(newTheme === 'dark');
  };
  
  return { isDark, theme, toggleTheme };
};
