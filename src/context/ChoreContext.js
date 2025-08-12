// --- File: /frontend/src/context/ChoreContext.js ---
// Manages state for chores, including fetching, creating, and handling the approval workflow.

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import ChoreService from '../services/chore.service.js';
import { SocketContext } from './SocketContext.js';
import { useFamily } from './FamilyContext.js';

const ChoreContext = createContext();

// Custom hook for easy access to chore context.
export const useChores = () => {
  const context = useContext(ChoreContext);
  if (context === undefined) {
    return { state: { chores: [], loading: true, error: null, activeUserId: null }, actions: {} };
  }
  return context;
};

const actionTypes = { SET_LOADING: 'SET_LOADING', SET_CHORES: 'SET_CHORES', ADD_CHORE: 'ADD_CHORE', UPDATE_CHORE: 'UPDATE_CHORE', DELETE_CHORE: 'DELETE_CHORE', SET_ERROR: 'SET_ERROR', SET_ACTIVE_USER: 'SET_ACTIVE_USER' };

const choreReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING: return { ...state, loading: true };
    case actionTypes.SET_CHORES: return { ...state, loading: false, chores: action.payload, error: null };
    case actionTypes.ADD_CHORE: return { ...state, chores: [...state.chores, action.payload] };
    case actionTypes.UPDATE_CHORE: return { ...state, chores: state.chores.map(chore => chore._id === action.payload._id ? action.payload : chore) };
    case actionTypes.DELETE_CHORE: return { ...state, chores: state.chores.filter(chore => chore._id !== action.payload.id) };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    case actionTypes.SET_ACTIVE_USER: return { ...state, activeUserId: action.payload };
    default: return state;
  }
};

export const ChoreProvider = ({ children }) => {
  const initialState = { chores: [], loading: true, error: null, activeUserId: null };
  const [state, dispatch] = useReducer(choreReducer, initialState);
  const { state: familyState } = useFamily();
  const { socket } = useContext(SocketContext); // Get socket from context.

  // useEffect: Set up socket listeners for real-time chore updates.
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
  }, [socket]); // Add socket as a dependency.

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
    if (familyState.family) {
        fetchChores();
    }
  }, [familyState.family, fetchChores]);

  const setActiveUser = useCallback((userId) => {
      dispatch({ type: actionTypes.SET_ACTIVE_USER, payload: userId });
  }, []);

  // Chore actions, including the approval workflow.
  const createChore = useCallback(async (choreData) => {
      try { await ChoreService.createChore(choreData); } catch(err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);
  const deleteChore = useCallback(async (id) => {
      try { await ChoreService.deleteChore(id); } catch(err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);
  const submitChoreForApproval = useCallback(async (id) => {
      try { 
          const updatedChore = await ChoreService.submitChoreForApproval(id);
          dispatch({ type: actionTypes.UPDATE_CHORE, payload: updatedChore });
      } catch(err) { 
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); 
      }
  }, []);
  const approveChore = useCallback(async (id) => {
      try {
          const updatedChore = await ChoreService.approveChore(id);
          dispatch({ type: actionTypes.UPDATE_CHORE, payload: updatedChore });
      } catch(err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, []);
  const rejectChore = useCallback(async (id) => {
      try {
          const updatedChore = await ChoreService.rejectChore(id);
          dispatch({ type: actionTypes.UPDATE_CHORE, payload: updatedChore });
      } catch(err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, []);
  
  const completeChoreForChild = useCallback(async (choreId, childId) => {
    try {
        const updatedChore = await ChoreService.completeChoreForChild(choreId, childId);
        dispatch({ type: actionTypes.UPDATE_CHORE, payload: updatedChore });
    } catch(err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);
  
  // calculateUserPoints: Calculates the total points a user has earned from completed chores.
  const calculateUserPoints = useCallback((userId) => {
      return state.chores
          .filter(chore => chore.assignedTo?._id === userId && chore.status === 'Completed')
          .reduce((total, chore) => total + chore.points, 0);
  }, [state.chores]);

  const actions = useMemo(() => ({ createChore, deleteChore, submitChoreForApproval, approveChore, rejectChore, calculateUserPoints, setActiveUser, completeChoreForChild }), [createChore, deleteChore, submitChoreForApproval, approveChore, rejectChore, calculateUserPoints, setActiveUser, completeChoreForChild]);
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);
  
  return <ChoreContext.Provider value={contextValue}>{children}</ChoreContext.Provider>;
};