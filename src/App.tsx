import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Investors from '@/pages/Investors';
import InvestorDetails from '@/pages/InvestorDetails';
import Funds from '@/pages/Funds';
import LandingPage from '@/pages/LandingPage';
import Opportunities from '@/pages/Opportunities';
import Leads from '@/pages/Leads';
import Layout from '@/components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/investors/:id" element={<InvestorDetails />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/leads" element={<Leads />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
