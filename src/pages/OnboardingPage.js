// ===================================================================================
// File: /src/pages/OnboardingPage.js
// Purpose: Guides a new user through the process of either creating a new family
// household or joining an existing one with an invite code. This is a critical step
// that must be completed before the user can access the main application features.
// ===================================================================================
import React, { useState, useContext } from 'react';
import { FamilyContext } from '../context/FamilyContext';

// A consistent set of colors for the user to choose from.
const GOOGLE_CALENDAR_COLORS = [
    { name: 'Blue', hex: '#039be5' }, { name: 'Lavender', hex: '#7986cb' }, { name: 'Sage', hex: '#33b679' },
    { name: 'Grape', hex: '#8e24aa' }, { name: 'Flamingo', hex: '#e67c73' }, { name: 'Banana', hex: '#f6c026' },
    { name: 'Tangerine', hex: '#f5511d' }, { name: 'Peacock', hex: '#009688' }, { name: 'Graphite', hex: '#616161' },
];

const OnboardingPage = () => {
    const { createFamily, joinFamily } = useContext(FamilyContext);
    const [view, setView] = useState('options'); // Controls which view is shown: 'options', 'create', or 'join'.
    const [familyName, setFamilyName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [userColor, setUserColor] = useState(GOOGLE_CALENDAR_COLORS[0].hex);
    const [error, setError] = useState('');

    const handleCreateFamily = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createFamily(familyName, userColor);
            // On success, the FamilyContext will update and the App's router will automatically navigate to the main app.
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create family.');
        }
    };

    const handleJoinFamily = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await joinFamily(inviteCode, userColor);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join family. Check the code.');
        }
    };
    
    /**
     * A sub-component for picking a user color.
     */
    const ColorPicker = () => (
        <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>Choose Your Color</label>
            <div style={{marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
                {GOOGLE_CALENDAR_COLORS.map(color => (
                    <button 
                        type="button" 
                        key={color.hex} 
                        onClick={() => setUserColor(color.hex)} 
                        style={{
                            height: '3rem', 
                            width: '3rem', 
                            borderRadius: '9999px', 
                            border: `2px solid ${userColor === color.hex ? '#3B82F6' : 'transparent'}`,
                            transform: `scale(${userColor === color.hex ? '1.1' : '1'})`,
                            backgroundColor: color.hex
                        }}
                        aria-label={`Select color ${color.name}`} 
                    />
                ))}
            </div>
        </div>
    );
    
    /**
     * Renders the content based on the current `view` state.
     */
    const renderContent = () => {
        const formStyle = { display: 'flex', flexDirection: 'column' };
        const inputStyle = { marginTop: '0.25rem', display: 'block', width: '100%', border: '1px solid #D1D5DB', padding: '0.5rem', borderRadius: '0.375rem' };
        const buttonStyle = { width: '100%', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem' };
        const backButtonStyle = { width: '100%', marginTop: '0.5rem', fontSize: '0.875rem', color: '#4B5563', textDecoration: 'underline' };

        switch (view) {
            case 'create':
                return (
                    <form onSubmit={handleCreateFamily} style={formStyle}>
                        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Create Your Household</h2>
                        <div style={{marginBottom: '1rem'}}>
                            <label htmlFor="familyName" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>Household Name</label>
                            <input type="text" id="familyName" value={familyName} onChange={(e) => setFamilyName(e.target.value)} required style={inputStyle} placeholder="e.g., The Smith Family"/>
                        </div>
                        <ColorPicker />
                        <button type="submit" style={{...buttonStyle, backgroundColor: '#2563EB'}}>Create Household</button>
                        <button type="button" onClick={() => setView('options')} style={backButtonStyle}>Back</button>
                    </form>
                );
            case 'join':
                return (
                    <form onSubmit={handleJoinFamily} style={formStyle}>
                        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>Join a Household</h2>
                        <div style={{marginBottom: '1rem'}}>
                            <label htmlFor="inviteCode" style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>Invite Code</label>
                            <input type="text" id="inviteCode" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required style={inputStyle} placeholder="Enter 6-digit code"/>
                        </div>
                        <ColorPicker />
                        <button type="submit" style={{...buttonStyle, backgroundColor: '#16A34A'}}>Join Household</button>
                        <button type="button" onClick={() => setView('options')} style={backButtonStyle}>Back</button>
                    </form>
                );
            default: // 'options' view
                return (
                    <div>
                        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>Welcome to Family Hub!</h2>
                        <p style={{marginBottom: '1.5rem', color: '#4B5563'}}>To get started, create a new household for your family or join one using an invite code.</p>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <button onClick={() => setView('create')} style={{...buttonStyle, backgroundColor: '#2563EB', padding: '0.75rem 1rem', fontSize: '1.125rem'}}>Create a Household</button>
                            <button onClick={() => setView('join')} style={{...buttonStyle, backgroundColor: '#16A34A', padding: '0.75rem 1rem', fontSize: '1.125rem'}}>Join a Household</button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{maxWidth: '28rem', width: '100%', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', borderRadius: '0.75rem', padding: '2rem'}}>
                {error && <p style={{color: '#EF4444', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}
                {renderContent()}
            </div>
        </div>
    );
};

export default OnboardingPage;