import React, { createContext, useContext, useReducer, useEffect } from 'react';
import CalendarService from '../services/calendar.service.js';
import { SocketContext } from './SocketContext.js'; // Assumes you have this context

// Create the context
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

  // Real-time listeners
  useEffect(() => {
    if (socket) {
      // Listen for new events
      socket.on('event:created', (newEvent) => {
        dispatch({ type: actionTypes.ADD_EVENT, payload: newEvent });
      });

      // Listen for updated events
      socket.on('event:updated', (updatedEvent) => {
        dispatch({ type: actionTypes.UPDATE_EVENT, payload: updatedEvent });
      });

      // Listen for deleted events
      socket.on('event:deleted', (data) => {
        dispatch({ type: actionTypes.DELETE_EVENT, payload: { id: data.id } });
      });

      // Cleanup listeners on component unmount
      return () => {
        socket.off('event:created');
        socket.off('event:updated');
        socket.off('event:deleted');
      };
    }
  }, [socket]);

  // --- Actions ---

  const fetchEvents = async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await CalendarService.getEvents();
      dispatch({ type: actionTypes.SET_EVENTS, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  };

  const addEvent = async (eventData) => {
    try {
      // The server will broadcast the 'event:created' event,
      // so we don't need to dispatch ADD_EVENT here. The listener will catch it.
      await CalendarService.createEvent(eventData);
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      // The server broadcasts the update, so the listener will handle the state change.
      await CalendarService.updateEvent(id, eventData);
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  };

  const deleteEvent = async (id) => {
    try {
      // The server broadcasts the deletion, so the listener will handle it.
      await CalendarService.deleteEvent(id);
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        ...state,
        fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
