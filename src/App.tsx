
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useSecurityHeaders } from '@/hooks/useSecurityHeaders';

import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { BypassProtectedRoute } from '@/components/auth/BypassProtectedRoute';
import Index from './pages/Index';

import DashboardHome from './pages/DashboardHome';
import AgentManager from './pages/AgentManager';
import AgentDetails from './pages/AgentDetails';
import MaturityCalculator from './pages/MaturityCalculator';
import UserProgress from './pages/UserProgress';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import TasksDashboard from './pages/TasksDashboard';
import MasterCoordinatorChat from './pages/MasterCoordinatorChat';
import OnePager from './pages/OnePager';
import TwoPager from './pages/TwoPager';
import ThreePager from './pages/ThreePager';
import AgentsGallery from './pages/AgentsGallery';
import Profile from './pages/Profile';
import { BiomeConfigPage } from './pages/BiomeConfigPage';
import { ArtisanDashboardPage } from './pages/ArtisanDashboardPage';
import { CreateShopPage } from './pages/CreateShopPage';
import { PublicShopPage } from './pages/PublicShopPage';
import { PublicProductPage } from './pages/PublicProductPage';
import { ShopDirectoryPage } from './pages/ShopDirectoryPage';

function App() {
  // Apply security headers
  useSecurityHeaders();
  
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <div className="min-h-screen">
                <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Public shop routes */}
              <Route path="/tiendas" element={<ShopDirectoryPage />} />
              <Route path="/tienda/:shopSlug" element={<PublicShopPage />} />
              <Route path="/tienda/:shopSlug/producto/:productId" element={<PublicProductPage />} />
              {/* Main dashboard route - Master Coordinator as entry point */}
              <Route 
                path="/dashboard" 
                element={
                  <BypassProtectedRoute>
                    <DashboardHome />
                  </BypassProtectedRoute>
                } 
              />
              {/* Legacy home route for backward compatibility */}
              <Route 
                path="/dashboard/home" 
                element={
                  <BypassProtectedRoute>
                    <DashboardHome />
                  </BypassProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/agents" 
                element={
                  <BypassProtectedRoute>
                    <AgentManager />
                  </BypassProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/agent/master-coordinator" 
                element={
                  <BypassProtectedRoute>
                    <MasterCoordinatorChat />
                  </BypassProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/agent/:agentId" 
                element={
                  <BypassProtectedRoute>
                    <AgentDetails />
                  </BypassProtectedRoute>
                } 
              />
              {/* Legacy agent details route - redirect to new route */}
              <Route 
                path="/agent-details/:agentId" 
                element={
                  <BypassProtectedRoute>
                    <AgentDetails />
                  </BypassProtectedRoute>
                } 
              />
              <Route 
                path="/maturity-calculator" 
                element={
                  <BypassProtectedRoute>
                    <MaturityCalculator />
                  </BypassProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <BypassProtectedRoute>
                    <Profile />
                  </BypassProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/progress" 
                element={
                  <BypassProtectedRoute>
                    <UserProgress />
                  </BypassProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/tasks" 
                element={
                  <BypassProtectedRoute>
                    <TasksDashboard />
                  </BypassProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/artisan" 
                element={
                  <BypassProtectedRoute>
                    <ArtisanDashboardPage />
                  </BypassProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/create-shop" 
                element={
                  <BypassProtectedRoute>
                    <CreateShopPage />
                  </BypassProtectedRoute>
                } 
              />
              <Route path="/agents" element={<AgentsGallery />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/biome-config" element={<BiomeConfigPage />} />
              <Route path="/one-pager" element={<OnePager />} />
              <Route path="/two-pager" element={<TwoPager />} />
              <Route path="/three-pager" element={<ThreePager />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
