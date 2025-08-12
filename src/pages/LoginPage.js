// --- File: /frontend/src/pages/LoginPage.js ---
// A simple login page that initiates the Google OAuth flow.

import React from 'react';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    window.location.href = `${apiUrl}/auth/google`;
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1>Welcome to Family Hub</h1>
        <p>Sign in with your Google account to continue.</p>
        <button onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
export default LoginPage;