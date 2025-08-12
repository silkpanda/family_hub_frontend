// --- File: /frontend/src/context/CalendarContext.js ---
// Manages state for calendar events, including fetching, creating, updating, and deleting.

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import CalendarService from '../services/calendar.service.js';
import { SocketContext } from './SocketContext.js'; // Import context, not the socket instance.
import { useFamily } from './FamilyContext.js';

const CalendarContext = createContext();

// Custom hook for easy access to calendar context.
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    // Return a default state if used outside the provider to prevent crashes.
    return { state: { events: [], loading: true, error: null }, actions: {} };
  }
  return context;
};

// Action types for the reducer.
const actionTypes = { SET_LOADING: 'SET_LOADING', SET_EVENTS: 'SET_EVENTS', ADD_EVENT: 'ADD_EVENT', UPDATE_EVENT: 'UPDATE_EVENT', DELETE_EVENT: 'DELETE_EVENT', SET_ERROR: 'SET_ERROR' };

// Reducer to manage calendar state based on dispatched actions.
const calendarReducer = (state, action) => {
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
  const { state: familyState } = useFamily();
  const { socket } = useContext(SocketContext); // Get socket from context.

  // useEffect: Set up socket listeners for real-time event updates.
  useEffect(() => {
    if (socket) {
      socket.on('event:created', (newEvent) => dispatch({ type: actionTypes.ADD_EVENT, payload: newEvent }));
      socket.on('event:updated', (updatedEvent) => dispatch({ type: actionTypes.UPDATE_EVENT, payload: updatedEvent }));
      socket.on('event:deleted', (data) => dispatch({ type: actionTypes.DELETE_EVENT, payload: data }));
      return () => { // Cleanup listeners on component unmount.
        socket.off('event:created');
        socket.off('event:updated');
        socket.off('event:deleted');
      };
    }
  }, [socket]); // Add socket as a dependency.

  // fetchEvents: Fetches all events for the family from the backend.
  const fetchEvents = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await CalendarService.getEvents();
      dispatch({ type: actionTypes.SET_EVENTS, payload: response || [] });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  // useEffect: Fetch events when family data is available.
  useEffect(() => {
    if (familyState.family) {
      fetchEvents();
    }
  }, [familyState.family, fetchEvents]);

  // CRUD actions for events.
  const createEvent = useCallback(async (eventData) => {
      try { await CalendarService.createEvent(eventData); } catch (err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);
  const updateEvent = useCallback(async (id, eventData) => {
      try { await CalendarService.updateEvent(id, eventData); } catch (err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);
  const deleteEvent = useCallback(async (id) => {
      try { await CalendarService.deleteEvent(id); } catch (err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);

  const actions = useMemo(() => ({ createEvent, updateEvent, deleteEvent }), [createEvent, updateEvent, deleteEvent]);
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return <CalendarContext.Provider value={contextValue}>{children}</CalendarContext.Provider>;
};