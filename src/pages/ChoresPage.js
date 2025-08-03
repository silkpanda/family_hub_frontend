// ===================================================================================
// File: /frontend/src/pages/ChoresPage.js
// Purpose: The main UI for the Chores feature, redesigned with a column-based layout.
//
// --- Dev Notes (UPDATE) ---
// - This is a complete redesign of the page.
// - It now uses `FamilyContext` to get the list of members.
// - A filter allows the user to show/hide members from the view.
// - `MemberChoreColumn`: A new sub-component that renders a column for each member,
//   displaying their assigned chores and routines.
// - Each column has a circular '+' button that opens the new `AddChoreRoutineModal`.
// - REFINEMENT: Each member column now contains a toggle to switch between viewing
//   'Choores' (items with points) and 'Routines' (items without points).
// - REFINEMENT: The member columns are now sorted to display Parents/Guardians first,
//   then Children, with each group sorted alphabetically.
// - REFINEMENT: The header of each member's column is now a clickable link that
//   navigates to that member's profile page.
// - DYNAMIC FEATURE: Added a "celebration" animation. A confetti burst now appears
//   when a chore is checked off as complete.
// ===================================================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChores } from '../context/ChoreContext';
import { useFamily } from '../context/FamilyContext';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import AddChoreRoutineModal from '../components/chores/AddChoreRoutineModal';

// --- NEW: Confetti Animation Component ---
const Confetti = () => {
    const confettiColors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#7ED321'];
    const confettiPieces = Array.from({ length: 15 }).map((_, index) => {
        const style = {
            position: 'absolute',
            width: `${Math.random() * 8 + 4}px`,
            height: `${Math.random() * 8 + 4}px`,
            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            top: '50%',
            left: '50%',
            opacity: 0,
            animation: `confetti-burst 0.8s ${index * 0.02}s ease-out forwards`,
        };
        return <div key={index} style={style} />;
    });
    return <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>{confettiPieces}</div>;
};

const ChoreCard = ({ chore }) => {
    const { actions } = useChores();
    const { toggleChoreCompletion } = actions;
    const isRoutine = chore.points === 0;
    const [showConfetti, setShowConfetti] = useState(false);

    const handleToggle = () => {
        if (!chore.isComplete) {
            setShowConfetti(true);
        }
        if (toggleChoreCompletion) toggleChoreCompletion(chore._id);
    };

    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    const cardStyle = {
        padding: theme.spacing.md,
        backgroundColor: chore.isComplete ? '#f0fdf4' : theme.colors.neutralSurface,
        borderRadius: theme.borderRadius.medium,
        border: `1px solid ${theme.colors.neutralBackground}`,
        opacity: chore.isComplete ? 0.7 : 1,
        position: 'relative', // Needed for confetti positioning
    };
    const titleStyle = { ...theme.typography.body, fontWeight: '600', textDecoration: chore.isComplete ? 'line-through' : 'none' };
    const pointsStyle = { ...theme.typography.h4, color: theme.colors.secondaryBrand };

    return (
        <div style={cardStyle}>
            {showConfetti && <Confetti />}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                    <input type="checkbox" checked={chore.isComplete} onChange={handleToggle} style={{ width: '24px', height: '24px', cursor: 'pointer' }} />
                    <p style={titleStyle}>{chore.title}</p>
                </div>
                {!isRoutine && <span style={pointsStyle}>{chore.points} pts</span>}
            </div>
        </div>
    );
};

const RoutineCategoryCard = ({ title, routines, memberColor }) => {
    const timeBasedStyles = {
        Morning: { background: 'linear-gradient(135deg, #FFF3B0 0%, #FFC1A1 100%)', color: theme.colors.textPrimary },
        Day: { background: 'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)', color: theme.colors.textPrimary },
        Night: { background: 'linear-gradient(135deg, #09203F 0%, #537895 100%)', color: 'white' },
    };
    const cardStyle = { padding: theme.spacing.md, borderRadius: theme.borderRadius.medium, ...timeBasedStyles[title] };
    if (routines.length === 0) return null;

    return (
        <div style={cardStyle}>
            <h4 style={{ ...theme.typography.h4, borderBottom: `2px solid ${timeBasedStyles[title].color}`, paddingBottom: theme.spacing.xs, marginBottom: theme.spacing.sm, color: timeBasedStyles[title].color }}>{title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {routines.map(routine => <ChoreCard key={routine._id} chore={routine} />)}
            </div>
        </div>
    );
};


const MemberChoreColumn = ({ member, chores, onAddClick }) => {
    const [view, setView] = useState('chores');
    const assignedChores = chores.filter(c => c.assignedTo?._id === member.userId._id && c.points > 0);
    const assignedRoutines = chores.filter(c => c.assignedTo?._id === member.userId._id && c.points === 0);
    const morningRoutines = assignedRoutines.filter(r => r.routineCategory === 'Morning');
    const dayRoutines = assignedRoutines.filter(r => r.routineCategory === 'Day');
    const nightRoutines = assignedRoutines.filter(r => r.routineCategory === 'Night');

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                    <RoutineCategoryCard title="Morning" routines={morningRoutines} memberColor={member.color} />
                    <RoutineCategoryCard title="Day" routines={dayRoutines} memberColor={member.color} />
                    <RoutineCategoryCard title="Night" routines={nightRoutines} memberColor={member.color} />
                    {assignedRoutines.length === 0 && (
                        <p style={{ textAlign: 'center', color: theme.colors.textSecondary, paddingTop: theme.spacing.lg }}>No routines assigned.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const ChoresPage = () => {
    const { state: choreState, loading: choresLoading } = useChores();
    const { state: familyState, loading: familyLoading } = useFamily();
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [memberForModal, setMemberForModal] = useState(null);

    const handleAddClick = (member) => {
        setMemberForModal(member);
        setIsAddModalOpen(true);
    };

    const handleFilterChange = (memberId) => {
        setSelectedMembers(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]);
    };

    if (choresLoading || familyLoading) {
        return <div>Loading chores...</div>;
    }

    const sortByName = (a, b) => a.userId.displayName.localeCompare(b.userId.displayName);
    const allMembers = familyState.family?.members || [];
    const parents = allMembers.filter(m => m.role === 'Parent/Guardian').sort(sortByName);
    const children = allMembers.filter(m => m.role === 'Child').sort(sortByName);
    const sortedMembers = [...parents, ...children];
    const membersToDisplay = sortedMembers.filter(member => selectedMembers.length === 0 || selectedMembers.includes(member.userId._id));

    return (
        <div style={{ fontFamily: theme.typography.fontFamily }}>
            {/* --- NEW: CSS for confetti animation --- */}
            <style>{`
                @keyframes confetti-burst {
                    0% {
                        opacity: 1;
                        transform: translate(0, 0) rotate(0deg) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(calc(${Math.random() * 200 - 100}px), calc(${Math.random() * 200 - 100}px)) rotate(${Math.random() * 360}deg) scale(0);
                    }
                }
            `}</style>
            <h1 style={{ ...theme.typography.h1, marginBottom: theme.spacing.md }}>Chores & Routines</h1>
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
                        chores={choreState.chores}
                        onAddClick={handleAddClick}
                    />
                ))}
            </div>
            {isAddModalOpen && <AddChoreRoutineModal member={memberForModal} onClose={() => setIsAddModalOpen(false)} />}
        </div>
    );
};

export default ChoresPage;
