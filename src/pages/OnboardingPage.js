// --- File: /frontend/src/pages/OnboardingPage.js ---
// Guides new users through creating or joining a family.

import React, { useState, useContext } from 'react';
import { FamilyContext } from '../context/FamilyContext';

const GOOGLE_CALENDAR_COLORS = [
    { name: 'Blue', hex: '#039be5' }, { name: 'Lavender', hex: '#7986cb' }, { name: 'Sage', hex: '#33b679' },
    { name: 'Grape', hex: '#8e24aa' }, { name: 'Flamingo', hex: '#e67c73' }, { name: 'Banana', hex: '#f6c026' },
    { name: 'Tangerine', hex: '#f5511d' }, { name: 'Peacock', hex: '#009688' }, { name: 'Graphite', hex: '#616161' },
];

const OnboardingPage = () => {
    const { actions } = useContext(FamilyContext);
    const { createFamily, joinFamily } = actions;
    const [view, setView] = useState('options'); // 'options', 'create', or 'join'
    const [familyName, setFamilyName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [userColor, setUserColor] = useState(GOOGLE_CALENDAR_COLORS[0].hex);
    const [error, setError] = useState('');

    const handleCreateFamily = async (e) => { 
        e.preventDefault(); 
        setError(''); 
        try { 
            if(createFamily) await createFamily({ familyName, userColor }); 
        } catch (err) { 
            setError(err.response?.data?.message || 'Failed to create family.'); 
        } 
    };
    
    const handleJoinFamily = async (e) => { 
        e.preventDefault(); 
        setError(''); 
        try { 
            if(joinFamily) await joinFamily(inviteCode, userColor); 
        } catch (err) { 
            setError(err.response?.data?.message || 'Failed to join family. Check the code.'); 
        } 
    };
    
    const ColorPicker = () => (<div style={{marginBottom: '24px'}}><label>Choose Your Color</label><div style={{marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '16px'}}>{GOOGLE_CALENDAR_COLORS.map(color => (<button type="button" key={color.hex} onClick={() => setUserColor(color.hex)} style={{height: '48px', width: '48px', borderRadius: '50%', border: `2px solid ${userColor === color.hex ? '#3B82F6' : 'transparent'}`, backgroundColor: color.hex}} />))}</div></div>);
    
    const renderContent = () => {
        switch (view) {
            case 'create': return (<form onSubmit={handleCreateFamily}><h2>Create Your Household</h2><div><label htmlFor="familyName">Household Name</label><input type="text" id="familyName" value={familyName} onChange={(e) => setFamilyName(e.target.value)} required /></div><ColorPicker /><button type="submit">Create Household</button><button type="button" onClick={() => setView('options')}>Back</button></form>);
            case 'join': return (<form onSubmit={handleJoinFamily}><h2>Join a Household</h2><div><label htmlFor="inviteCode">Invite Code</label><input type="text" id="inviteCode" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required /></div><ColorPicker /><button type="submit">Join Household</button><button type="button" onClick={() => setView('options')}>Back</button></form>);
            default: return (<div><h2>Welcome to Family Hub!</h2><p>To get started, create a new household for your family or join one using an invite code.</p><div><button onClick={() => setView('create')}>Create a Household</button><button onClick={() => setView('join')}>Join a Household</button></div></div>);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>{error && <p>{error}</p>}{renderContent()}</div>
        </div>
    );
};
export default OnboardingPage;