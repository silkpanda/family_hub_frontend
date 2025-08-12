// --- File: /frontend/src/components/family/SetPinModal.js ---
// A modal for parents to set or update their 4-digit PIN.

import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';

const SetPinModal = ({ member, onClose }) => {
    const { actions } = useFamily();
    const { setPin: setPinAction } = actions;
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pin !== confirmPin) {
            setError('PINs do not match.');
            return;
        }
        if (!/^\d{4}$/.test(pin)) {
            setError('PIN must be exactly 4 digits.');
            return;
        }
        try {
            if (setPinAction) {
                await setPinAction(member.userId._id, pin);
                onClose();
            }
        } catch (err) {
            setError(err.message || 'Failed to set PIN.');
        }
    };

    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <Card style={{ width: '100%', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2 style={theme.typography.h3}>Set PIN for {member.userId.displayName}</h2>
                    {error && <p style={{ color: theme.colors.semanticError, marginBottom: theme.spacing.md }}>{error}</p>}
                    <InputField label="New 4-Digit PIN" type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength="4" />
                    <InputField label="Confirm PIN" type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} maxLength="4" />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md, marginTop: theme.spacing.lg }}>
                        <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Set PIN</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default SetPinModal;