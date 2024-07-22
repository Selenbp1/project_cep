import React, { useState } from 'react';
import { Container, TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css'; 
import { login } from '../../services/loginService';
import useAuth from '../../hooks/useAuth';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: setToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(username, password); 
      setToken(token);  // 사용자가 로그인하면 토큰을 저장
      onLogin(username);
      const lastPath = localStorage.getItem('lastPath') || '/home';
      navigate(lastPath);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="login-container">
        <Typography variant="h4" component="h1" className="login-title" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error" className="error-alert">{error}</Alert>}
        <form onSubmit={handleSubmit} className="login-form">
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
          <Box className="form-button">
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
