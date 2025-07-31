// ===================================================================================
// File: /frontend/src/context/CalendarContext.js
// Purpose: Manages all state and actions for the Calendar feature.
// ===================================================================================
import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';
import CalendarService from '../services/calendar.service.js';
import { AuthContext } from './AuthContext.js';
import { socket } from './SocketContext.js'; // Import the shared socket instance

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    return {
      state: { events: [], loading: true, error: 'useCalendar must be used within a CalendarProvider' },
      actions: {}
    };
  }
  return context;
};

// Define action types for the reducer
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_EVENTS: 'SET_EVENTS',
  ADD_EVENT: 'ADD_EVENT',      // For real-time updates
  UPDATE_EVENT: 'UPDATE_EVENT', // For real-time updates
  DELETE_EVENT: 'DELETE_EVENT', // For real-time updates
  SET_ERROR: 'SET_ERROR'
};

// Reducer function to manage calendar state
const calendarReducer = (state, action) => {
  console.log(`[CalendarContext] Reducer received action: ${action.type}, payload:`, action.payload);
  switch (action.type) {
    case actionTypes.SET_LOADING: return { ...state, loading: true, error: null };
    case actionTypes.SET_EVENTS: return { ...state, loading: false, events: action.payload };
    case actionTypes.ADD_EVENT:
      // Add the new event to the existing events array
      return { ...state, events: [...state.events, action.payload] };
    case actionTypes.UPDATE_EVENT:
      // Map over events and replace the updated one by matching _id
      return { ...state, events: state.events.map((event) => event._id === action.payload._id ? action.payload : event) };
    case actionTypes.DELETE_EVENT:
      // Filter out the deleted event by matching its _id
      return { ...state, events: state.events.filter((event) => event._id !== action.payload.id) };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export const CalendarProvider = ({ children }) => {
  const initialState = { events: [], loading: true, error: null };
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const { isAuthenticated, isReady } = useContext(AuthContext);

  // useEffect to set up and clean up Socket.IO listeners
  useEffect(() => {
    if (socket) {
      console.log('[CalendarContext] Setting up Socket.IO listeners for calendar events.');

      // Listener for a new event being created
      socket.on('event:created', (newEvent) => {
        console.log('[CalendarContext] Received "event:created" event:', newEvent.title);
        dispatch({ type: actionTypes.ADD_EVENT, payload: newEvent });
      });

      // Listener for an existing event being updated
      socket.on('event:updated', (updatedEvent) => {
        console.log('[CalendarContext] Received "event:updated" event:', updatedEvent.title);
        dispatch({ type: actionTypes.UPDATE_EVENT, payload: updatedEvent });
      });

      // Listener for an event being deleted
      socket.on('event:deleted', (data) => {
        console.log('[CalendarContext] Received "event:deleted" event for ID:', data.id);
        dispatch({ type: actionTypes.DELETE_EVENT, payload: data });
      });

      // Cleanup function: remove listeners when the component unmounts or effect re-runs
      return () => {
        console.log('[CalendarContext] Cleaning up Socket.IO listeners for calendar events.');
        socket.off('event:created');
        socket.off('event:updated');
        socket.off('event:deleted');
      };
    } else {
      console.log('[CalendarContext] Socket.IO instance not available for calendar context.');
    }
  }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount

  // Function to fetch all events from the API
  const fetchEvents = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await CalendarService.getEvents();
      console.log('[CalendarContext] Fetched events from API:', response.length, 'events.');
      dispatch({ type: actionTypes.SET_EVENTS, payload: response || [] });
    } catch (err) {
      console.error('[CalendarContext] Error fetching events:', err.message);
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);

  // Effect to trigger initial event fetch when authentication is ready
  useEffect(() => {
    console.log(`[CalendarContext] useEffect - isAuthenticated: ${isAuthenticated}, isReady: ${isReady}`);
    if (isReady && isAuthenticated) {
      fetchEvents();
    }
  }, [isReady, isAuthenticated, fetchEvents]);

  // Action creator for adding a new event
  // No need to dispatch ADD_EVENT here, as the backend will emit the socket event
  const addEvent = useCallback(async (eventData) => {
    try {
      const response = await CalendarService.createEvent(eventData);
      console.log('[CalendarContext] API Call: createEvent successful. (Socket should handle UI update)');
      return response; // Return the created event if calling component needs it
    } catch (err) {
      console.error('[CalendarContext] API Call: createEvent failed:', err.message);
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err; // Re-throw to allow component to handle
    }
  }, [dispatch]);

  // Action creator for updating an existing event
  // No need to dispatch UPDATE_EVENT here, as the backend will emit the socket event
  const updateEvent = useCallback(async (id, eventData) => {
    try {
      const response = await CalendarService.updateEvent(id, eventData);
      console.log('[CalendarContext] API Call: updateEvent successful. (Socket should handle UI update)');
      return response; // Return the updated event if calling component needs it
    } catch (err) {
      console.error('[CalendarContext] API Call: updateEvent failed:', err.message);
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [dispatch]);

  // Action creator for deleting an event
  // No need to dispatch DELETE_EVENT here, as the backend will emit the socket event
  const deleteEvent = useCallback(async (id) => {
    try {
      await CalendarService.deleteEvent(id);
      console.log('[CalendarContext] API Call: deleteEvent successful. (Socket should handle UI update)');
    } catch (err) {
      console.error('[CalendarContext] API Call: deleteEvent failed:', err.message);
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [dispatch]);

  // Memoize the actions object to prevent unnecessary re-renders in consuming components
  const actions = useMemo(() => ({ fetchEvents, addEvent, updateEvent, deleteEvent }), [fetchEvents, addEvent, updateEvent, deleteEvent]);
  
  // Memoize the context value
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return <CalendarContext.Provider value={contextValue}>{children}</CalendarContext.Provider>;
};