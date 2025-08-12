// --- File: /frontend/src/components/auth/PinLoginModal.js ---
// A modal for parent users to log in using a 4-digit PIN.

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useFamily } from '../../context/FamilyContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';

const PinLoginModal = ({ onClose }) => {
    const { loginWithPin } = useContext(AuthContext);
    const { state: familyState } = useFamily();
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const parents = familyState.family?.members.filter(m => m.role === 'Parent/Guardian') || [];

    const handlePinInput = (num) => {
        if (pin.length < 4) {
            setPin(pin + num);
        }
    };

    const handleDelete = () => setPin(pin.slice(0, -1));

    const handleSubmit = async () => {
        if (!selectedMemberId) {
            setError('Please select a user.');
            return;
        }
        if (pin.length !== 4) {
            setError('PIN must be 4 digits.');
            return;
        }
        try {
            if (loginWithPin) {
                await loginWithPin(selectedMemberId, pin);
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
            setPin('');
        }
    };

    const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 };
    const keypadButtonStyle = { ...theme.typography.h2, width: '80px', height: '80px', borderRadius: '50%', border: `2px solid ${theme.colors.neutralBackground}`, background: 'white', cursor: 'pointer' };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <Card style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                <h2 style={theme.typography.h2}>Parent Login</h2>
                <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, margin: `${theme.spacing.md} 0` }}>Select your profile and enter your PIN.</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: theme.spacing.md, margin: `${theme.spacing.lg} 0` }}>
                    {parents.map(p => (
                        <div key={p.userId._id} onClick={() => setSelectedMemberId(p.userId._id)} style={{ cursor: 'pointer', textAlign: 'center', opacity: selectedMemberId === p.userId._id ? 1 : 0.7 }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: p.color, border: selectedMemberId === p.userId._id ? `4px solid ${theme.colors.primaryBrand}` : '4px solid transparent' }}></div>
                            <p style={{ marginTop: theme.spacing.sm, fontWeight: '600' }}>{p.userId.displayName}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: i < pin.length ? theme.colors.textPrimary : theme.colors.neutralBackground }}></div>
                    ))}
                </div>
                {error && <p style={{ color: theme.colors.semanticError, marginBottom: theme.spacing.md, minHeight: '20px' }}>{error}</p>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.md, justifyItems: 'center' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => <button key={num} style={keypadButtonStyle} onClick={() => handlePinInput(num)}>{num}</button>)}
                    <div></div>
                    <button style={keypadButtonStyle} onClick={() => handlePinInput(0)}>0</button>
                    <button style={keypadButtonStyle} onClick={handleDelete}>⌫</button>
                </div>
                <Button variant="primary" onClick={handleSubmit} style={{ width: '100%', marginTop: theme.spacing.lg }}>Login</Button>
            </Card>
        </div>
    );
};

export default PinLoginModal;