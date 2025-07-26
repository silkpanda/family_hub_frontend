import React, { useState, useContext } from 'react';
import { FamilyContext } from '../../context/FamilyContext';
import { theme } from '../../theme/theme';
import Button from '../shared/Button';
import InputField from '../shared/InputField';
import Card from '../shared/Card';

// This is the same list from the validator on the backend
const GOOGLE_CALENDAR_COLORS = [
    '#039be5', '#7986cb', '#33b679', '#8e24aa', '#e67c73',
    '#f6c026', '#f5511d', '#009688', '#616161',
];

const AddMemberModal = ({ onClose }) => {
    const { addFamilyMember } = useContext(FamilyContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Child');
    const [color, setColor] = useState(GOOGLE_CALENDAR_COLORS[0]);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const memberData = {
                name,
                role,
                color,
                ...(role === 'Parent/Guardian' && email && { email }),
            };
            await addFamilyMember(memberData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add member.');
        }
    };

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    return (
        <div style={modalOverlayStyle}>
            <Card style={{ width: '100%', maxWidth: '500px' }}>
                <form onSubmit={handleSubmit}>
                    <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.lg }}>Add New Member</h2>
                    {error && <p style={{ color: theme.colors.semanticError, marginBottom: theme.spacing.md }}>{error}</p>}
                    
                    <InputField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />

                    <div style={{ marginBottom: theme.spacing.md }}>
                        <label style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: theme.spacing.sm, marginTop: theme.spacing.xs, border: '2px solid #ccc', borderRadius: theme.spacing.sm }}>
                            <option value="Child">Child</option>
                            <option value="Parent/Guardian">Parent/Guardian</option>
                        </select>
                    </div>

                    {role === 'Parent/Guardian' && (
                        <InputField label="Email (Optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    )}

                    <div style={{ marginBottom: theme.spacing.lg }}>
                        <label style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>Color</label>
                        <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
                            {GOOGLE_CALENDAR_COLORS.map(c => (
                                <div key={c} onClick={() => setColor(c)} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: c, cursor: 'pointer', border: color === c ? `3px solid ${theme.colors.accentAction}` : '3px solid transparent' }}></div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.md }}>
                        <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary">Add Member</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddMemberModal;
