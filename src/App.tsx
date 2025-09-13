
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NotificationContainer } from '@/components/EnhancedNotifications';
import { useSecurityHeaders } from '@/hooks/useSecurityHeaders';


import { LanguageProvider } from '@/context/LanguageContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Index from './pages/Index';

import DashboardHome from './pages/DashboardHome';

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
import { CreateShopLandingPage } from './pages/CreateShopLandingPage';
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
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                } 
              />
              {/* Legacy home route for backward compatibility */}
              <Route 
                path="/dashboard/home" 
                element={
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/agent/master-coordinator" 
                element={
                  <ProtectedRoute>
                    <MasterCoordinatorChat />
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
              {/* Legacy agent details route - redirect to new route */}
              <Route 
                path="/agent-details/:agentId" 
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
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/progress" 
                element={
                  <ProtectedRoute>
                    <UserProgress />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/tasks" 
                element={
                  <ProtectedRoute>
                    <TasksDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/artisan" 
                element={
                  <ProtectedRoute>
                    <ArtisanDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/create-shop" 
                element={
                  <ProtectedRoute>
                    <CreateShopPage />
                  </ProtectedRoute>
                } 
              />
              {/* Standalone Shop Creation Landing Page */}
              <Route path="/crear-tienda" element={<CreateShopLandingPage />} />
              <Route path="/agents" element={<AgentsGallery />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/biome-config" element={<BiomeConfigPage />} />
              <Route path="/one-pager" element={<OnePager />} />
              <Route path="/two-pager" element={<TwoPager />} />
              <Route path="/three-pager" element={<ThreePager />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
              <NotificationContainer />
          </LanguageProvider>
      </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
