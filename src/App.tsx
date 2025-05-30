
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import AgentManager from './pages/AgentManager';
import AgentDetails from './pages/AgentDetails';
import MaturityCalculator from './pages/MaturityCalculator';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import OnePager from './pages/OnePager';
import TwoPager from './pages/TwoPager';
import ThreePager from './pages/ThreePager';
import AgentsGallery from './pages/AgentsGallery';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              {/* Legacy dashboard route for backward compatibility */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              {/* New dashboard routes */}
              <Route 
                path="/dashboard/home" 
                element={
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/agents" 
                element={
                  <ProtectedRoute>
                    <AgentManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/agent/:agentId" 
                element={
                  <ProtectedRoute>
                    <AgentDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maturity-calculator" 
                element={
                  <ProtectedRoute>
                    <MaturityCalculator />
                  </ProtectedRoute>
                } 
              />
              <Route path="/agents" element={<AgentsGallery />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/one-pager" element={<OnePager />} />
              <Route path="/two-pager" element={<TwoPager />} />
              <Route path="/three-pager" element={<ThreePager />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
