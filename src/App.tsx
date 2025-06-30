import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/Auth/AuthForm';
import { NewsAnchorInterface } from './components/NewsAnchor/NewsAnchorInterface';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-sci-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-sci-cyan/30 border-t-sci-cyan rounded-full animate-spin"></div>
          <div className="text-sci-white text-xl font-poppins">Loading Intellect...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-sci-black">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            path="/auth" 
            element={
              user ? <Navigate to="/app" replace /> : <AuthForm onSuccess={() => {}} />
            } 
          />
          <Route 
            path="/app" 
            element={
              user ? <NewsAnchorInterface /> : <Navigate to="/auth" replace />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;