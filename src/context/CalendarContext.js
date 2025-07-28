// Purpose: This is the state management hub for the calendar feature. It holds the
// "single source of truth" for all event data and provides functions to modify that data.
// ===================================================================================
import React, { createContext, useReducer, useMemo, useCallback } from 'react';
import CalendarService from '../services/calendar.service.js';

export const CalendarContext = createContext();

// --- Reducer Actions ---
// Defines the types of state mutations that are possible.
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_EVENTS: 'SET_EVENTS',
  ADD_EVENT: 'ADD_EVENT',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  SET_ERROR: 'SET_ERROR',
};

// --- Reducer Function ---
// A pure function that takes the current state and an action, and returns the new state.
const calendarReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: true, error: null };
    case actionTypes.SET_EVENTS:
      return { ...state, loading: false, events: action.payload };
    case actionTypes.ADD_EVENT:
      return { ...state, events: [...state.events, action.payload] };
    case actionTypes.UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map((event) =>
          event._id === action.payload._id ? action.payload : event
        ),
      };
    case actionTypes.DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((event) => event._id !== action.payload.id),
      };
    case actionTypes.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- Context Provider Component ---
export const CalendarProvider = ({ children }) => {
  const initialState = {
    events: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(calendarReducer, initialState);

  // --- Actions ---
  // These are the functions that UI components will call. They are wrapped in `useCallback`
  // with the `dispatch` dependency to ensure they are stable and don't cause re-renders.
  const fetchEvents = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
        const response = await CalendarService.getEvents();
        dispatch({ type: actionTypes.SET_EVENTS, payload: response.data });
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);

  const addEvent = useCallback(async (eventData) => {
    try {
        const response = await CalendarService.createEvent(eventData);
        dispatch({ type: actionTypes.ADD_EVENT, payload: response.data });
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);

  const updateEvent = useCallback(async (id, eventData) => {
    try {
        const response = await CalendarService.updateEvent(id, eventData);
        dispatch({ type: actionTypes.UPDATE_EVENT, payload: response.data });
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);

  const deleteEvent = useCallback(async (id) => {
    try {
        await CalendarService.deleteEvent(id);
        dispatch({ type: actionTypes.DELETE_EVENT, payload: { id } });
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);

  // The `useMemo` hook ensures that the context value object itself is stable,
  // preventing unnecessary re-renders in consumer components.
  const contextValue = useMemo(() => ({
    ...state,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  }), [state, fetchEvents, addEvent, updateEvent, deleteEvent]);

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
};