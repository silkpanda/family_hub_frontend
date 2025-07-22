import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const userId = searchParams.get('userId');
        if (userId) {
            localStorage.setItem('userId', userId); // Store user ID
            console.log('User logged in with ID:', userId);
            // Optionally, trigger an initial sync from Google Calendar here
            // await api.get('/calendar/sync-from-google');
            navigate('/dashboard'); // Redirect to dashboard
        } else {
            console.error('No user ID found in URL params.');
            navigate('/'); // Redirect to login if no ID
        }
    }, [navigate, searchParams]);

    return (
        <div style={styles.container}>
            <h2>Authentication Successful!</h2>
            <p>Redirecting to your dashboard...</p>
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
};

export default AuthSuccessPage;
