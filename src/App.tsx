import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SignupPage from './pages/Signuppage';
import NewProject from './pages/NewProject';
import MyProjects from './pages/MyProjects';
import About from './pages/About';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

function App() {
  try {
    return (
      <HelmetProvider>
        <SubscriptionProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/new-project" element={<NewProject />} />
                  <Route path="/my-projects" element={<MyProjects />} />
                  <Route path="/project/:id" element={<MyProjects />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/analytics" element={<Dashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SubscriptionProvider>
      </HelmetProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <div>Error: {error.message}</div>;
  }
}

export default App;