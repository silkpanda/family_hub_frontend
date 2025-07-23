import React from 'react';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    // Redirect to the backend's Google auth endpoint
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <div>
      <h1>Welcome to the Family Hub</h1>
      <p>Sign in to continue</p>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default LoginPage;