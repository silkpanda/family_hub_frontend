import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import ListService from '../services/list.service.js';
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
    case actionTypes.ADD_LIST: if (!action.payload?._id) return state; return { ...state, lists: [...state.lists, action.payload] };
    case actionTypes.UPDATE_LIST: if (!action.payload?._id) return state; return { ...state, lists: state.lists.map(list => list._id === action.payload._id ? action.payload : list) };
    case actionTypes.DELETE_LIST: return { ...state, lists: state.lists.filter(list => list._id !== action.payload.id) };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export const ListProvider = ({ children }) => {
  const initialState = { lists: [], loading: true, error: null };
  const [state, dispatch] = useReducer(listReducer, initialState);
  const { isAuthenticated, isReady } = useContext(AuthContext);

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
    } else if (isReady && !isAuthenticated) {
      dispatch({ type: actionTypes.SET_LISTS, payload: [] });
    }
  }, [isReady, isAuthenticated, fetchLists]);

  const createList = useCallback(async (listData) => {
    try {
      const response = await ListService.createList(listData);
      dispatch({ type: actionTypes.ADD_LIST, payload: response });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const addItem = useCallback(async (listId, itemContent) => {
    try {
      const response = await ListService.addItemToList(listId, itemContent);
      dispatch({ type: actionTypes.UPDATE_LIST, payload: response });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);
  
  const deleteList = useCallback(async (listId) => {
    try {
      await ListService.deleteList(listId);
      dispatch({ type: actionTypes.DELETE_LIST, payload: { id: listId } });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);
  
  const toggleItemCompletion = useCallback(async (listId, itemId) => {
    try {
      const response = await ListService.toggleListItemCompletion(listId, itemId);
      dispatch({ type: actionTypes.UPDATE_LIST, payload: response });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const deleteItem = useCallback(async (listId, itemId) => {
    // This function was missing from the original file, it needs to be defined.
    try {
      await ListService.deleteListItem(listId, itemId);
      // We don't dispatch here because the backend should notify via websocket,
      // but for now, let's refetch to see the change. A better implementation
      // would be a DELETE_ITEM action in the reducer.
      fetchLists(); 
    } catch (err) {
       dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [fetchLists]);

  // --- FIX: Added `deleteList` to the actions object ---
  const actions = useMemo(() => ({
    fetchLists,
    createList,
    deleteList,
    addItem,
    toggleItemCompletion,
    deleteItem
  }), [fetchLists, createList, deleteList, addItem, toggleItemCompletion, deleteItem]);

  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>;
};