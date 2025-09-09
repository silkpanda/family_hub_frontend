import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { session, loading } = useContext(AuthContext);

    // While the session is being verified, it's good practice to show a loading state
    // This prevents a brief flash of the login page when a logged-in user refreshes a private page
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl text-gray-600">Loading...</p>
            </div>
        );
    }

    // If the session is not loading and a user is logged in, render the requested page
    // Otherwise, redirect them to the login page
    return session ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
