import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './components/Layout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { WalletsPage } from './pages/WalletsPage';
import { LoansDuesPage } from './pages/LoansDuesPage';
import { AutopaysPage } from './pages/AutopaysPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Onboarding } from './pages/Onboarding';
import { SignInPage } from './pages/SignInPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();
  const { user } = useApp();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><p className="text-slate-500 dark:text-slate-400">Loading...</p></div>;
  }

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  if (!user.isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();
  const { user } = useApp();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><p className="text-slate-500 dark:text-slate-400">Loading...</p></div>;
  }

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  if (user.isOnboarded) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();
  const { user } = useApp();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><p className="text-slate-500 dark:text-slate-400">Loading...</p></div>;
  }

  if (session) {
    if (user.isOnboarded) {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<AuthRoute><SignInPage /></AuthRoute>} />
        
        <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
        
        {/* Protected Dashboard Routes - Using MainLayout */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
              <Route path="/wallets" element={<ProtectedRoute><WalletsPage /></ProtectedRoute>} />
              <Route path="/loans" element={<ProtectedRoute><LoansDuesPage /></ProtectedRoute>} />
              <Route path="/autopays" element={<ProtectedRoute><AutopaysPage /></ProtectedRoute>} />
              <Route path="/budgets" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
