// ===================================================================================
// File: /frontend/src/pages/UserProfilePage.js
// Purpose: Displays a detailed profile for a single family member.
// ===================================================================================
import React from 'react';
import { useParams } from 'react-router-dom';
import { useFamily } from '../context/FamilyContext';
import { useCalendar } from '../context/CalendarContext';
import { useLists } from '../context/ListContext';
import { useChores } from '../context/ChoreContext';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';

const UserProfilePage = () => {
    const { memberId } = useParams();
    const { state: familyState } = useFamily();
    const { state: calendarState } = useCalendar();
    const { state: listState } = useLists();
    const { state: choreState } = useChores();

    const member = familyState.family?.members.find(m => m.userId._id === memberId);
    const today = new Date();

    // Filter data specific to this member for today
    const dailyEvents = calendarState.events.filter(event => {
        const eventStart = new Date(event.startTime);
        return event.assignedTo.some(a => a._id === memberId) &&
               today.toDateString() === eventStart.toDateString();
    });

    const assignedLists = listState.lists.map(list => ({
        ...list,
        items: list.items.filter(item => item.createdBy._id === memberId)
    })).filter(list => list.items.length > 0);

    const assignedChores = choreState.chores.filter(chore => chore.assignedTo?._id === memberId);
    const totalPoints = assignedChores.filter(c => c.isComplete).reduce((acc, chore) => acc + chore.points, 0);

    if (!member) {
        return <div>Member not found.</div>;
    }

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
                    <h2 style={theme.typography.h3}>List Items</h2>
                    {assignedLists.length > 0 ? assignedLists.map(list => (
                        <div key={list._id}>
                            <strong>{list.name}:</strong>
                            <ul>{list.items.map(item => <li key={item._id}>{item.content}</li>)}</ul>
                        </div>
                    )) : <p>No list items assigned.</p>}
                </Card>
            </div>
        </div>
    );
};

export default UserProfilePage;
