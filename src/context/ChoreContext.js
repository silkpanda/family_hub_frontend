// ===================================================================================
// File: /frontend/src/context/ChoreContext.js
// Purpose: Manages all state and actions for the Chores feature.
// ===================================================================================
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import ChoreService from '../services/chore.service.js';
import { socket } from './SocketContext.js'; // Ensure socket is imported
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
  // CRUCIAL LOG: See what actions the reducer is receiving from socket events
  console.log(`[ChoreContext] Reducer received action: ${action.type}, payload:`, action.payload);
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

  // This useEffect sets up the socket listeners for chore events.
  useEffect(() => {
    if (socket) {
      console.log('[ChoreContext] Setting up Socket.IO listeners for chores.');

      // Listener for a new chore being created
      socket.on('chore:created', (newChore) => {
        console.log('[ChoreContext] Received "chore:created" event:', newChore.title);
        dispatch({ type: actionTypes.ADD_CHORE, payload: newChore });
      });

      // Listener for an existing chore being updated (e.g., toggled completion)
      socket.on('chore:updated', (updatedChore) => {
        console.log('[ChoreContext] Received "chore:updated" event:', updatedChore.title, 'Complete:', updatedChore.isComplete);
        dispatch({ type: actionTypes.UPDATE_CHORE, payload: updatedChore });
      });

      // Listener for a chore being deleted
      socket.on('chore:deleted', (data) => {
        console.log('[ChoreContext] Received "chore:deleted" event for ID:', data.id);
        dispatch({ type: actionTypes.DELETE_CHORE, payload: data });
      });

      // Cleanup function to remove listeners when component unmounts or effect re-runs
      return () => {
        console.log('[ChoreContext] Cleaning up Socket.IO listeners for chores.');
        socket.off('chore:created');
        socket.off('chore:updated');
        socket.off('chore:deleted');
      };
    } else {
      console.log('[ChoreContext] Socket.IO instance not available.');
    }
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const fetchChores = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await ChoreService.getChores();
      console.log('[ChoreContext] Fetched chores from API:', response.length, 'chores.');
      dispatch({ type: actionTypes.SET_CHORES, payload: response || [] });
    } catch (err) {
      console.error('[ChoreContext] Error fetching chores:', err.message);
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);
  
  // Fetch chores initially when authenticated state is ready
  useEffect(() => {
    console.log(`[ChoreContext] useEffect - isAuthenticated: ${isAuthenticated}, isReady: ${isReady}`);
    if (isReady && isAuthenticated) {
        fetchChores();
    }
  }, [isReady, isAuthenticated, fetchChores]);

  const createChore = useCallback(async (choreData) => {
    try { 
      const response = await ChoreService.createChore(choreData); 
      console.log('[ChoreContext] API Call: createChore successful. (Socket should handle update)');
      // No dispatch here, as the socket event 'chore:created' will trigger ADD_CHORE
      return response; // Return data if needed by calling component
    } catch(err) { 
      console.error('[ChoreContext] API Call: createChore failed:', err.message);
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); 
      throw err; // Re-throw to allow component to handle
    }
  }, []);

  const deleteChore = useCallback(async (id) => {
    try { 
      await ChoreService.deleteChore(id); 
      console.log(`[ChoreContext] API Call: deleteChore ${id} successful. (Socket should handle update)`);
      // No dispatch here, as the socket event 'chore:deleted' will trigger DELETE_CHORE
    } catch(err) { 
      console.error('[ChoreContext] API Call: deleteChore failed:', err.message);
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); 
      throw err;
    }
  }, []);

  const toggleChoreCompletion = useCallback(async (id) => {
    try { 
      await ChoreService.toggleChoreCompletion(id); 
      console.log(`[ChoreContext] API Call: toggleChoreCompletion ${id} successful. (Socket should handle update)`);
      // No dispatch here, as the socket event 'chore:updated' will trigger UPDATE_CHORE
    } catch(err) { 
      console.error('[ChoreContext] API Call: toggleChoreCompletion failed:', err.message);
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); 
      throw err;
    }
  }, []);
  
  const actions = useMemo(() => ({ createChore, deleteChore, toggleChoreCompletion }), [createChore, deleteChore, toggleChoreCompletion]);
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);
  
  return <ChoreContext.Provider value={contextValue}>{children}</ChoreContext.Provider>;
};