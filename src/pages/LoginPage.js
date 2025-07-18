import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../api/axiosConfig';

function LoginPage() {
    const [authUrl, setAuthUrl] = useState('');

    useEffect(() => {
        const fetchAuthUrl = async () => {
            try {
                const response = await api.get('/auth/google');
                setAuthUrl(response.data.authUrl);
            } catch (error) {
                console.error('Error fetching Google auth URL:', error);
            }
        };
        fetchAuthUrl();
    }, []);

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            // Redirect user to Google's auth URL. The backend handles the callback.
            window.location.href = authUrl;
        },
        onError: () => {
            console.log('Login Failed');
        },
        flow: 'auth-code', // Use auth-code flow for backend verification
        redirect_uri: process.env.REACT_APP_BACKEND_URL.replace('/api', '') + '/auth/google/callback', // Match backend redirect URI
    });

    return (
        <div style={styles.container}>
            <h2>Welcome to Family Calendar App</h2>
            <p>Please log in with your Google Account to continue.</p>
            {authUrl ? (
                <button onClick={() => login()} style={styles.googleButton}>
                    Sign in with Google
                </button>
            ) : (
                <p>Loading Google Login...</p>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        fontFamily: 'Arial, sans-serif',
    },
    googleButton: {
        backgroundColor: '#4285F4',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
};

export default LoginPage;