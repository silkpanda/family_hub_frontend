import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setIsAuthenticated(true);
        } else { logout(); }
      } catch (error) { logout(); }
    }
    setLoading(false);
    setIsReady(true);
  }, [logout]);

  const login = useCallback((token) => {
    localStorage.setItem('authToken', token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsAuthenticated(true);
  }, []);

  const value = { user, isAuthenticated, loading, isReady, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};