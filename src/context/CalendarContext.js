import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { ModalContext } from './ModalContext';
import { api } from '../api/api';

export const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    const { session } = useContext(AuthContext);
    const { showModal, hideModal } = useContext(ModalContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial fetch for events when the component loads or household changes
    const fetchEvents = useCallback(async () => {
        if (session.mode !== 'loading' && session.activeHouseholdId) {
            setLoading(true);
            try {
                const data = await api.get(`/households/${session.activeHouseholdId}/events`);
                const formattedEvents = (data || []).map(event => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end)
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Failed to fetch events:", error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        } else if (session.mode !== 'loading') {
            setEvents([]);
            setLoading(false);
        }
    }, [session.activeHouseholdId, session.mode]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // --- WebSocket Integration for Real-Time Updates ---
    useEffect(() => {
        // Only set up listeners if the socket connection exists
        if (session.socket && session.activeHouseholdId) {
            
            // Listener for when a new event is created by anyone in the household
            const handleEventCreated = (newEvent) => {
                setEvents(prevEvents => [...prevEvents, { ...newEvent, start: new Date(newEvent.start), end: new Date(newEvent.end) }]);
            };

            // Listener for when an event is updated
            const handleEventUpdated = (updatedEvent) => {
                setEvents(prevEvents => prevEvents.map(event =>
                    event._id === updatedEvent._id ? { ...updatedEvent, start: new Date(updatedEvent.start), end: new Date(updatedEvent.end) } : event
                ));
            };

            // Listener for when an event is deleted
            const handleEventDeleted = (eventId) => {
                setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
            };

            // Register the listeners
            session.socket.on('event_created', handleEventCreated);
            session.socket.on('event_updated', handleEventUpdated);
            session.socket.on('event_deleted', handleEventDeleted);

            // Cleanup function to remove listeners when the component unmounts or dependencies change
            return () => {
                session.socket.off('event_created', handleEventCreated);
                session.socket.off('event_updated', handleEventUpdated);
                session.socket.off('event_deleted', handleEventDeleted);
            };
        }
    }, [session.socket, session.activeHouseholdId]);

    // --- Action Functions (now simplified) ---

    const addEvent = useCallback(async (eventData) => {
        if (!session.activeHouseholdId) return;
        try {
            // The backend will now emit a WebSocket event on success. No need to fetchEvents().
            await api.post(`/households/${session.activeHouseholdId}/events`, eventData);
        } catch (error) {
            console.error("Failed to add event:", error);
            throw new Error("Error adding event");
        }
    }, [session.activeHouseholdId]);

    const updateEvent = useCallback(async (eventId, updateData) => {
        if (!session.activeHouseholdId) return;
        try {
            // The backend will now emit a WebSocket event on success. No need to fetchEvents().
            await api.put(`/households/${session.activeHouseholdId}/events/${eventId}`, updateData);
        } catch (error) {
            console.error("Failed to update event:", error);
            throw new Error("Error updating event");
        }
    }, [session.activeHouseholdId]);

    const deleteEvent = useCallback(async (eventId) => {
        if (!session.activeHouseholdId) return;
        try {
            // The backend will now emit a WebSocket event on success. No need to fetchEvents().
            await api.delete(`/households/${session.activeHouseholdId}/events/${eventId}`);
            hideModal();
        } catch (error) {
            console.error("Failed to delete event:", error);
            throw new Error("Error deleting event");
        }
    }, [session.activeHouseholdId, hideModal]);

    const value = useMemo(() => ({
        events,
        loading,
        addEvent,
        updateEvent,
        deleteEvent,
        refreshCalendar: fetchEvents // Keep for manual refresh if needed
    }), [events, loading, addEvent, updateEvent, deleteEvent, fetchEvents]);

    return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};

