/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { DashboardLayout } from "./layouts/DashboardLayout";

// Lazy loading pages might be better but for this demo I'll just import them
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import MahasiswaDashboard from "./pages/MahasiswaDashboard";
import DosenDashboard from "./pages/DosenDashboard";

function RootRoute() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-8 border-black border-t-neon-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LandingPage />;

  if (user && !profile && !loading) {
    // If user is logged in but has no profile, they likely need to complete registration
    // We allow them to be on the register page to finish setting up their role
    return <Navigate to="/register" replace />;
  }

  if (profile?.role === "dosen") {
    return <Navigate to="/dosen" replace />;
  }

  return <Navigate to="/mahasiswa" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          
          <Route element={<DashboardLayout />}>
            <Route path="/mahasiswa" element={<MahasiswaDashboard />} />
            <Route path="/dosen" element={<DosenDashboard />} />
            <Route path="/profile" element={<MahasiswaDashboard />} /> 
            <Route path="/dosen/management" element={<DosenDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

