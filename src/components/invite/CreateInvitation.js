import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import Card from '../ui/Card'; // Import Card
import Button from '../ui/Button'; // Import Button

const ClipboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4-1v4m0 0l-2-2m2 2l2-2" />
    </svg>
);

const CreateInvitation = ({ householdId }) => {
    const [generatedCode, setGeneratedCode] = useState(null);
    const [expiresAt, setExpiresAt] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCreateInvitation = async () => {
        if (!householdId) {
            setError("Household information is not yet available.");
            return;
        }
        setIsCreating(true);
        setError('');
        setGeneratedCode(null);
        setExpiresAt(null);
        try {
            const data = await api.post('/invitations/create', { householdId });
            setGeneratedCode(data.inviteCode);
            setExpiresAt(data.expiresAt);
        } catch (err) {
            setError(err.message || 'Failed to create invitation.');
        } finally {
            setIsCreating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    return (
        <Card className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Invite a Member</h2>
            <p className="text-slate-500 mb-6">Generate a unique code to invite someone to your household. The code is valid for 24 hours.</p>
            <Button onClick={handleCreateInvitation} disabled={isCreating || !householdId} className="w-full py-3">
                {isCreating ? 'Generating...' : 'Generate Invite Code'}
            </Button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            {generatedCode && (
                <div className="mt-6 text-center">
                    <p className="text-slate-500">Your invite code is:</p>
                    <div className="flex items-center justify-center bg-slate-100 p-4 rounded-lg my-2">
                        <p className="text-3xl font-bold text-slate-800 tracking-widest">{generatedCode}</p>
                        <button onClick={copyToClipboard} className="ml-4 text-slate-500 hover:text-indigo-600">
                            {copied ? 'Copied!' : <ClipboardIcon />}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400">Expires: {new Date(expiresAt).toLocaleString()}</p>
                </div>
            )}
        </Card>
    );
};

export default CreateInvitation;
