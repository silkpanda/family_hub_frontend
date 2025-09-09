import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../api/api';
import Card from '../ui/Card';
import Button from '../ui/Button';

const JoinHousehold = ({ onJoinSuccess }) => {
    const { refreshSession } = useContext(AuthContext);
    const [joinCode, setJoinCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleJoinHousehold = async (e) => {
        e.preventDefault();
        if (!joinCode) return;
        setIsJoining(true);
        setMessage({ type: '', text: '' });
        try {
            const data = await api.post('/invitations/join', { inviteCode: joinCode });
            setMessage({ type: 'success', text: data.message });
            await refreshSession();
            if (onJoinSuccess) {
                onJoinSuccess(data.user);
            }
            setJoinCode('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to join household.' });
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Join a Household</h2>
            <p className="text-slate-500 mb-6">Enter an invite code you've received to join an existing household.</p>
            <form onSubmit={handleJoinHousehold}>
                <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="Enter code" className="w-full p-3 border border-slate-300 rounded-lg text-center font-mono tracking-widest" maxLength="6" />
                <Button type="submit" disabled={isJoining || !joinCode} variant="success" className="w-full mt-4 py-3">
                    {isJoining ? 'Joining...' : 'Join Household'}
                </Button>
            </form>
            {message.text && (
                <div className={`mt-4 text-center p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
        </Card>
    );
};

export default JoinHousehold;
