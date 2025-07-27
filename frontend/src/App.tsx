import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LegalAdvisor from './pages/LegalAdvisor';
import AppealGenerator from './pages/AppealGenerator';
import SupportDirectory from './pages/SupportDirectory';
import CaseStories from './pages/CaseStories';
import StoryWall from './pages/StoryWall';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-responsive-md">
          <div className="loading-spinner w-12 h-12 mx-auto"></div>
          <p className="text-responsive-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Main App Content
const AppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="pt-16 lg:pt-20">

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />

            {/* Protected Routes - Require Authentication (for all users) */}
            <Route
              path="/legal-advisor"
              element={
                <ProtectedRoute>
                  {isAdmin ? <Navigate to="/admin" replace /> : <LegalAdvisor />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/appeal-generator"
              element={
                <ProtectedRoute>
                  {isAdmin ? <Navigate to="/admin" replace /> : <AppealGenerator />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/story-wall"
              element={
                <ProtectedRoute>
                  {isAdmin ? <Navigate to="/admin" replace /> : <StoryWall />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-dashboard"
              element={
                <ProtectedRoute>
                  {isAdmin ? <Navigate to="/admin" replace /> : <UserDashboard />}
                </ProtectedRoute>
              }
            />

            {/* Admin Routes - Require Admin Role */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Public Routes (but with different content for authenticated users) */}
            <Route path="/case-stories" element={<CaseStories />} />
            <Route path="/support-directory" element={<SupportDirectory />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Main App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
