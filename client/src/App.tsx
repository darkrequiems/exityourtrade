import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';

// Loading component
import LoadingSpinner from './components/ui/LoadingSpinner';

// Public pages (lazy loaded)
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage'));
const VerifyEmailPage = React.lazy(() => import('./pages/auth/VerifyEmailPage'));

// Private pages (lazy loaded)
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const StrategiesPage = React.lazy(() => import('./pages/StrategiesPage'));
const CreateStrategyPage = React.lazy(() => import('./pages/CreateStrategyPage'));
const EditStrategyPage = React.lazy(() => import('./pages/EditStrategyPage'));
const AlertsPage = React.lazy(() => import('./pages/AlertsPage'));
const TradesPage = React.lazy(() => import('./pages/TradesPage'));
const PortfolioPage = React.lazy(() => import('./pages/PortfolioPage'));
const MarketPage = React.lazy(() => import('./pages/MarketPage'));
const SocialPage = React.lazy(() => import('./pages/SocialPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'));

// Error pages
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const ErrorPage = React.lazy(() => import('./pages/ErrorPage'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <PublicLayout>
                  <LandingPage />
                </PublicLayout>
              </PublicRoute>
            }
          />
          
          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <PublicLayout>
                  <LoginPage />
                </PublicLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <PublicLayout>
                  <RegisterPage />
                </PublicLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <PublicLayout>
                  <ForgotPasswordPage />
                </PublicLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <PublicLayout>
                  <ResetPasswordPage />
                </PublicLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicLayout>
                <VerifyEmailPage />
              </PublicLayout>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <DashboardPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Strategy routes */}
          <Route
            path="/strategies"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <StrategiesPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/strategies/create"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <CreateStrategyPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/strategies/:id/edit"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <EditStrategyPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          {/* Trading routes */}
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <AlertsPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trades"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <TradesPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <PortfolioPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          {/* Market and Social routes */}
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <MarketPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/social"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <SocialPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          {/* User routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <ProfilePage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <SettingsPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <PrivateLayout>
                  <NotificationsPage />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          {/* Error routes */}
          <Route
            path="/error"
            element={
              <PublicLayout>
                <ErrorPage />
              </PublicLayout>
            }
          />
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFoundPage />
              </PublicLayout>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;