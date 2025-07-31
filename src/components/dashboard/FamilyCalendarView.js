// ===================================================================================
// File: /frontend/src/components/dashboard/FamilyCalendarView.js
// Purpose: Displays a horizontally scrollable view of each family member's daily schedule.
//
// --- UPDATE ---
// 1. Wrapped the MemberColumn in a Link from react-router-dom.
// 2. The entire column is now a clickable element that navigates to the
//    corresponding member's profile page.
// ===================================================================================
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
        textDecoration: 'none', // Remove underline from link
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

    return (
        <Card>
            <div style={containerStyle}>
                {members.map(member => (
                    <MemberColumn key={member.userId._id} member={member} events={events} />
                ))}
            </div>
        </Card>
    );
};

export default FamilyCalendarView;
