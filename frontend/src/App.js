import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import API from './api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoDashboard from './pages/TodoDashboard';
import UserManagement from './pages/UserManagement';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/users/profile');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <LoginPage onLogin={login} /> : <Navigate to="/todos" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <RegisterPage onLogin={login} /> : <Navigate to="/todos" />} 
          />
          <Route 
            path="/todos" 
            element={user ? <TodoDashboard user={user} onLogout={logout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/users" 
            element={
              user && (user.role === 'Admin' || user.role === 'Super Admin') ? 
                <UserManagement user={user} onLogout={logout} /> : 
                <Navigate to="/todos" />
            } 
          />
          <Route path="/" element={<Navigate to="/todos" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;