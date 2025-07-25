import React, { useState, useContext } from 'react';
import { FamilyContext } from '../context/FamilyContext';

// This is a list of Google Calendar's default event colors.
const GOOGLE_CALENDAR_COLORS = [
    { name: 'Blue', hex: '#039be5' },
    { name: 'Lavender', hex: '#7986cb' },
    { name: 'Sage', hex: '#33b679' },
    { name: 'Grape', hex: '#8e24aa' },
    { name: 'Flamingo', hex: '#e67c73' },
    { name: 'Banana', hex: '#f6c026' },
    { name: 'Tangerine', hex: '#f5511d' },
    { name: 'Peacock', hex: '#009688' },
    { name: 'Graphite', hex: '#616161' },
];

const OnboardingPage = () => {
    const { createFamily, joinFamily } = useContext(FamilyContext);
    const [view, setView] = useState('options'); // 'options', 'create', 'join'
    const [familyName, setFamilyName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [userColor, setUserColor] = useState(GOOGLE_CALENDAR_COLORS[0].hex);
    const [error, setError] = useState('');

    const handleCreateFamily = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createFamily(familyName, userColor);
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

    // --- Reusable Color Picker Component ---
    const ColorPicker = () => (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Choose Your Color</label>
            <div className="mt-2 flex flex-wrap gap-4">
                {GOOGLE_CALENDAR_COLORS.map(color => (
                    <button
                        type="button" // Prevents form submission
                        key={color.hex}
                        onClick={() => setUserColor(color.hex)}
                        className={`h-12 w-12 rounded-full border-2 transition-transform focus:outline-none ${userColor === color.hex ? 'border-blue-500 scale-110 ring-2 ring-offset-2 ring-blue-500' : 'border-transparent hover:scale-110'}`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={`Select color ${color.name}`}
                    />
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'create':
                return (
                    <form onSubmit={handleCreateFamily}>
                        <h2 className="text-2xl font-bold mb-4">Create Your Household</h2>
                        <div className="mb-4">
                            <label htmlFor="familyName" className="block text-sm font-medium text-gray-700">Household Name</label>
                            <input type="text" id="familyName" value={familyName} onChange={(e) => setFamilyName(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md" placeholder="e.g., The Smith Family"/>
                        </div>
                        <ColorPicker />
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Create Household</button>
                        <button type="button" onClick={() => setView('options')} className="w-full mt-2 text-sm text-gray-600 hover:underline">Back</button>
                    </form>
                );
            case 'join':
                return (
                    <form onSubmit={handleJoinFamily}>
                        <h2 className="text-2xl font-bold mb-4">Join a Household</h2>
                        <div className="mb-4">
                            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700">Invite Code</label>
                            <input type="text" id="inviteCode" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required className="mt-1 block w-full border p-2 rounded-md" placeholder="Enter 6-digit code"/>
                        </div>
                        <ColorPicker />
                        <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">Join Household</button>
                        <button type="button" onClick={() => setView('options')} className="w-full mt-2 text-sm text-gray-600 hover:underline">Back</button>
                    </form>
                );
            default:
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Welcome to Family Hub!</h2>
                        <p className="mb-6 text-gray-600">To get started, create a new household for your family or join one using an invite code.</p>
                        <div className="space-y-4">
                            <button onClick={() => setView('create')} className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 text-lg">Create a Household</button>
                            <button onClick={() => setView('join')} className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 text-lg">Join a Household</button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {renderContent()}
            </div>
        </div>
    );
};

export default OnboardingPage;
