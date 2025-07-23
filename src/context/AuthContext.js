import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // You may need to install this: npm install jwt-decode

// Create the context with a default shape to prevent render errors.
// This is the fix for the blank screen issue.
export const AuthContext = createContext({
  token: null,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      if (token) {
        // Decode the token to get user information (id, displayName, etc.)
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      }
    } catch (error) {
      // If token is invalid or expired, clear it
      console.error("Invalid token:", error);
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    // You might want to redirect the user to the login page here
    window.location.href = '/login';
  };

  const contextValue = {
    token,
    user,
    loading,
    login,
    logout,
  };

  // We don't render the rest of the app until we've checked for the token
  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
