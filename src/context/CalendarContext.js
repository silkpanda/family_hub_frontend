// ===================================================================================
// File: /frontend/src/context/CalendarContext.js
// Purpose: Manages all state and actions for the Calendar feature.
//
// --- DEBUGGING UPDATE (Step 2) ---
// The core logic of this file remains the same. The structure has been slightly
// refactored to ensure the exports are as clear as possible for the compiler.
//
// 1.  No Self-Imports: This version is guaranteed to not have any erroneous
//     `import ... from './CalendarContext'` lines, which was the likely cause
//     of the compilation errors.
//
// 2.  Explicit Context Export: We are now also exporting the `CalendarContext`
//     itself. This is a common and robust pattern.
// ===================================================================================
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import CalendarService from '../services/calendar.service.js';
import { socket } from './SocketContext.js';
import { AuthContext } from './AuthContext.js';

// Export the context itself so it can be used directly if needed elsewhere.
export const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    // This provides a safe fallback and a clear error message if the hook is used
    // outside of the provider, which is a common source of bugs.
    return {
      state: { events: [], loading: true, error: 'useCalendar must be used within a CalendarProvider' },
      actions: {}
    };
  }
  return context;
};

// Action types are kept constant to prevent typos and for easy reference.
const actionTypes = {
    SET_LOADING: 'SET_LOADING',
    SET_EVENTS: 'SET_EVENTS',
    ADD_EVENT: 'ADD_EVENT',
    UPDATE_EVENT: 'UPDATE_EVENT',
    DELETE_EVENT: 'DELETE_EVENT',
    SET_ERROR: 'SET_ERROR'
};

const calendarReducer = (state, action) => {
  console.log(`[CalendarContext] Reducer Action: ${action.type}`);
  switch (action.type) {
    case actionTypes.SET_LOADING: return { ...state, loading: true };
    case actionTypes.SET_EVENTS: return { ...state, loading: false, events: action.payload, error: null };
    case actionTypes.ADD_EVENT: return { ...state, events: [...state.events, action.payload] };
    case actionTypes.UPDATE_EVENT: return { ...state, events: state.events.map(event => event._id === action.payload._id ? action.payload : event) };
    case actionTypes.DELETE_EVENT: return { ...state, events: state.events.filter(event => event._id !== action.payload.id) };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export const CalendarProvider = ({ children }) => {
  const initialState = { events: [], loading: true, error: null };
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const { isAuthenticated, isReady } = useContext(AuthContext);

  // Effect for handling real-time updates via WebSockets.
  useEffect(() => {
    if (socket) {
      const handleCreated = (newEvent) => {
        console.log('[Socket] Received event:created', newEvent);
        dispatch({ type: actionTypes.ADD_EVENT, payload: newEvent });
      };
      const handleUpdated = (updatedEvent) => {
        console.log('[Socket] Received event:updated', updatedEvent);
        dispatch({ type: actionTypes.UPDATE_EVENT, payload: updatedEvent });
      };
      const handleDeleted = (data) => {
        console.log('[Socket] Received event:deleted', data);
        dispatch({ type: actionTypes.DELETE_EVENT, payload: data });
      };

      socket.on('event:created', handleCreated);
      socket.on('event:updated', handleUpdated);
      socket.on('event:deleted', handleDeleted);

      // Cleanup function to remove listeners when the component unmounts.
      return () => {
        socket.off('event:created', handleCreated);
        socket.off('event:updated', handleUpdated);
        socket.off('event:deleted', handleDeleted);
      };
    }
  }, []); // Empty dependency array means this effect runs once on mount.

  const fetchEvents = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await CalendarService.getEvents();
      dispatch({ type: actionTypes.SET_EVENTS, payload: response || [] });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  // Effect to fetch initial data when the user is authenticated.
  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchEvents();
    }
  }, [isReady, isAuthenticated, fetchEvents]);

  // API action functions wrapped in useCallback for performance.
  const createEvent = useCallback(async (eventData) => {
    try { await CalendarService.createEvent(eventData); } catch (err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);

  const updateEvent = useCallback(async (id, eventData) => {
    try { await CalendarService.updateEvent(id, eventData); } catch (err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);

  const deleteEvent = useCallback(async (id) => {
    try { await CalendarService.deleteEvent(id); } catch (err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);

  // Memoize the actions and the full context value to prevent unnecessary re-renders.
  const actions = useMemo(() => ({ createEvent, updateEvent, deleteEvent }), [createEvent, updateEvent, deleteEvent]);
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return <CalendarContext.Provider value={contextValue}>{children}</CalendarContext.Provider>;
};
