// ===================================================================================
// File: /frontend/src/pages/UserProfilePage.js
// Purpose: Displays a detailed profile for a single family member.
//
// --- Dev Notes (UPDATE) ---
// - BUG FIX: Interacting with the list modal did not update the UI in real-time.
// - SOLUTION:
//   - The `selectedList` state now stores only the ID of the list, not the entire object.
//   - During each render, the component finds the most up-to-date version of the
//     selected list from the global context (`listState`).
//   - This fresh list object is then passed to the modal, ensuring that any changes
//     (like checking off an item) are immediately reflected.
// ===================================================================================
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFamily } from '../context/FamilyContext';
import { useCalendar } from '../context/CalendarContext';
import { useLists } from '../context/ListContext';
import { useChores } from '../context/ChoreContext';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';
import InteractiveListModal from '../components/profile/InteractiveListModal';

const UserProfilePage = () => {
    const { memberId } = useParams();
    const { state: familyState } = useFamily();
    const { state: calendarState } = useCalendar();
    const { state: listState } = useLists();
    const { state: choreState, actions: choreActions } = useChores();
    const [selectedListId, setSelectedListId] = useState(null); // --- UPDATED ---

    const member = familyState.family?.members.find(m => m.userId._id === memberId);
    const today = new Date();

    // Filter data specific to this member
    const dailyEvents = calendarState.events.filter(event => {
        const eventStart = new Date(event.startTime);
        return event.assignedTo.some(a => a._id === memberId) &&
               today.toDateString() === eventStart.toDateString();
    });

    const assignedLists = listState.lists.filter(list =>
        list.assignedTo.some(assignee => assignee._id === memberId)
    );

    const assignedChores = choreState.chores.filter(chore => chore.assignedTo?._id === memberId);
    const totalPoints = choreActions.calculateUserPoints(memberId);

    // --- NEW --- Find the fresh list object on every render
    const listForModal = selectedListId ? listState.lists.find(l => l._id === selectedListId) : null;

    if (!member) {
        return <div>Member not found.</div>;
    }

    const listNameStyle = {
        ...theme.typography.body,
        fontWeight: '600',
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.medium,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        backgroundColor: theme.colors.neutralBackground
    };

    return (
        <div style={{ fontFamily: theme.typography.fontFamily }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: member.color }}></div>
                <div>
                    <h1 style={theme.typography.h1}>{member.userId.displayName}</h1>
                    <p style={{ ...theme.typography.h4, color: theme.colors.secondaryBrand }}>{totalPoints} Points Earned</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: theme.spacing.lg }}>
                <Card>
                    <h2 style={theme.typography.h3}>Today's Schedule</h2>
                    {dailyEvents.length > 0 ? dailyEvents.map(event => (
                        <div key={event._id} style={{ marginTop: theme.spacing.md }}>
                            <p style={{ fontWeight: 'bold' }}>{event.title}</p>
                            <p style={theme.typography.caption}>{new Date(event.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                        </div>
                    )) : <p>No events today.</p>}
                </Card>
                <Card>
                    <h2 style={theme.typography.h3}>Assigned Chores</h2>
                    {assignedChores.length > 0 ? assignedChores.map(chore => (
                        <p key={chore._id} style={{ textDecoration: chore.isComplete ? 'line-through' : 'none' }}>{chore.title} ({chore.points} pts)</p>
                    )) : <p>No chores assigned.</p>}
                </Card>
                <Card>
                    <h2 style={theme.typography.h3}>Assigned Lists</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
                        {assignedLists.length > 0 ? assignedLists.map(list => (
                            <div key={list._id} style={listNameStyle} onClick={() => setSelectedListId(list._id)}>
                                {list.name}
                            </div>
                        )) : <p>No lists assigned.</p>}
                    </div>
                </Card>
            </div>

            {/* --- UPDATED --- Render the modal with the fresh list object */}
            {listForModal && <InteractiveListModal list={listForModal} onClose={() => setSelectedListId(null)} />}
        </div>
    );
};

export default UserProfilePage;
