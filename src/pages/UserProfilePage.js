// --- File: /frontend/src/pages/UserProfilePage.js ---
// Displays a detailed profile for a family member, including their schedule, chores, and lists.

import React, { useState, useMemo, useLayoutEffect, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFamily } from '../context/FamilyContext';
import { useCalendar } from '../context/CalendarContext';
import { useLists } from '../context/ListContext';
import { useChores } from '../context/ChoreContext';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../theme/theme';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import InteractiveListModal from '../components/profile/InteractiveListModal';

const getCurrentTimeCategory = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Morning';
    if (currentHour < 17) return 'Day';
    return 'Night';
};

// RoutineList: Displays a list of routines for a specific time of day.
const RoutineList = ({ routines, memberColor, textColor, isDark }) => {
    const { actions } = useChores();
    const { toggleChoreCompletion } = actions;
    const routineItemStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.md, padding: `${theme.spacing.xs} 0` };
    const titleStyle = { ...theme.typography.body, fontWeight: '600', textDecoration: 'none', color: textColor, textShadow: isDark ? '0px 1px 2px rgba(0, 0, 0, 0.5)' : 'none' };
    return ( <div style={{ display: 'flex', flexDirection: 'column' }}> {routines.map(routine => ( <div key={routine._id} style={routineItemStyle}> <input type="checkbox" checked={routine.isComplete} onChange={() => toggleChoreCompletion && toggleChoreCompletion(routine._id)} style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: memberColor }} /> <p style={{...titleStyle, textDecoration: routine.isComplete ? 'line-through' : 'none', opacity: routine.isComplete ? 0.7 : 1 }}>{routine.title}</p> </div> ))} </div> );
};

// ChoreList: Displays a list of point-based chores.
const ChoreList = ({ chores, memberId }) => {
    const { actions } = useChores();
    const { completeChoreForChild } = actions;
    const choreItemStyle = { display: 'flex', alignItems: 'center', gap: theme.spacing.md, padding: '4px 0' };
    const titleStyle = { ...theme.typography.body, fontWeight: '600' };

    return (
        <div>
            {chores.map(chore => (
                <div key={chore._id} style={choreItemStyle}>
                    <input 
                        type="checkbox" 
                        checked={chore.status === 'Completed' || chore.status === 'Pending Approval'} 
                        onChange={() => completeChoreForChild && completeChoreForChild(chore._id, memberId)} 
                        disabled={chore.status !== 'Incomplete'} 
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
                    />
                    <p style={{...titleStyle, textDecoration: chore.status === 'Completed' ? 'line-through' : 'none', opacity: chore.status === 'Completed' ? 0.7 : 1 }}>
                        {chore.title} ({chore.points} pts)
                        {chore.status === 'Pending Approval' && <span style={{ fontStyle: 'italic', color: theme.colors.accentAction, marginLeft: '8px' }}>(Pending)</span>}
                    </p>
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
    const { isAuthenticated } = useContext(AuthContext);
    
    const { family, loading: familyLoading } = familyState;
    const { events, loading: calendarLoading } = calendarState;
    const { lists, loading: listsLoading } = listState;
    const { chores, loading: choresLoading } = choreState;

    const [selectedListId, setSelectedListId] = useState(null);
    const [taskView, setTaskView] = useState('chores');
    const [routineCategory, setRoutineCategory] = useState(getCurrentTimeCategory());
    const [cardHeight, setCardHeight] = useState('auto');
    const frontRef = useRef(null);
    const backRef = useRef(null);
    const today = new Date();

    const { dailyEvents, assignedLists, assignedChores, morningRoutines, dayRoutines, nightRoutines, totalPoints } = useMemo(() => {
        const todayString = today.toDateString();
        const safeEvents = Array.isArray(events) ? events : [];
        const safeLists = Array.isArray(lists) ? lists : [];
        const safeChores = Array.isArray(chores) ? chores : [];
        const dailyEvents = safeEvents.filter(event => new Date(event.startTime).toDateString() === todayString && event.assignedTo.some(assignee => (assignee._id || assignee) === memberId));
        const assignedLists = safeLists.filter(list => list.assignedTo.some(assignee => (assignee._id || assignee) === memberId));
        const allAssignedTasks = safeChores.filter(chore => (chore.assignedTo?._id || chore.assignedTo) === memberId);
        const assignedChores = allAssignedTasks.filter(task => task.points > 0);
        const assignedRoutines = allAssignedTasks.filter(task => task.points === 0);
        const morningRoutines = assignedRoutines.filter(r => r.routineCategory === 'Morning');
        const dayRoutines = assignedRoutines.filter(r => r.routineCategory === 'Day');
        const nightRoutines = assignedRoutines.filter(r => r.routineCategory === 'Night');
        const totalPoints = choreActions.calculateUserPoints(memberId);
        return { dailyEvents, assignedLists, assignedChores, morningRoutines, dayRoutines, nightRoutines, totalPoints };
    }, [memberId, events, lists, chores, choreActions]);

    useLayoutEffect(() => {
        const frontHeight = frontRef.current?.scrollHeight || 0;
        const backHeight = backRef.current?.scrollHeight || 0;
        const verticalPadding = 48;
        setCardHeight(Math.max(frontHeight, backHeight) + verticalPadding);
    }, [assignedChores, morningRoutines, dayRoutines, nightRoutines, routineCategory]);

    if (familyLoading || calendarLoading || listsLoading || choresLoading || !family) {
        return <div style={{padding: theme.spacing.lg, textAlign: 'center'}}>Loading profile...</div>;
    }

    const member = family.members.find(m => m.userId._id === memberId);
    const listForModal = selectedListId ? lists.find(l => l._id === selectedListId) : null;

    if (!member) {
        return (
            <div style={{ padding: theme.spacing.xl, textAlign: 'center', color: theme.colors.textSecondary }}>
                <h2 style={theme.typography.h2}>Member Not Found</h2>
                <p>Could not find a profile for this user in the family.</p>
            </div>
        );
    }

    const timeBasedStyles = {
        Morning: { background: 'linear-gradient(135deg, #FFF3B0 0%, #FFC1A1 100%)', color: theme.colors.textPrimary, isDark: false },
        Day: { background: 'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)', color: theme.colors.textPrimary, isDark: false },
        Night: { background: 'linear-gradient(135deg, #09203F 0%, #537895 100%)', color: 'white', isDark: true },
    };
    const backCardStyle = timeBasedStyles[routineCategory];
    const inactiveToggleColor = backCardStyle.isDark ? 'rgba(255,255,255,0.7)' : theme.colors.textSecondary;
    const toggleButtonStyle = (isActive, activeColor = theme.colors.primaryBrand, inactiveColor = theme.colors.textSecondary) => ({ background: 'none', border: 'none', cursor: 'pointer', padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontWeight: isActive ? 'bold' : 'normal', color: isActive ? activeColor : inactiveColor, borderBottom: isActive ? `2px solid ${activeColor}` : '2px solid transparent' });

    return (
        <div style={{ fontFamily: theme.typography.fontFamily, position: 'relative', padding: theme.spacing.lg }}>
            <style>{`.flip-card-container{background-color:transparent;perspective:1000px}.flip-card-inner{position:relative;width:100%;height:100%;transition:transform .6s;transform-style:preserve-3d}.flip-card-container.flipped .flip-card-inner{transform:rotateY(180deg)}.flip-card-front,.flip-card-back{position:absolute;width:100%;height:100%;-webkit-backface-visibility:hidden;backface-visibility:hidden}.flip-card-back{transform:rotateY(180deg)}`}</style>
            
            {!isAuthenticated && (
                <Link to="/" style={{ position: 'absolute', top: theme.spacing.lg, right: theme.spacing.lg, textDecoration: 'none' }}>
                    <Button variant="tertiary">Back to Dashboard</Button>
                </Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.xl }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: member.color }}></div>
                    <div>
                        <h1 style={theme.typography.h1}>{member.userId.displayName}</h1>
                        <p style={{ ...theme.typography.h4, color: theme.colors.secondaryBrand }}>{totalPoints} Points Earned</p>
                    </div>
                </div>
                <Link to="/store"><Button variant="secondary">View Rewards</Button></Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: theme.spacing.lg, alignItems: 'start' }}>
                <Card>
                    <h2 style={theme.typography.h3}>Today's Schedule</h2>
                    {dailyEvents.length > 0 ? dailyEvents.map(event => ( <div key={event._id} style={{ marginTop: theme.spacing.md }}> <p style={{ fontWeight: 'bold' }}>{event.title}</p> <p style={theme.typography.caption}>{new Date(event.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p> </div> )) : <p>No events today.</p>}
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
                                    {assignedChores.length > 0 ? <ChoreList chores={assignedChores} memberId={memberId} /> : <p>No chores assigned.</p>}
                                </div>
                            </Card>
                        </div>
                        <div className="flip-card-back">
                             <Card style={{...backCardStyle, height: '100%'}}>
                                <div ref={backRef}>
                                    <h2 style={{...theme.typography.h3, color: backCardStyle.color}}>Routines</h2>
                                    <div style={{ display: 'flex', gap: theme.spacing.md, borderBottom: `1px solid rgba(255,255,255,0.2)`, marginBottom: theme.spacing.md }}>
                                        <button style={toggleButtonStyle(taskView === 'chores', backCardStyle.color, inactiveToggleColor)} onClick={() => setTaskView('chores')}>Chores</button>
                                        <button style={toggleButtonStyle(taskView === 'routines', backCardStyle.color, inactiveToggleColor)} onClick={() => setTaskView('routines')}>Routines</button>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: theme.spacing.md, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: theme.borderRadius.medium, padding: theme.spacing.xs }}>
                                            <button style={toggleButtonStyle(routineCategory === 'Morning', backCardStyle.color, inactiveToggleColor)} onClick={() => setRoutineCategory('Morning')}>Morning</button>
                                            <button style={toggleButtonStyle(routineCategory === 'Day', backCardStyle.color, inactiveToggleColor)} onClick={() => setRoutineCategory('Day')}>Day</button>
                                            <button style={toggleButtonStyle(routineCategory === 'Night', backCardStyle.color, inactiveToggleColor)} onClick={() => setRoutineCategory('Night')}>Night</button>
                                        </div>
                                        {routineCategory === 'Morning' && <RoutineList routines={morningRoutines} memberColor={member.color} textColor={backCardStyle.color} isDark={backCardStyle.isDark} />}
                                        {routineCategory === 'Day' && <RoutineList routines={dayRoutines} memberColor={member.color} textColor={backCardStyle.color} isDark={backCardStyle.isDark} />}
                                        {routineCategory === 'Night' && <RoutineList routines={nightRoutines} memberColor={member.color} textColor={backCardStyle.color} isDark={backCardStyle.isDark} />}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                <Card>
                    <h2 style={theme.typography.h3}>Assigned Lists</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
                        {assignedLists.length > 0 ? assignedLists.map(list => ( <div key={list._id} style={{...theme.typography.body, fontWeight: '600', padding: theme.spacing.sm, borderRadius: theme.borderRadius.medium, cursor: 'pointer', backgroundColor: theme.colors.neutralBackground}} onClick={() => setSelectedListId(list._id)}> {list.name} </div> )) : <p>No lists assigned.</p>}
                    </div>
                </Card>
            </div>

            {listForModal && <InteractiveListModal list={listForModal} onClose={() => setSelectedListId(null)} />}
        </div>
    );
};

export default UserProfilePage;