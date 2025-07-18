import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../api/axiosConfig';
import { format, startOfDay, endOfDay, isSameDay } from 'date-fns';

function DashboardPage() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({ summary: '', description: '', start: '', end: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.get('/calendar/events');
            setEvents(response.data);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to fetch events.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSyncFromGoogle = async () => {
        setIsLoading(true);
        setError('');
        try {
            await api.get('/calendar/sync-from-google');
            alert('Calendar synced from Google!');
            fetchEvents(); // Refresh events after sync
        } catch (err) {
            console.error('Error syncing from Google:', err);
            setError('Failed to sync from Google Calendar.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const onDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleCreateEvent = async () => {
        setIsLoading(true);
        setError('');
        try {
            const eventData = {
                summary: newEvent.summary,
                description: newEvent.description,
                start: {
                    dateTime: new Date(date.setHours(newEvent.start.split(':')[0], newEvent.start.split(':')[1])),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get local timezone
                },
                end: {
                    dateTime: new Date(date.setHours(newEvent.end.split(':')[0], newEvent.end.split(':')[1])),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            };
            await api.post('/calendar/events', eventData);
            alert('Event created successfully!');
            setShowEventModal(false);
            setNewEvent({ summary: '', description: '', start: '', end: '' });
            fetchEvents(); // Refresh events
        } catch (err) {
            console.error('Error creating event:', err);
            setError('Failed to create event.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateEvent = async () => {
        setIsLoading(true);
        setError('');
        try {
            const eventData = {
                summary: selectedEvent.summary,
                description: selectedEvent.description,
                start: {
                    dateTime: new Date(selectedEvent.start.dateTime),
                    timeZone: selectedEvent.start.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                end: {
                    dateTime: new Date(selectedEvent.end.dateTime),
                    timeZone: selectedEvent.end.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
            };
            await api.put(`/calendar/events/${selectedEvent._id}`, eventData);
            alert('Event updated successfully!');
            setShowEventModal(false);
            setSelectedEvent(null);
            fetchEvents();
        } catch (err) {
            console.error('Error updating event:', err);
            setError('Failed to update event.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await api.delete(`/calendar/events/${selectedEvent._id}`);
            alert('Event deleted successfully!');
            setShowEventModal(false);
            setSelectedEvent(null);
            fetchEvents();
        } catch (err) {
            console.error('Error deleting event:', err);
            setError('Failed to delete event.');
        } finally {
            setIsLoading(false);
        }
    };

    const getEventsForDate = (dateToFilter) => {
        return events.filter(event =>
            isSameDay(new Date(event.start.dateTime), dateToFilter)
        ).sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime));
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dayEvents = getEventsForDate(date);
            return (
                <div style={styles.eventDotsContainer}>
                    {dayEvents.length > 0 && (
                        <div style={styles.eventDot} title={`${dayEvents.length} events`}></div>
                    )}
                </div>
            );
        }
        return null;
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && getEventsForDate(date).length > 0) {
            return 'has-events'; // Custom CSS class for days with events
        }
        return null;
    };


    return (
        <div style={styles.dashboardContainer}>
            <h1 style={styles.header}>Family Calendar Dashboard</h1>
            <button onClick={handleSyncFromGoogle} disabled={isLoading} style={styles.syncButton}>
                {isLoading ? 'Syncing...' : 'Sync from Google Calendar'}
            </button>
            {error && <p style={styles.errorText}>{error}</p>}

            <div style={styles.calendarContainer}>
                <Calendar
                    onChange={onDateChange}
                    value={date}
                    onClickDay={(value) => {
                        setDate(value);
                        setSelectedEvent(null); // Clear selected event when clicking a new day
                        setShowEventModal(true); // Open modal to add/view events for the day
                    }}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                />
                <div style={styles.eventListContainer}>
                    <h3>Events for {format(date, 'MMMM dd, yyyy')}</h3>
                    <button onClick={() => { setSelectedEvent(null); setNewEvent({ summary: '', description: '', start: '', end: '' }); setShowEventModal(true); }} style={styles.addEventButton}>
                        Add New Event
                    </button>
                    {getEventsForDate(date).length === 0 ? (
                        <p>No events for this day.</p>
                    ) : (
                        <ul style={styles.eventList}>
                            {getEventsForDate(date).map(event => (
                                <li key={event._id} style={styles.eventItem} onClick={() => { setSelectedEvent(event); setShowEventModal(true); }}>
                                    <strong>{event.summary}</strong>
                                    <p>{format(new Date(event.start.dateTime), 'hh:mm a')} - {format(new Date(event.end.dateTime), 'hh:mm a')}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {showEventModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3>{selectedEvent ? 'Edit Event' : `Add Event for ${format(date, 'MMMM dd, yyyy')}`}</h3>
                        <label>Summary:</label>
                        <input
                            type="text"
                            value={selectedEvent ? selectedEvent.summary : newEvent.summary}
                            onChange={(e) => selectedEvent ? setSelectedEvent({ ...selectedEvent, summary: e.target.value }) : setNewEvent({ ...newEvent, summary: e.target.value })}
                            style={styles.input}
                        />
                        <label>Description:</label>
                        <textarea
                            value={selectedEvent ? selectedEvent.description : newEvent.description}
                            onChange={(e) => selectedEvent ? setSelectedEvent({ ...selectedEvent, description: e.target.value }) : setNewEvent({ ...newEvent, description: e.target.value })}
                            style={styles.textarea}
                        ></textarea>
                        <label>Start Time (HH:MM):</label>
                        <input
                            type="time"
                            value={selectedEvent ? format(new Date(selectedEvent.start.dateTime), 'HH:mm') : newEvent.start}
                            onChange={(e) => selectedEvent ? setSelectedEvent({ ...selectedEvent, start: { ...selectedEvent.start, dateTime: new Date(date.setHours(e.target.value.split(':')[0], e.target.value.split(':')[1])) } }) : setNewEvent({ ...newEvent, start: e.target.value })}
                            style={styles.input}
                        />
                        <label>End Time (HH:MM):</label>
                        <input
                            type="time"
                            value={selectedEvent ? format(new Date(selectedEvent.end.dateTime), 'HH:mm') : newEvent.end}
                            onChange={(e) => selectedEvent ? setSelectedEvent({ ...selectedEvent, end: { ...selectedEvent.end, dateTime: new Date(date.setHours(e.target.value.split(':')[0], e.target.value.split(':')[1])) } }) : setNewEvent({ ...newEvent, end: e.target.value })}
                            style={styles.input}
                        />

                        <div style={styles.modalActions}>
                            {selectedEvent ? (
                                <>
                                    <button onClick={handleUpdateEvent} disabled={isLoading} style={styles.buttonPrimary}>
                                        {isLoading ? 'Updating...' : 'Update Event'}
                                    </button>
                                    <button onClick={handleDeleteEvent} disabled={isLoading} style={styles.buttonDanger}>
                                        {isLoading ? 'Deleting...' : 'Delete Event'}
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleCreateEvent} disabled={isLoading} style={styles.buttonPrimary}>
                                    {isLoading ? 'Creating...' : 'Create Event'}
                                </button>
                            )}
                            <button onClick={() => setShowEventModal(false)} style={styles.buttonSecondary}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    dashboardContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        color: '#333',
        marginBottom: '20px',
    },
    syncButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '20px',
    },
    errorText: {
        color: 'red',
        marginBottom: '10px',
    },
    calendarContainer: {
        display: 'flex',
        gap: '30px',
        width: '100%',
        maxWidth: '1200px',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    eventListContainer: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flex: 1,
        minWidth: '300px',
    },
    addEventButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        marginBottom: '15px',
    },
    eventList: {
        listStyle: 'none',
        padding: 0,
    },
    eventItem: {
        backgroundColor: '#e9ecef',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
        cursor: 'pointer',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        width: 'calc(100% - 20px)',
        padding: '10px',
        margin: '8px 0',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    textarea: {
        width: 'calc(100% - 20px)',
        padding: '10px',
        margin: '8px 0',
        borderRadius: '4px',
        border: '1px solid #ddd',
        minHeight: '80px',
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px',
    },
    buttonPrimary: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    buttonSecondary: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    buttonDanger: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    eventDotsContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '5px',
    },
    eventDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#007bff',
        borderRadius: '50%',
    }
};
