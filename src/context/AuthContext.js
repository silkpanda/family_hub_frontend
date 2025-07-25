import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // You may need to install this: npm install jwt-decode

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Start in a loading state

  useEffect(() => {
    // Check for a token in localStorage on initial app load
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        // Check if the token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setIsAuthenticated(true);
        } else {
          // Token is expired, remove it
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error("Error processing token on initial load", error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false); // Finished loading
    }
  }, []);

  const login = useCallback((token) => {
    try {
      localStorage.setItem('authToken', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
    } catch (error) {
        console.error("Failed to login", error);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const contextValue = { user, isAuthenticated, loading, login, logout };

  // CORRECTED: Always render children. The consumer of the context
  // will decide what to show based on the 'loading' state.
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
