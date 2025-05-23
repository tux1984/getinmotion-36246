
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/LanguageContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import MaturityCalculator from './pages/MaturityCalculator';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import OnePager from './pages/OnePager';
import TwoPager from './pages/TwoPager';
import ThreePager from './pages/ThreePager';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/maturity-calculator" element={<MaturityCalculator />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/one-pager" element={<OnePager />} />
            <Route path="/two-pager" element={<TwoPager />} />
            <Route path="/three-pager" element={<ThreePager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
