import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Assume you create this

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // A function in your context

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      login(token); // This function will save token to localStorage and update auth state
      navigate('/dashboard'); // Redirect to the main app page
    } else {
      // Handle error
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallbackPage;