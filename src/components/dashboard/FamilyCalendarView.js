// --- File: /frontend/src/components/dashboard/FamilyCalendarView.js ---
// Displays a column-based view of today's events for each family member on the dashboard.

import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';

const MemberColumn = ({ member, events }) => {
    const memberEvents = events.filter(event =>
        event.assignedTo.some(assignee => assignee._id === member.userId._id)
    );

    const columnStyle = {
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
        textDecoration: 'none',
        color: 'inherit'
    };
    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        borderBottom: `2px solid ${member.color}`
    };
    const nameStyle = {
        ...theme.typography.h4,
        color: theme.colors.textPrimary,
    };
    const eventCardStyle = {
        backgroundColor: theme.colors.neutralBackground,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.medium,
        borderLeft: `5px solid ${member.color}`,
    };
    const eventTitleStyle = {
        ...theme.typography.body,
        fontWeight: '600',
    };
    const eventTimeStyle = {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    };

    const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    return (
        <Link to={`/profile/${member.userId._id}`} style={columnStyle}>
            <div style={headerStyle}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: member.color }}></div>
                <h3 style={nameStyle}>{member.userId.displayName}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                {memberEvents.length > 0 ? (
                    memberEvents.map(event => (
                        <div key={event._id} style={eventCardStyle}>
                            <p style={eventTitleStyle}>{event.title}</p>
                            <p style={eventTimeStyle}>{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ ...theme.typography.caption, color: theme.colors.textSecondary, textAlign: 'center', paddingTop: theme.spacing.lg }}>No events scheduled.</p>
                )}
            </div>
        </Link>
    );
};

const FamilyCalendarView = ({ events, members }) => {
    const containerStyle = {
        display: 'flex',
        gap: theme.spacing.lg,
        overflowX: 'auto',
        padding: theme.spacing.sm,
        paddingBottom: theme.spacing.md,
    };

    const sortByName = (a, b) => a.userId.displayName.localeCompare(b.userId.displayName);
    const parents = members.filter(m => m.role === 'Parent/Guardian').sort(sortByName);
    const children = members.filter(m => m.role === 'Child').sort(sortByName);
    const sortedMembers = [...parents, ...children];

    return (
        <Card>
            <div style={containerStyle}>
                {sortedMembers.map(member => (
                    <MemberColumn key={member.userId._id} member={member} events={events} />
                ))}
            </div>
        </Card>
    );
};

export default FamilyCalendarView;