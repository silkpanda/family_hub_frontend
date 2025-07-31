// ===================================================================================
// File: /src/pages/AuthCallbackPage.js
// Purpose: This page is the destination after a user successfully authenticates with
// an external provider (like Google). It extracts the JWT from the URL query
// parameters, uses the AuthContext to log the user in, and then redirects them
// to the main application.
// ===================================================================================
import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams(); // Hook to read URL query parameters.
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  // This effect runs when the page loads to process the token.
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // If a token is found, call the login function from AuthContext.
      login(token);
    } else {
      // If no token is present, something went wrong, so redirect to login.
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  // This effect runs after the login state has been updated.
  useEffect(() => {
    // Once authenticated, redirect the user to the application's home page.
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Display a simple loading message while the process completes.
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Processing login...</p>
    </div>
  );
};

export default AuthCallbackPage;