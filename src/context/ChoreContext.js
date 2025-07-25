import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import ChoreService from '../services/chore.service.js';
import { SocketContext } from './SocketContext.js';

export const ChoreContext = createContext();

// --- Reducer Actions ---
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_CHORES: 'SET_CHORES',
  ADD_CHORE: 'ADD_CHORE',
  UPDATE_CHORE: 'UPDATE_CHORE',
  DELETE_CHORE: 'DELETE_CHORE',
  SET_ERROR: 'SET_ERROR',
};

// --- Reducer Function ---
const choreReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: true };
    case actionTypes.SET_CHORES:
      return { ...state, loading: false, chores: action.payload, error: null };
    case actionTypes.ADD_CHORE:
      return { ...state, chores: [...state.chores, action.payload] };
    case actionTypes.UPDATE_CHORE:
      return {
        ...state,
        chores: state.chores.map(chore => chore._id === action.payload._id ? action.payload : chore),
      };
    case actionTypes.DELETE_CHORE:
      return {
        ...state,
        chores: state.chores.filter(chore => chore._id !== action.payload.id),
      };
    case actionTypes.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- Context Provider ---
export const ChoreProvider = ({ children }) => {
  const initialState = {
    chores: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(choreReducer, initialState);
  const socket = useContext(SocketContext);

  // Real-time listeners for updates from other users
  useEffect(() => {
    if (socket) {
      socket.on('chore:created', (newChore) => dispatch({ type: actionTypes.ADD_CHORE, payload: newChore }));
      socket.on('chore:updated', (updatedChore) => dispatch({ type: actionTypes.UPDATE_CHORE, payload: updatedChore }));
      socket.on('chore:deleted', (data) => dispatch({ type: actionTypes.DELETE_CHORE, payload: data }));

      return () => {
        socket.off('chore:created');
        socket.off('chore:updated');
        socket.off('chore:deleted');
      };
    }
  }, [socket]);

  // --- Actions ---
  const fetchChores = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await ChoreService.getChores();
      dispatch({ type: actionTypes.SET_CHORES, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const createChore = useCallback(async (choreData) => {
    try {
      const response = await ChoreService.createChore(choreData);
      dispatch({ type: actionTypes.ADD_CHORE, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const updateChore = useCallback(async (id, choreData) => {
    try {
      const response = await ChoreService.updateChore(id, choreData);
      dispatch({ type: actionTypes.UPDATE_CHORE, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const deleteChore = useCallback(async (id) => {
    try {
      await ChoreService.deleteChore(id);
      dispatch({ type: actionTypes.DELETE_CHORE, payload: { id } });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const toggleChoreCompletion = useCallback(async (id) => {
    try {
      const response = await ChoreService.toggleChoreCompletion(id);
      dispatch({ type: actionTypes.UPDATE_CHORE, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...state,
    fetchChores,
    createChore,
    updateChore,
    deleteChore,
    toggleChoreCompletion,
  }), [state, fetchChores, createChore, updateChore, deleteChore, toggleChoreCompletion]);

  return (
    <ChoreContext.Provider value={contextValue}>
      {children}
    </ChoreContext.Provider>
  );
};
