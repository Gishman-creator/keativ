import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Login,
  Register,
  EmailVerification,
  VerificationPending,
  ForgotPassword,
} from '@/pages/auth';

// VerificationPending doubles as the resend-verification page in this legacy router
const ResendVerification = VerificationPending;

const Dashboard = () => <div>Dashboard - Welcome!</div>;

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Public Route wrapper (redirect if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email/:token"
        element={
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        }
      />
      <Route
        path="/verification-pending"
        element={
          <PublicRoute>
            <VerificationPending />
          </PublicRoute>
        }
      />
      <Route
        path="/resend-verification"
        element={
          <PublicRoute>
            <ResendVerification/>
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
