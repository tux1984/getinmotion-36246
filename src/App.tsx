import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/context/LanguageContext';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import OnePager from '@/pages/OnePager';
import TwoPager from '@/pages/TwoPager';
import ThreePager from '@/pages/ThreePager';
import AIAgent from '@/pages/AIAgent';
import Admin from '@/pages/Admin';
import { Toaster } from '@/components/ui/toaster';
import MaturityCalculator from '@/pages/MaturityCalculator';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/maturity-calculator" element={<MaturityCalculator />} />
          <Route path="/onepager" element={<OnePager />} />
          <Route path="/twopager" element={<TwoPager />} />
          <Route path="/threepager" element={<ThreePager />} />
          <Route path="/ai" element={<AIAgent />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
