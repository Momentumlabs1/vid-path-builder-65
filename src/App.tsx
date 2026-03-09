import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";

// Public Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FunnelViewer from "./pages/FunnelViewer";
import EmbedViewer from "./pages/EmbedViewer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Customer App Pages
import AppLayout from "./pages/app/AppLayout";
import AppDashboard from "./pages/app/AppDashboard";
import AppFunnels from "./pages/app/AppFunnels";
import AppBuilder from "./pages/app/AppBuilder";
import AppAnalytics from "./pages/app/AppAnalytics";
import AppSettings from "./pages/app/AppSettings";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import FunnelBuilderPage from "./pages/FunnelBuilder";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/funnel/:funnelId" element={<FunnelViewer />} />
            <Route path="/embed/:funnelId" element={<EmbedViewer />} />

            {/* Customer App routes */}
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app" element={<AppLayout />}>
              <Route path="dashboard" element={<AppDashboard />} />
              <Route path="funnels" element={<AppFunnels />} />
              <Route path="builder" element={<AppBuilder />} />
              <Route path="builder/:funnelId" element={<AppBuilder />} />
              <Route path="analytics" element={<AppAnalytics />} />
              <Route path="settings" element={<AppSettings />} />
            </Route>

            {/* Legacy Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/builder" element={<FunnelBuilderPage />} />
            <Route path="/admin/leads" element={<AdminDashboard />} />
            <Route path="/client/:funnelName" element={<ClientDashboard />} />

            {/* Redirect old top-level routes to admin for backwards compatibility */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/builder" element={<Navigate to="/admin/builder" replace />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
