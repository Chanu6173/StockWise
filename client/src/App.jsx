import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Layout imports
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Page imports
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PortfolioPage from './pages/PortfolioPage';
import WatchlistPage from './pages/WatchlistPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import StockDetailsPage from './pages/StockDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Guest authentication routes */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Private protected portfolio routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="watchlist" element={<WatchlistPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="stock/:symbol" element={<StockDetailsPage />} />
            </Route>
          </Route>

          {/* Fallback 404 Route */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        {/* Global Toast Alerts */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1F1E1D',
              border: '1px solid #E5E2DA',
              borderRadius: '10px',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(31, 30, 29, 0.10)',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
