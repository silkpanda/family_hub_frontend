import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import CalendarService from '../services/calendar.service.js';
import { SocketContext } from './SocketContext.js';

export const CalendarContext = createContext();

// Define reducer actions
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_EVENTS: 'SET_EVENTS',
  ADD_EVENT: 'ADD_EVENT',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  SET_ERROR: 'SET_ERROR',
};

// Reducer function to manage state
const calendarReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: true };
    case actionTypes.SET_EVENTS:
      return { ...state, loading: false, events: action.payload, error: null };
    case actionTypes.ADD_EVENT:
      if (state.events.find(event => event._id === action.payload._id)) {
        return state;
      }
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

// Context Provider Component
export const CalendarProvider = ({ children }) => {
  const initialState = {
    events: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const socket = useContext(SocketContext);

  // This effect handles real-time updates from OTHER users.
  useEffect(() => {
    if (socket) {
      socket.on('event:created', (newEvent) => {
        dispatch({ type: actionTypes.ADD_EVENT, payload: newEvent });
      });
      socket.on('event:updated', (updatedEvent) => {
        dispatch({ type: actionTypes.UPDATE_EVENT, payload: updatedEvent });
      });
      socket.on('event:deleted', (data) => {
        dispatch({ type: actionTypes.DELETE_EVENT, payload: { id: data.id } });
      });
      return () => {
        socket.off('event:created');
        socket.off('event:updated');
        socket.off('event:deleted');
      };
    }
  }, [socket]);

  const fetchEvents = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await CalendarService.getEvents();
      dispatch({ type: actionTypes.SET_EVENTS, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const addEvent = useCallback(async (eventData) => {
    try {
      const response = await CalendarService.createEvent(eventData);
      dispatch({ type: actionTypes.ADD_EVENT, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  // --- CORRECTED LOGIC for updateEvent ---
  const updateEvent = useCallback(async (id, eventData) => {
    try {
      const response = await CalendarService.updateEvent(id, eventData);
      dispatch({ type: actionTypes.UPDATE_EVENT, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  // --- CORRECTED LOGIC for deleteEvent ---
  const deleteEvent = useCallback(async (id) => {
    try {
      await CalendarService.deleteEvent(id);
      dispatch({ type: actionTypes.DELETE_EVENT, payload: { id } });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

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
