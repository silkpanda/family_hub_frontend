// --- File: /frontend/src/pages/ManageFamilyPage.js ---
// Allows parents to manage family members, edit the family name, and set PINs.

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FamilyContext } from '../context/FamilyContext';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import InputField from '../components/shared/InputField';
import AddMemberModal from '../components/family/AddMemberModal';
import EditMemberModal from '../components/family/EditMemberModal';
import SetPinModal from '../components/family/SetPinModal';
import { theme } from '../theme/theme';

const ManageFamilyPage = () => {
    const { state, actions } = useContext(FamilyContext);
    const { user } = useContext(AuthContext);
    const { family, loading } = state;
    const { updateFamilyName } = actions;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [pinMember, setPinMember] = useState(null);
    const [familyNameInput, setFamilyNameInput] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    useEffect(() => {
        if (family) {
            setFamilyNameInput(family.name);
        }
    }, [family]);

    if (loading || !family || !Array.isArray(family.members)) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading family details...</p></div>;
    }
    
    const handleNameSave = async () => { 
        if (familyNameInput.trim() && updateFamilyName) { 
            await updateFamilyName(familyNameInput.trim());
            setIsEditingName(false); 
        }
    };

    const members = family.members;
    const parents = members.filter(m => m.role === 'Parent/Guardian');
    const children = members.filter(m => m.role === 'Child');
    
    const pageStyle = { padding: theme.spacing.lg, fontFamily: theme.typography.fontFamily };
    const headerStyle = { ...theme.typography.h2, color: theme.colors.textPrimary, marginBottom: theme.spacing.md };
    const sectionHeaderStyle = { ...theme.typography.h4, color: theme.colors.textPrimary, marginTop: theme.spacing.lg, marginBottom: theme.spacing.md, borderBottom: `2px solid ${theme.colors.neutralBackground}`, paddingBottom: theme.spacing.sm };

    // MemberRow: Renders a single family member with action buttons.
    const MemberRow = ({ member }) => {
        const isCurrentUser = member.userId._id === user.id;
        const isParent = member.role === 'Parent/Guardian';
        return (
            <Link to={`/profile/${member.userId._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: theme.spacing.sm, borderRadius: theme.borderRadius.medium, transition: 'background-color 0.2s ease' }} 
                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.neutralBackground}
                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: member.color, marginRight: theme.spacing.md }}></div>
                        <div>
                            <p style={{ ...theme.typography.body, fontWeight: '600' }}>{member.userId.displayName}</p>
                            <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>{member.role}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                        {isCurrentUser && isParent && (
                            <Button variant="tertiary" onClick={(e) => { e.preventDefault(); setPinMember(member); }}>Set PIN</Button>
                        )}
                        <Button variant="tertiary" onClick={(e) => { e.preventDefault(); setEditingMember(member); }}>Edit</Button>
                    </div>
                </div>
            </Link>
        );
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
                        <InputField value={familyNameInput} onChange={(e) => setFamilyNameInput(e.target.value)} />
                        <Button variant="secondary" onClick={handleNameSave}>Save</Button>
                        <Button variant="tertiary" onClick={() => setIsEditingName(false)}>Cancel</Button>
                    </div>
                )}
                <Button variant="primary" onClick={() => setIsAddModal(true)}>+ Add Member</Button>
            </div>
            <Card>
                <h2 style={sectionHeaderStyle}>Parents/Guardians</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                    {parents.length > 0 ? (
                        parents.map(member => <MemberRow key={member.userId._id} member={member} />)
                    ) : (
                        <p style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>No parents or guardians in this family yet.</p>
                    )}
                </div>

                <h2 style={sectionHeaderStyle}>Children</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                    {children.length > 0 ? (
                        children.map(member => <MemberRow key={member.userId._id} member={member} />)
                    ) : (
                        <p style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>No children in this family yet.</p>
                    )}
                </div>
            </Card>
            {isAddModalOpen && <AddMemberModal onClose={() => setIsAddModalOpen(false)} />}
            {editingMember && <EditMemberModal member={editingMember} onClose={() => setEditingMember(null)} />}
            {pinMember && <SetPinModal member={pinMember} onClose={() => setPinMember(null)} />}
        </div>
    );
};
export default ManageFamilyPage;