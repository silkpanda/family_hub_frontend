import React, { useContext, useState, useEffect } from 'react';
import { FamilyContext } from '../context/FamilyContext';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import InputField from '../components/shared/InputField';
import AddMemberModal from '../components/family/AddMemberModal';
import EditMemberModal from '../components/family/EditMemberModal';
import { theme } from '../theme/theme';

const ManageFamilyPage = () => {
    const { family, loading, updateFamily } = useContext(FamilyContext);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [familyName, setFamilyName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    // Effect to update the local familyName state when the family data loads from the context
    useEffect(() => {
        if (family) {
            setFamilyName(family.name);
        }
    }, [family]);

    if (loading) {
        return <div>Loading family details...</div>;
    }

    if (!family) {
        return <div>No family found.</div>;
    }

    const handleNameSave = async () => {
        if (familyName.trim()) {
            await updateFamily({ name: familyName.trim() });
            setIsEditingName(false);
        }
    };

    const pageStyle = {
        padding: theme.spacing.lg,
        fontFamily: theme.typography.fontFamily,
    };

    const headerStyle = {
        ...theme.typography.h2,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
    };

    return (
        <div style={pageStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
                {!isEditingName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                        <h1 style={headerStyle}>{family.name}</h1>
                        <Button variant="tertiary" onClick={() => setIsEditingName(true)}>Edit</Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, flexGrow: 1 }}>
                        <InputField value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
                        <Button variant="secondary" onClick={handleNameSave}>Save</Button>
                        <Button variant="tertiary" onClick={() => setIsEditingName(false)}>Cancel</Button>
                    </div>
                )}
                <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>+ Add Member</Button>
            </div>

            <Card>
                <h2 style={{ ...theme.typography.h4, marginBottom: theme.spacing.md }}>Family Members</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                    {family.members.map(member => (
                        <div key={member.userId._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.sm, borderRadius: theme.spacing.sm }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: member.color, marginRight: theme.spacing.md }}></div>
                                <div>
                                    <p style={{ ...theme.typography.body, fontWeight: '600' }}>{member.userId.displayName}</p>
                                    <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>{member.role}</p>
                                </div>
                            </div>
                            <Button variant="tertiary" onClick={() => setEditingMember(member)}>Edit</Button>
                        </div>
                    ))}
                </div>
            </Card>

            {isAddModalOpen && <AddMemberModal onClose={() => setIsAddModalOpen(false)} />}
            {editingMember && <EditMemberModal member={editingMember} onClose={() => setEditingMember(null)} />}
        </div>
    );
};

export default ManageFamilyPage;
