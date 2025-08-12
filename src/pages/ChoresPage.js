// --- File: /frontend/src/pages/ChoresPage.js ---
// Displays the main chores and routines page, including the approval queue for parents.

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useChores } from '../context/ChoreContext';
import { useFamily } from '../context/FamilyContext';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import AddChoreRoutineModal from '../components/chores/AddChoreRoutineModal';

// ChoreCard: Renders a single chore item with completion logic.
const ChoreCard = ({ chore }) => {
    const { actions } = useChores();
    const { user } = useContext(AuthContext);
    const { state: familyState } = useFamily();
    // **UPDATE:** Get the new `completeChoreForChild` action from the context.
    const { submitChoreForApproval, completeChoreForChild } = actions;

    const isRoutine = chore.points === 0;
    const isCurrentUserAssigned = chore.assignedTo?._id === user?.id;
    const currentUserMember = familyState.family?.members.find(m => m.userId._id === user?.id);
    const isParent = currentUserMember?.role === 'Parent/Guardian';

    // **BUG FIX:** The handleToggle logic is updated to allow parents to complete any chore.
    const handleToggle = () => {
        if (isParent) {
            // If the user is a parent, they can complete the chore for the assigned child.
            // We must check that `chore.assignedTo` exists before trying to complete it.
            if (chore.assignedTo?._id && completeChoreForChild) {
                completeChoreForChild(chore._id, chore.assignedTo._id);
            }
        } else if (isCurrentUserAssigned) {
            // If the user is not a parent, they can only submit their own chores.
            if (submitChoreForApproval) submitChoreForApproval(chore._id);
        }
    };

    const cardStyle = {
        padding: theme.spacing.md,
        backgroundColor: chore.status === 'Completed' ? '#f0fdf4' : theme.colors.neutralSurface,
        borderRadius: theme.borderRadius.medium,
        border: `1px solid ${theme.colors.neutralBackground}`,
        opacity: chore.status === 'Completed' ? 0.7 : 1,
    };
    const titleStyle = { ...theme.typography.body, fontWeight: '600', textDecoration: chore.status === 'Completed' ? 'line-through' : 'none' };
    const pointsStyle = { ...theme.typography.h4, color: theme.colors.secondaryBrand };
    const statusStyle = { ...theme.typography.caption, fontStyle: 'italic', color: theme.colors.accentAction };

    return (
        <Card style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                    <input 
                        type="checkbox" 
                        checked={chore.status === 'Completed' || chore.status === 'Pending Approval'} 
                        onChange={handleToggle} 
                        // A chore can be checked off if it's incomplete AND (the user is a parent OR they are the assigned user).
                        disabled={chore.status !== 'Incomplete' || (!isParent && !isCurrentUserAssigned)}
                        style={{ width: '24px', height: '24px', cursor: 'pointer' }} 
                    />
                    <div>
                        <p style={titleStyle}>{chore.title}</p>
                        {chore.status === 'Pending Approval' && <p style={statusStyle}>Waiting for Approval</p>}
                    </div>
                </div>
                {!isRoutine && <span style={pointsStyle}>{chore.points} pts</span>}
            </div>
        </Card>
    );
};

// ApprovalQueue: A section visible only to parents for approving/rejecting chores.
const ApprovalQueue = ({ chores }) => {
    const { actions } = useChores();
    const { approveChore, rejectChore } = actions;
    if (chores.length === 0) return null;

    return (
        <Card style={{ marginBottom: theme.spacing.lg, backgroundColor: '#fffbe6' }}>
            <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.md }}>Pending Approval</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                {chores.map(chore => (
                    <div key={chore._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: theme.spacing.sm, backgroundColor: 'white', borderRadius: theme.borderRadius.medium }}>
                        <div>
                            <p style={{ fontWeight: '600' }}>{chore.title}</p>
                            <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>Completed by: {chore.assignedTo?.displayName}</p>
                        </div>
                        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                            <Button variant="tertiary" onClick={() => rejectChore && rejectChore(chore._id)}>Reject</Button>
                            <Button variant="secondary" onClick={() => approveChore && approveChore(chore._id)}>Approve</Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// MemberChoreColumn: Displays chores and routines for a single family member.
const MemberChoreColumn = ({ member, chores, onAddClick }) => {
    const [view, setView] = useState('chores'); 

    const assignedChores = chores.filter(chore => chore.assignedTo?._id === member.userId._id && chore.points > 0);
    const assignedRoutines = chores.filter(chore => chore.assignedTo?._id === member.userId._id && chore.points === 0);

    const columnStyle = { flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: theme.spacing.md };
    const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: theme.spacing.sm, borderBottom: `2px solid ${member.color}` };
    const nameStyle = { ...theme.typography.h4 };
    const addButtonStyle = { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: member.color, color: 'white', border: 'none', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
    const toggleButtonStyle = (isActive) => ({ background: 'none', border: 'none', cursor: 'pointer', padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontWeight: isActive ? 'bold' : 'normal', color: isActive ? theme.colors.textPrimary : theme.colors.textSecondary, borderBottom: isActive ? `2px solid ${member.color}` : '2px solid transparent' });

    return (
        <div style={columnStyle}>
            <Link to={`/profile/${member.userId._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={headerStyle}>
                    <h3 style={nameStyle}>{member.userId.displayName}</h3>
                    <button style={addButtonStyle} onClick={(e) => { e.preventDefault(); onAddClick(member); }}>+</button>
                </div>
            </Link>
            <div style={{ display: 'flex', gap: theme.spacing.sm, borderBottom: `1px solid #eee`, paddingBottom: theme.spacing.xs }}>
                <button style={toggleButtonStyle(view === 'chores')} onClick={() => setView('chores')}>Chores</button>
                <button style={toggleButtonStyle(view === 'routines')} onClick={() => setView('routines')}>Routines</button>
            </div>
            {view === 'chores' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                    {assignedChores.length > 0 ? (
                        assignedChores.map(chore => <ChoreCard key={chore._id} chore={chore} />)
                    ) : (
                        <p style={{ textAlign: 'center', color: theme.colors.textSecondary, paddingTop: theme.spacing.lg }}>No chores assigned.</p>
                    )}
                </div>
            ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                    {assignedRoutines.length > 0 ? (
                        assignedRoutines.map(chore => <ChoreCard key={chore._id} chore={chore} />)
                    ) : (
                        <p style={{ textAlign: 'center', color: theme.colors.textSecondary, paddingTop: theme.spacing.lg }}>No routines assigned.</p>
                    )}
                </div>
            )}
        </div>
    );
};

// ChoresPage: The main component orchestrating the page layout and data flow.
const ChoresPage = () => {
    const { state: choreState } = useChores();
    const { state: familyState } = useFamily();
    const { user, isAuthenticated } = useContext(AuthContext);
    
    const { chores, loading: choresLoading } = choreState;
    const { family, loading: familyLoading } = familyState;

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [memberForModal, setMemberForModal] = useState(null);

    const handleAddClick = (member) => {
        setMemberForModal(member);
        setIsAddModalOpen(true);
    };

    const handleFilterChange = (memberId) => {
        setSelectedMembers(prev =>
            prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
        );
    };

    if (choresLoading || familyLoading || !family) {
        return <div style={{padding: theme.spacing.lg}}>Loading chores...</div>;
    }

    const currentUser = family.members.find(m => m.userId._id === user?.id);
    const isParent = isAuthenticated && currentUser?.role === 'Parent/Guardian';
    
    const pendingChores = chores.filter(c => c.status === 'Pending Approval');
    const otherChores = chores.filter(c => c.status !== 'Pending Approval');

    const sortByName = (a, b) => a.userId.displayName.localeCompare(b.userId.displayName);
    const allMembers = family.members || [];
    const parents = allMembers.filter(m => m.role === 'Parent/Guardian').sort(sortByName);
    const children = allMembers.filter(m => m.role === 'Child').sort(sortByName);
    const sortedMembers = [...parents, ...children];

    const membersToDisplay = sortedMembers.filter(member =>
        selectedMembers.length === 0 || selectedMembers.includes(member.userId._id)
    );

    return (
        <div style={{ fontFamily: theme.typography.fontFamily, padding: theme.spacing.lg }}>
            <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.md }}>Chores & Routines</h1>
            
            {isParent && <ApprovalQueue chores={pendingChores} />}

            <Card style={{ marginBottom: theme.spacing.lg }}>
                <h3 style={{...theme.typography.h4, marginBottom: theme.spacing.sm}}>Filter by Member</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                    {sortedMembers.map(member => (
                        <label key={member.userId._id} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px', borderRadius: '16px', backgroundColor: selectedMembers.includes(member.userId._id) ? member.color : theme.colors.neutralBackground, color: selectedMembers.includes(member.userId._id) ? 'white' : 'black', cursor: 'pointer' }}>
                            <input type="checkbox" checked={selectedMembers.includes(member.userId._id)} onChange={() => handleFilterChange(member.userId._id)} style={{ display: 'none' }} />
                            {member.userId.displayName}
                        </label>
                    ))}
                    {selectedMembers.length > 0 && <Button variant="tertiary" onClick={() => setSelectedMembers([])}>Clear</Button>}
                </div>
            </Card>

            <div style={{ display: 'flex', gap: theme.spacing.lg, overflowX: 'auto', paddingBottom: theme.spacing.md }}>
                {membersToDisplay.map(member => (
                    <MemberChoreColumn
                        key={member.userId._id}
                        member={member}
                        chores={otherChores}
                        onAddClick={handleAddClick}
                    />
                ))}
            </div>
            {isAddModalOpen && <AddChoreRoutineModal member={memberForModal} onClose={() => setIsAddModalOpen(false)} />}
        </div>
    );
};

export default ChoresPage;
