// ===================================================================================
// File: /frontend/src/pages/ManageFamilyPage.js
// Purpose: The UI for managing family members and settings.
// ===================================================================================
import React, { useContext, useState, useEffect } from 'react';
import { FamilyContext } from '../context/FamilyContext'; // Ensure this import is correct
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import InputField from '../components/shared/InputField';
import AddMemberModal from '../components/family/AddMemberModal';
import EditMemberModal from '../components/family/EditMemberModal';
import { theme } from '../theme/theme';

const ManageFamilyPage = () => {
    // Correctly destructure state and actions from FamilyContext
    const { state, actions } = useContext(FamilyContext);
    const { family, loading } = state; // Get family and loading from the state object
    const { updateFamilyName } = actions; // Using updateFamilyName for now, as you used it recently
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [familyNameInput, setFamilyNameInput] = useState(''); // Renamed to avoid conflict with `family` object
    const [isEditingName, setIsEditingName] = useState(false);

    // Add logs to see what state ManageFamilyPage is receiving
    console.log(`[ManageFamilyPage] Render. Family: ${family ? family.name : 'null'}, Loading: ${loading}`);

    // This effect should populate the input field once family data is available
    useEffect(() => {
        if (family) {
            setFamilyNameInput(family.name);
            console.log(`[ManageFamilyPage] useEffect: Set family name input to: ${family.name}`);
        } else {
            console.log('[ManageFamilyPage] useEffect: Family is null, cannot set family name input.');
        }
    }, [family]); // Dependency on family ensures this runs when family state changes

    // Loading indicator: Shows "Loading family details..." if loading is true
    if (loading) {
        console.log('[ManageFamilyPage] Displaying "Loading family details..."');
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Loading family details...</p></div>;
    }
    
    // Fallback: This should ideally not be hit if family is properly loaded,
    // unless the user genuinely isn't part of a family.
    if (!family) {
        console.log('[ManageFamilyPage] Displaying "No family found." - This should only happen if user is not in a family after load.');
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>No family found.</p></div>;
    }
    
    // Handle saving the edited family name
    const handleNameSave = async () => { 
        if (familyNameInput.trim() && updateFamilyName) { 
            console.log(`[ManageFamilyPage] Saving new family name: ${familyNameInput.trim()}`);
            await updateFamilyName(familyNameInput.trim()); // Use updateFamilyName from actions
            setIsEditingName(false); 
        } else {
            console.warn('[ManageFamilyPage] Family name input is empty or updateFamilyName action is missing.');
        }
    };
    
    const pageStyle = { padding: theme.spacing.lg, fontFamily: theme.typography.fontFamily };
    const headerStyle = { ...theme.typography.h2, color: theme.colors.textPrimary, marginBottom: theme.spacing.md };

    return (
        <div style={pageStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
                {!isEditingName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                        <h1 style={headerStyle}>{family.name}</h1> {/* Use family.name directly */}
                        <Button variant="tertiary" onClick={() => setIsEditingName(true)}>Edit</Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, flexGrow: 1 }}>
                        <InputField value={familyNameInput} onChange={(e) => setFamilyNameInput(e.target.value)} />
                        <Button variant="secondary" onClick={handleNameSave}>Save</Button>
                        <Button variant="tertiary" onClick={() => setIsEditingName(false)}>Cancel</Button>
                    </div>
                )}
                <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>+ Add Member</Button>
            </div>
            <Card>
                <h2 style={{ ...theme.typography.h4, marginBottom: theme.spacing.md }}>Family Members</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                    {/* Ensure family.members is an array before mapping */}
                    {family.members && family.members.length > 0 ? (
                        family.members.map(member => (
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
                        ))
                    ) : (
                        <p style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>No members found in this family yet.</p>
                    )}
                </div>
            </Card>
            {isAddModalOpen && <AddMemberModal onClose={() => setIsAddModalOpen(false)} />}
            {editingMember && <EditMemberModal member={editingMember} onClose={() => setEditingMember(null)} />}
        </div>
    );
};
export default ManageFamilyPage;