import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SignupPage from './pages/Signuppage';
import NewProject from './pages/NewProject';
import MyProjects from './pages/MyProjects';
import About from './pages/About';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Transform from './pages/Transform';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/signup" />;
  }
  
  return <>{children}</>;
};

function App() {
  try {
    return (
      <HelmetProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/signup/:plan" element={<SignupPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/transform"
                      element={
                        <ProtectedRoute>
                          <Transform />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/new-project"
                      element={
                        <ProtectedRoute>
                          <NewProject />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-projects"
                      element={
                        <ProtectedRoute>
                          <MyProjects />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/project/:id"
                      element={
                        <ProtectedRoute>
                          <MyProjects />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </SubscriptionProvider>
        </AuthProvider>
      </HelmetProvider>
    );
  } catch (error: any) {
    console.error('Error in App component:', error);
    return <div>Error: {error.message}</div>;
  }
}

export default App;