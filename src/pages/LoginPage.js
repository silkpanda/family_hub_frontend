import React from 'react';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    // This logic correctly builds the full URL for the backend authentication route.
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Family Hub</h1>
        <p className="text-gray-600 mb-8">Sign in with your Google account to continue.</p>
        <button 
          onClick={handleGoogleLogin} 
          className="w-full inline-flex justify-center items-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/>
            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/>
            <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.907 13.925 58.602l42.356-32.782"/>
            <path fill="#EB4335" d="M130.55 50.479c19.205 0 36.425 6.283 50.286 19.688l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.356 32.782c10.445-31.477 39.746-54.25 74.269-54.25"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

// This line was missing, causing the error.
export default LoginPage;
