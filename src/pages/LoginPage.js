// ===================================================================================
// File: /src/pages/LoginPage.js
// Purpose: The public-facing login page. It provides a single button for users to
// initiate the Google OAuth 2.0 authentication flow by redirecting them to the
// backend's Google authentication endpoint.
// ===================================================================================
import React from 'react';

const LoginPage = () => {
  // This handler redirects the user to the backend's Google auth route.
  const handleGoogleLogin = () => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  // Note: This component uses Tailwind CSS classes for styling, which is
  // inconsistent with the rest of the application's theme-based inline styles.
  // This should be refactored for consistency.
  return (
    <div style={{minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{maxWidth: '28rem', width: '100%', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center'}}>
        <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem'}}>Welcome to Family Hub</h1>
        <p style={{color: '#4B5563', marginBottom: '2rem'}}>Sign in with your Google account to continue.</p>
        <button 
          onClick={handleGoogleLogin} 
          style={{
            width: '100%', 
            display: 'inline-flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '0.75rem 1.25rem', 
            border: '1px solid transparent', 
            fontSize: '1rem', 
            fontWeight: '500', 
            borderRadius: '0.375rem', 
            color: 'white', 
            backgroundColor: '#2563EB', 
            cursor: 'pointer'
          }}
        >
          <svg style={{width: '1.25rem', height: '1.25rem', marginRight: '0.75rem'}} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262"><path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.907 13.925 58.602l42.356-32.782"/><path fill="#EB4335" d="M130.55 50.479c19.205 0 36.425 6.283 50.286 19.688l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.356 32.782c10.445-31.477 39.746-54.25 74.269-54.25"/></svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
