// ===================================================================================
// File: /frontend/src/pages/UserProfilePage.js
// Purpose: Displays a detailed profile for a single family member.
//
// --- Dev Notes (UPDATE) ---
// - REFINEMENT: The "Tasks" card now features a 3D flip animation when toggling
//   between 'Chores' and 'Routines'.
// - A new `<style>` block has been added with CSS classes (`.flip-card-*`) to
//   handle the animation logic.
// - The card's JSX has been restructured into a front face (for chores) and a
//   back face (for routines).
// - REFINEMENT: The card titles are now "Chores" and "Routines". The entire back
//   of the card is now styled with a gradient based on the selected time of day.
// - BUG FIX: When the flip card changed height, all other cards in the row would
//   stretch. This was fixed by adding `alignItems: 'start'` to the main grid
//   container, which makes each card's height independent.
// - BUG FIX: The flip card was cutting off content. The height calculation was not
//   accounting for the card's own internal padding. This was fixed by adding the
//   vertical padding amount back into the `useLayoutEffect` calculation, ensuring
//   the card is always the correct height for its content.
// ===================================================================================
import React, { useState, useMemo, useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFamily } from '../context/FamilyContext';
import { useCalendar } from '../context/CalendarContext';
import { useLists } from '../context/ListContext';
import { useChores } from '../context/ChoreContext';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';
import InteractiveListModal from '../components/profile/InteractiveListModal';

// Helper function to determine the current time category
const getCurrentTimeCategory = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Morning';
    if (currentHour < 17) return 'Day';
    return 'Night';
};

// Renders a list of routines inside the styled card
const RoutineList = ({ routines, memberColor, textColor }) => {
    const { actions } = useChores();
    const { toggleChoreCompletion } = actions;

    const routineItemStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.md, padding: `${theme.spacing.xs} 0` };
    const titleStyle = { ...theme.typography.body, fontWeight: '600', textDecoration: 'none', color: textColor };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {routines.map(routine => (
                <div key={routine._id} style={routineItemStyle}>
                    <input type="checkbox" checked={routine.isComplete} onChange={() => toggleChoreCompletion && toggleChoreCompletion(routine._id)} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: memberColor }} />
                    <p style={{...titleStyle, textDecoration: routine.isComplete ? 'line-through' : 'none', opacity: routine.isComplete ? 0.7 : 1 }}>{routine.title}</p>
                </div>
            ))}
        </div>
    );
};

const UserProfilePage = () => {
    const { memberId } = useParams();
    const { state: familyState } = useFamily();
    const { state: calendarState } = useCalendar();
    const { state: listState } = useLists();
    const { state: choreState, actions: choreActions } = useChores();
    
    const [selectedListId, setSelectedListId] = useState(null);
    const [taskView, setTaskView] = useState('chores'); // 'chores' or 'routines'
    const [routineCategory, setRoutineCategory] = useState(getCurrentTimeCategory()); // 'Morning', 'Day', or 'Night'
    const [cardHeight, setCardHeight] = useState('auto'); // For flip animation height

    const frontRef = useRef(null);
    const backRef = useRef(null);

    const member = familyState.family?.members.find(m => m.userId._id === memberId);
    const today = new Date();

    const { dailyEvents, assignedLists, assignedChores, morningRoutines, dayRoutines, nightRoutines, totalPoints } = useMemo(() => {
        const dailyEvents = calendarState.events.filter(event => {
            const eventStart = new Date(event.startTime);
            return event.assignedTo.some(a => a._id === memberId) && today.toDateString() === eventStart.toDateString();
        });

        const assignedLists = listState.lists.filter(list => list.assignedTo.some(assignee => assignee._id === memberId));
        
        const allAssignedTasks = choreState.chores.filter(chore => chore.assignedTo?._id === memberId);
        const assignedChores = allAssignedTasks.filter(task => task.points > 0);
        const assignedRoutines = allAssignedTasks.filter(task => task.points === 0);
        
        const morningRoutines = assignedRoutines.filter(r => r.routineCategory === 'Morning');
        const dayRoutines = assignedRoutines.filter(r => r.routineCategory === 'Day');
        const nightRoutines = assignedRoutines.filter(r => r.routineCategory === 'Night');

        const totalPoints = choreActions.calculateUserPoints(memberId);

        return { dailyEvents, assignedLists, assignedChores, morningRoutines, dayRoutines, nightRoutines, totalPoints };
    }, [memberId, calendarState.events, listState.lists, choreState.chores, choreActions]);

    // --- UPDATED --- Effect to calculate the height of the flip card
    useLayoutEffect(() => {
        const frontHeight = frontRef.current?.scrollHeight || 0;
        const backHeight = backRef.current?.scrollHeight || 0;
        // The Card component has 24px padding top and bottom (theme.spacing.lg)
        const verticalPadding = 48;
        setCardHeight(Math.max(frontHeight, backHeight) + verticalPadding);
    }, [assignedChores, morningRoutines, dayRoutines, nightRoutines, routineCategory]);


    const listForModal = selectedListId ? listState.lists.find(l => l._id === selectedListId) : null;

    if (!member) return <div>Member not found.</div>;

    const toggleButtonStyle = (isActive, activeColor = theme.colors.primaryBrand, inactiveColor = theme.colors.textSecondary) => ({
        background: 'none', border: 'none', cursor: 'pointer', padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        fontWeight: isActive ? 'bold' : 'normal', color: isActive ? activeColor : inactiveColor,
        borderBottom: isActive ? `2px solid ${activeColor}` : '2px solid transparent',
    });

    const timeBasedStyles = {
        Morning: { background: 'linear-gradient(135deg, #FFF3B0 0%, #FFC1A1 100%)', color: theme.colors.textPrimary },
        Day: { background: 'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)', color: theme.colors.textPrimary },
        Night: { background: 'linear-gradient(135deg, #09203F 0%, #537895 100%)', color: 'white' },
    };

    const backCardStyle = {
        ...timeBasedStyles[routineCategory]
    };

    return (
        <div style={{ fontFamily: theme.typography.fontFamily }}>
            <style>{`
                .flip-card-container {
                    background-color: transparent;
                    perspective: 1000px;
                }
                .flip-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                }
                .flip-card-container.flipped .flip-card-inner {
                    transform: rotateY(180deg);
                }
                .flip-card-front, .flip-card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    -webkit-backface-visibility: hidden; /* Safari */
                    backface-visibility: hidden;
                }
                .flip-card-back {
                    transform: rotateY(180deg);
                }
            `}</style>

            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: member.color }}></div>
                <div>
                    <h1 style={theme.typography.h1}>{member.userId.displayName}</h1>
                    <p style={{ ...theme.typography.h4, color: theme.colors.secondaryBrand }}>{totalPoints} Points Earned</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: theme.spacing.lg, alignItems: 'start' }}>
                <Card>
                    <h2 style={theme.typography.h3}>Today's Schedule</h2>
                    {dailyEvents.length > 0 ? dailyEvents.map(event => (
                        <div key={event._id} style={{ marginTop: theme.spacing.md }}>
                            <p style={{ fontWeight: 'bold' }}>{event.title}</p>
                            <p style={theme.typography.caption}>{new Date(event.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                        </div>
                    )) : <p>No events today.</p>}
                </Card>
                
                <div className={`flip-card-container ${taskView === 'routines' ? 'flipped' : ''}`} style={{ height: cardHeight }}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <Card style={{height: '100%'}}>
                                <div ref={frontRef}>
                                    <h2 style={theme.typography.h3}>Chores</h2>
                                    <div style={{ display: 'flex', gap: theme.spacing.md, borderBottom: `1px solid #eee`, marginBottom: theme.spacing.md }}>
                                        <button style={toggleButtonStyle(taskView === 'chores')} onClick={() => setTaskView('chores')}>Chores</button>
                                        <button style={toggleButtonStyle(taskView === 'routines')} onClick={() => setTaskView('routines')}>Routines</button>
                                    </div>
                                    {assignedChores.length > 0 ? assignedChores.map(chore => (
                                        <p key={chore._id} style={{ textDecoration: chore.isComplete ? 'line-through' : 'none', padding: '4px 0' }}>{chore.title} ({chore.points} pts)</p>
                                    )) : <p>No chores assigned.</p>}
                                </div>
                            </Card>
                        </div>
                        <div className="flip-card-back">
                             <Card style={{...backCardStyle, height: '100%'}}>
                                <div ref={backRef}>
                                    <h2 style={{...theme.typography.h3, color: backCardStyle.color}}>Routines</h2>
                                    <div style={{ display: 'flex', gap: theme.spacing.md, borderBottom: `1px solid rgba(255,255,255,0.2)`, marginBottom: theme.spacing.md }}>
                                        <button style={toggleButtonStyle(taskView === 'chores', backCardStyle.color, 'rgba(255,255,255,0.7)')} onClick={() => setTaskView('chores')}>Chores</button>
                                        <button style={toggleButtonStyle(taskView === 'routines', backCardStyle.color, 'rgba(255,255,255,0.7)')} onClick={() => setTaskView('routines')}>Routines</button>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: theme.spacing.md, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: theme.borderRadius.medium, padding: theme.spacing.xs }}>
                                            <button style={toggleButtonStyle(routineCategory === 'Morning', backCardStyle.color, 'rgba(255,255,255,0.7)')} onClick={() => setRoutineCategory('Morning')}>Morning</button>
                                            <button style={toggleButtonStyle(routineCategory === 'Day', backCardStyle.color, 'rgba(255,255,255,0.7)')} onClick={() => setRoutineCategory('Day')}>Day</button>
                                            <button style={toggleButtonStyle(routineCategory === 'Night', backCardStyle.color, 'rgba(255,255,255,0.7)')} onClick={() => setRoutineCategory('Night')}>Night</button>
                                        </div>
                                        {routineCategory === 'Morning' && <RoutineList routines={morningRoutines} memberColor={member.color} textColor={backCardStyle.color} />}
                                        {routineCategory === 'Day' && <RoutineList routines={dayRoutines} memberColor={member.color} textColor={backCardStyle.color} />}
                                        {routineCategory === 'Night' && <RoutineList routines={nightRoutines} memberColor={member.color} textColor={backCardStyle.color} />}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                <Card>
                    <h2 style={theme.typography.h3}>Assigned Lists</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
                        {assignedLists.length > 0 ? assignedLists.map(list => (
                            <div key={list._id} style={{...theme.typography.body, fontWeight: '600', padding: theme.spacing.sm, borderRadius: theme.borderRadius.medium, cursor: 'pointer', backgroundColor: theme.colors.neutralBackground}} onClick={() => setSelectedListId(list._id)}>
                                {list.name}
                            </div>
                        )) : <p>No lists assigned.</p>}
                    </div>
                </Card>
            </div>

            {listForModal && <InteractiveListModal list={listForModal} onClose={() => setSelectedListId(null)} />}
        </div>
    );
};

export default UserProfilePage;
