import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline, Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import CodeManage from './components/Code/CodeManage';
import UserManage from './components/User/UserManage';
import EquipmentManage from './components/Equipment/EquipmentManage';
import MonitorManage from './components/Monitor/MonitorManage';
import RuleManage from './components/Rule/RuleManage';
import RuleResultList from './components/Rule/RuleResultList';
import './styles/App.css'; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (storedLoggedInStatus === 'true') {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isLoggedIn) {
        localStorage.setItem('lastPath', window.location.pathname);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isLoggedIn]);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('lastPath');
  };

  return (
    <Router>
      <CssBaseline />
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        {isLoggedIn && <Sidebar isLoggedIn={isLoggedIn} username={username} />}
        <Container component="main" sx={{ mt: 3, width: '100%' }}>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={<Navigate to={isLoggedIn ? localStorage.getItem('lastPath') || '/home' : '/login'} />} />

            <Route path="/monitor" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <MonitorManage />
              </ProtectedRoute>
            } />

            <Route path="/rules" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <RuleManage />
              </ProtectedRoute>
            } />

            <Route path="/rules/results" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <RuleResultList />
              </ProtectedRoute>
            } />

            <Route path="/equipments" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <EquipmentManage />
              </ProtectedRoute>
            } />

            <Route path="/codes" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CodeManage />
              </ProtectedRoute>
            } />

            <Route path="/users" element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <UserManage />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to={isLoggedIn ? localStorage.getItem('lastPath') || '/home' : '/login'} />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;
