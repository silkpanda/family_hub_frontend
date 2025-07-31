// ===================================================================================
// File: /frontend/src/context/ListContext.js
// Purpose: Manages all state and actions for the Lists feature.
//
// --- Dev Notes (UPDATE) ---
// - BUG FIX: Interacting with lists on the profile page required a refresh.
// - SOLUTION: The `toggleItemCompletion` and `deleteItem` functions have been
//   updated to await the API response and dispatch an `UPDATE_LIST` action
//   immediately. This ensures the UI updates instantly for the user performing
//   the action, resolving the state synchronization issue.
// ===================================================================================
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import ListService from '../services/list.service.js';
import { socket } from './SocketContext.js';
import { AuthContext } from './AuthContext.js';

const ListContext = createContext();

export const useLists = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    return {
      state: { lists: [], loading: true, error: 'useLists must be used within a ListProvider' },
      actions: {}
    };
  }
  return context;
};

const actionTypes = { SET_LOADING: 'SET_LOADING', SET_LISTS: 'SET_LISTS', ADD_LIST: 'ADD_LIST', UPDATE_LIST: 'UPDATE_LIST', DELETE_LIST: 'DELETE_LIST', SET_ERROR: 'SET_ERROR' };

const listReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING: return { ...state, loading: true };
    case actionTypes.SET_LISTS: return { ...state, loading: false, lists: action.payload, error: null };
    case actionTypes.ADD_LIST:
      if (state.lists.some(list => list._id === action.payload._id)) {
        return state;
      }
      return { ...state, lists: [...state.lists, action.payload] };
    case actionTypes.UPDATE_LIST: return { ...state, lists: state.lists.map(list => list._id === action.payload._id ? action.payload : list) };
    case actionTypes.DELETE_LIST: return { ...state, lists: state.lists.filter(list => list._id !== action.payload.id) };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export const ListProvider = ({ children }) => {
  const initialState = { lists: [], loading: true, error: null };
  const [state, dispatch] = useReducer(listReducer, initialState);
  const { isAuthenticated, isReady } = useContext(AuthContext);

  useEffect(() => {
    if (socket) {
      socket.on('list:created', (newList) => dispatch({ type: actionTypes.ADD_LIST, payload: newList }));
      socket.on('list:updated', (updatedList) => dispatch({ type: actionTypes.UPDATE_LIST, payload: updatedList }));
      socket.on('list:deleted', (data) => dispatch({ type: actionTypes.DELETE_LIST, payload: data }));
      return () => {
        socket.off('list:created');
        socket.off('list:updated');
        socket.off('list:deleted');
      };
    }
  }, []);

  const fetchLists = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await ListService.getLists();
      dispatch({ type: actionTypes.SET_LISTS, payload: response || [] });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchLists();
    }
  }, [isReady, isAuthenticated, fetchLists]);

  const createList = useCallback(async (listData) => {
    try {
      const newList = await ListService.createList(listData);
      dispatch({ type: actionTypes.ADD_LIST, payload: newList });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const deleteList = useCallback(async (id) => {
    try { await ListService.deleteList(id); } catch (err) { dispatch({ type: actionTypes.SET_ERROR, payload: err.message }); }
  }, []);

  const addItem = useCallback(async (listId, itemData) => {
    try {
      const updatedList = await ListService.addItemToList(listId, itemData);
      dispatch({ type: actionTypes.UPDATE_LIST, payload: updatedList });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  // --- UPDATED ---
  const toggleItemCompletion = useCallback(async (listId, itemId) => {
    try {
        const updatedList = await ListService.toggleListItemCompletion(listId, itemId);
        dispatch({ type: actionTypes.UPDATE_LIST, payload: updatedList });
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  // --- UPDATED ---
  const deleteItem = useCallback(async (listId, itemId) => {
    try {
        // The backend now returns the updated list after deletion.
        const updatedList = await ListService.deleteListItem(listId, itemId);
        dispatch({ type: actionTypes.UPDATE_LIST, payload: updatedList });
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const assignList = useCallback(async (listId, userIds) => {
    try {
        const updatedList = await ListService.assignList(listId, userIds);
        dispatch({ type: actionTypes.UPDATE_LIST, payload: updatedList });
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const actions = useMemo(() => ({ createList, deleteList, addItem, toggleItemCompletion, deleteItem, assignList }), [createList, deleteList, addItem, toggleItemCompletion, deleteItem, assignList]);
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>;
};
