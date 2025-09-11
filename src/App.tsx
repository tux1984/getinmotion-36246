
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/toaster';

import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen">
          <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
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
                path="/dashboard/agents" 
                element={
                  <ProtectedRoute>
                    <AgentManager />
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
  );
}

export default App;
