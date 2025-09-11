import React from 'react';

const LoginPage = () => {
    // --- THIS IS THE FIX ---
    // Read the backend URL from the environment variables.
    // This ensures that the login button points to the correct server
    // whether you are in local development or in production on Netlify.
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

    // Construct the full, absolute URL for the Google login endpoint.
    const googleLoginUrl = `${backendUrl}/auth/google`;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to FamiliFlow</h1>
                <p className="text-gray-600 mb-8">The all-in-one app to manage your household.</p>

                {/* The login button now uses the correct, full URL */}
                <a
                    href={googleLoginUrl}
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                >
                    <svg className="w-5 h-5 mr-3" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 398.5 0 256S111.8 0 244 0c69.8 0 133 28.2 178.5 74.5L372.3 125.1C339.6 96.6 295.3 80 244 80c-81.8 0-148.2 67.2-148.2 149.3s66.4 149.3 148.2 149.3c58.2 0 105.8-39.7 119.8-93.7H244v-75h244.5c1.2 6.7 2.1 13.5 2.5 20.4z"></path>
                    </svg>
                    Sign In with Google
                </a>
            </div>
        </div>
    );
};

export default LoginPage;
