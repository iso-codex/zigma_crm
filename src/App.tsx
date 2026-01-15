import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Investors from '@/pages/Investors';
import InvestorDetails from '@/pages/InvestorDetails';
import Funds from '@/pages/Funds';
import LandingPage from '@/pages/LandingPage';
import Opportunities from '@/pages/Opportunities';
import Leads from '@/pages/Leads';
import InvestorPortal from '@/pages/InvestorPortal';
import AuthCallback from '@/pages/AuthCallback';
import UserManagement from '@/pages/UserManagement';
import Layout from '@/components/Layout';
import InvestorLayout from '@/components/InvestorLayout';
import { RoleBasedRoute } from '@/components/RoleBasedRoute';

function AppRoutes() {
  const { user, loading, getDefaultRoute } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect authenticated users away from public pages if they land there
  useEffect(() => {
    if (!loading && user && (location.pathname === '/' || location.pathname === '/login')) {
      navigate(getDefaultRoute(), { replace: true });
    }
  }, [user, loading, navigate, getDefaultRoute, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Admin & Staff Dashboard Routes */}
      <Route element={
        <RoleBasedRoute
          requiredPermission="viewAdminDashboard"
          redirectTo="/investor/dashboard"
        >
          <Layout />
        </RoleBasedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/investors" element={
          <RoleBasedRoute requiredPermission="viewInvestors">
            <Investors />
          </RoleBasedRoute>
        } />

        <Route path="/investors/:id" element={
          <RoleBasedRoute requiredPermission="viewInvestors">
            <InvestorDetails />
          </RoleBasedRoute>
        } />

        <Route path="/funds" element={
          <RoleBasedRoute requiredPermission="viewFunds">
            <Funds />
          </RoleBasedRoute>
        } />

        <Route path="/opportunities" element={
          <RoleBasedRoute requiredPermission="viewOpportunities">
            <Opportunities />
          </RoleBasedRoute>
        } />

        <Route path="/leads" element={
          <RoleBasedRoute requiredPermission="viewLeads">
            <Leads />
          </RoleBasedRoute>
        } />

        <Route path="/users" element={
          <RoleBasedRoute requiredPermission="manageUsers">
            <UserManagement />
          </RoleBasedRoute>
        } />
      </Route>

      {/* Investor Portal Routes */}
      <Route element={
        <RoleBasedRoute
          requiredPermission="viewInvestorPortal"
          redirectTo="/dashboard"
        >
          <InvestorLayout />
        </RoleBasedRoute>
      }>
        <Route path="/investor/dashboard" element={<InvestorPortal />} />
        <Route path="/investor/transactions" element={<InvestorPortal initialTab="transactions" />} />
        <Route path="/investor/documents" element={<InvestorPortal initialTab="documents" />} />
        <Route path="/investor/profile" element={<InvestorPortal initialTab="profile" />} />
      </Route>
    </Routes>
  );
}

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
