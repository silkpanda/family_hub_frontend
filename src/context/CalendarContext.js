import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import { api } from '../api/api';
import { useSocket } from './SocketContext';
import { useModal } from './ModalContext';

export const CalendarContext = createContext();

export const useCalendar = () => {
    return useContext(CalendarContext);
};

export const CalendarProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();
    const { hideModal } = useModal(); // Removed unused 'showModal'

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.get('/calendar/events');
            setEvents(
                data.map((event) => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                }))
            );
        } catch (error) {
            console.error('Failed to fetch calendar events:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // Listen for real-time updates from the server
    useEffect(() => {
        if (socket) {
            const handleUpdate = () => {
                console.log(
                    '[CalendarContext] Received calendar_updated event. Refetching events.'
                );
                fetchEvents();
            };

            socket.on('calendar_updated', handleUpdate);

            return () => {
                socket.off('calendar_updated', handleUpdate);
            };
        }
    }, [socket, fetchEvents]);

    const addEvent = async (eventData) => {
        try {
            const newEvent = await api.post('/calendar/events', eventData);
            setEvents((prev) => [
                ...prev,
                {
                    ...newEvent,
                    start: new Date(newEvent.start),
                    end: new Date(newEvent.end),
                },
            ]);
            hideModal();
        } catch (error) {
            console.error('Failed to add event:', error);
        }
    };

    const updateEvent = async (eventId, eventData) => {
        try {
            const updatedEvent = await api.put(
                `/calendar/events/${eventId}`,
                eventData
            );
            setEvents((prev) =>
                prev.map((e) =>
                    e._id === eventId
                        ? {
                              ...updatedEvent,
                              start: new Date(updatedEvent.start),
                              end: new Date(updatedEvent.end),
                          }
                        : e
                )
            );
            hideModal();
        } catch (error) {
            console.error('Failed to update event:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await api.delete(`/calendar/events/${eventId}`);
            setEvents((prev) => prev.filter((e) => e._id !== eventId));
            hideModal();
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const value = {
        events,
        loading,
        addEvent,
        updateEvent,
        deleteEvent,
        fetchEvents, // Expose fetchEvents for manual refresh if needed
    };

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
};

