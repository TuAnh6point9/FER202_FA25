import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MovieManager from './pages/MovieManager';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Route mặc định chuyển hướng đến login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Route login - public */}
            <Route path="/login" element={<LoginForm />} />
            
            {/* Route movies - protected */}
            <Route 
              path="/movies" 
              element={
                <ProtectedRoute>
                  <MovieManager />
                </ProtectedRoute>
              } 
            />
            
            {/* Route không tồn tại */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;


