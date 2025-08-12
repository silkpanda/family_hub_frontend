// --- File: /frontend/src/pages/AuthCallbackPage.js ---
// Handles the callback from Google OAuth, extracts the token, and logs the user in.

import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  // useEffect: On component mount, get the token from the URL and log in.
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token);
    } else {
      navigate('/login'); // Redirect to login if no token is found.
    }
  }, [searchParams, login, navigate]);

  // useEffect: Once authenticated, navigate to the main dashboard.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Processing login...</p></div>;
};
export default AuthCallbackPage;