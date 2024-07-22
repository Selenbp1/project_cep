import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setIsAuthenticated(true);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setToken(null);
  };

  return { isAuthenticated, token, login, logout };
};

export default useAuth;
