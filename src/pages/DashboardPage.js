import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Make sure this CSS file exists and is correctly linked

function Dashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            const token = getToken();

            if (!token) {
                // If no token, redirect to login. This handles unauthenticated access.
                navigate('/');
                return;
            }

            try {
                // Fetch summary data from your backend
                const response = await fetch(`${backendUrl}/api/households/summary`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Send JWT for authentication
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                    console.log('Dashboard data fetched:', data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to load dashboard data.');
                    console.error('Failed to fetch dashboard data:', errorData);

                    // Specific handling for users without a household
                    if (response.status === 404 && errorData.message === 'User does not belong to a primary household. Please complete onboarding.') {
                        alert('You do not belong to a household. Please create or join one.');
                        navigate('/onboarding'); // Redirect to onboarding
                    } else if (response.status === 401) {
                         // Token might be invalid or expired, force re-login
                        alert('Your session has expired or is invalid. Please log in again.');
                        localStorage.removeItem('token'); // Clear old token
                        navigate('/');
                    }
                }
            } catch (err) {
                // Handle network errors (e.g., backend server down, no internet)
                setError('Network error while fetching dashboard data. Please check your connection or try again later.');
                console.error('Network error:', err);
            } finally {
                setLoading(false); // Always set loading to false after fetch attempt
            }
        };

        fetchDashboardData();
    }, [backendUrl, navigate]); // Dependencies: re-run if backendUrl or navigate function changes

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.5em' }}>
                Loading Dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'red', fontSize: '1.2em' }}>
                <h2>Error Loading Dashboard</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Go to Login
                </button>
            </div>
        );
    }

    if (!dashboardData) {
        // This case should ideally be caught by the error handling, but as a fallback
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2em' }}>
                No dashboard data available. Please try logging in again.
            </div>
        );
    }

    const { household, mealsToday, members } = dashboardData;

    return (
        <div className="dashboard-container">
            <h1>{household.name} Dashboard - Today's Summary</h1>

            {/* Meal Bar */}
            <div className="meal-bar">
                <span>Breakfast: {mealsToday.Breakfast || 'Not set'}</span>
                <span>Lunch: {mealsToday.Lunch || 'Not set'}</span>
                <span>Dinner: {mealsToday.Dinner || 'Not set'}</span>
            </div>

            {/* Member Columns (Responsive Layout) */}
            <div className="members-grid">
                {members.map(member => (
                    <div key={member._id} className="member-column" style={{ backgroundColor: `${member.assignedColor}40` }}>
                        <div className="member-header">
                            {/* Display member's profile picture or a fallback */}
                            <img
                                src={member.profilePicture || `https://placehold.co/60x60/${member.assignedColor.substring(1)}/ffffff?text=${member.firstName.charAt(0).toUpperCase()}`}
                                alt={member.firstName}
                                className="member-avatar"
                            />
                            <h3>{member.firstName}</h3>
                        </div>
                        <div className="member-events">
                            <h4>Today's Events:</h4>
                            {member.events && member.events.length > 0 ? (
                                <ul>
                                    {member.events.map(event => (
                                        <li key={event.id} className={event.isImportant ? 'important-event' : ''}>
                                            <strong>{event.summary}</strong>
                                            <br />
                                            <small>
                                                {/* Format start and end times */}
                                                {new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {new Date(event.end.dateTime || event.end.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </small>
                                            {event.isImportant && <span className="important-tag"> (Important)</span>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No events today!</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Log Out Button */}
            <button
                onClick={() => {
                    localStorage.removeItem('token'); // Clear the JWT
                    navigate('/'); // Redirect to login page
                }}
                style={{
                    marginTop: '40px',
                    padding: '12px 25px',
                    backgroundColor: '#dc3545', /* Red for danger/logout */
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    transition: 'background-color 0.2s ease',
                }}
            >
                Log Out
            </button>
        </div>
    );
}

export default Dashboard; // This is the default export that Netlify is looking for