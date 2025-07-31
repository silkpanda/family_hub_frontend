// ===================================================================================
// File: /frontend/src/context/ChoreContext.js
// Purpose: Manages all state and actions for the Chores feature.
//
// --- UPDATE ---
// 1. Added a `calculateUserPoints` function to the exported actions.
// 2. This function allows other components to get the total points for a specific user.
// ===================================================================================
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import ChoreService from '../services/chore.service.js';
import { socket } from './SocketContext.js';
import { AuthContext } from './AuthContext.js';

const ChoreContext = createContext();

export const useChores = () => {
  const context = useContext(ChoreContext);
  if (context === undefined) {
    return {
      state: { chores: [], loading: true, error: 'useChores must be used within a ChoreProvider' },
      actions: {}
    };
  }
  return context;
};

const actionTypes = { SET_LOADING: 'SET_LOADING', SET_CHORES: 'SET_CHORES', ADD_CHORE: 'ADD_CHORE', UPDATE_CHORE: 'UPDATE_CHORE', DELETE_CHORE: 'DELETE_CHORE', SET_ERROR: 'SET_ERROR' };

const choreReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING: return { ...state, loading: true };
    case actionTypes.SET_CHORES: return { ...state, loading: false, chores: action.payload, error: null };
    case actionTypes.ADD_CHORE: return { ...state, chores: [...state.chores, action.payload] };
    case actionTypes.UPDATE_CHORE: return { ...state, chores: state.chores.map(chore => chore._id === action.payload._id ? action.payload : chore) };
    case actionTypes.DELETE_CHORE: return { ...state, chores: state.chores.filter(chore => chore._id !== action.payload.id) };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export const ChoreProvider = ({ children }) => {
  const initialState = { chores: [], loading: true, error: null };
  const [state, dispatch] = useReducer(choreReducer, initialState);
  const { isAuthenticated, isReady } = useContext(AuthContext);

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
  }, []);

  const fetchChores = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await ChoreService.getChores();
      dispatch({ type: actionTypes.SET_CHORES, payload: response || [] });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);
  
  useEffect(() => {
    if (isReady && isAuthenticated) {
        fetchChores();
    }
  }, [isReady, isAuthenticated, fetchChores]);

  const createChore = useCallback(async (choreData) => {
    try { await ChoreService.createChore(choreData); } catch(err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);

  const deleteChore = useCallback(async (id) => {
    try { await ChoreService.deleteChore(id); } catch(err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);

  const toggleChoreCompletion = useCallback(async (id) => {
    try { await ChoreService.toggleChoreCompletion(id); } catch(err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);
  
  const calculateUserPoints = useCallback((userId) => {
      return state.chores
          .filter(chore => chore.assignedTo?._id === userId && chore.isComplete)
          .reduce((total, chore) => total + chore.points, 0);
  }, [state.chores]);

  const actions = useMemo(() => ({ createChore, deleteChore, toggleChoreCompletion, calculateUserPoints }), [createChore, deleteChore, toggleChoreCompletion, calculateUserPoints]);
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);
  
  return <ChoreContext.Provider value={contextValue}>{children}</ChoreContext.Provider>;
};
