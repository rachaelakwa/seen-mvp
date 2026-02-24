import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext.jsx';
import { TutorialProvider } from '../context/TutorialContext.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { SignupPage } from '../pages/auth/SignupPage.jsx';
import OnboardingPage from '../pages/OnboardingPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import MainLayout from '../layout/MainLayout.jsx';
import AppShell from '../layout/AppShell';
import LandingPage from '../pages/LandingPage.jsx';

function LandingOrRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/mood" replace /> : <LandingPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TutorialProvider>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingOrRedirect />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Onboarding Route */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* Profile Route with Sidebar */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* App Tab Routes with Sidebar */}
          <Route
            path="/mood"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AppShell />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/circles"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AppShell />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vibeshelf"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AppShell />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </TutorialProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
