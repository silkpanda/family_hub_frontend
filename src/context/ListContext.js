// --- File: /frontend/src/context/ListContext.js ---
// Manages state for shared lists, including items, assignments, and real-time updates.

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import ListService from '../services/list.service.js';
import { SocketContext } from './SocketContext.js';
import { useFamily } from './FamilyContext.js';

const ListContext = createContext();

export const useLists = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    return { state: { lists: [], loading: true, error: null }, actions: {} };
  }
  return context;
};

const actionTypes = { SET_LOADING: 'SET_LOADING', SET_LISTS: 'SET_LISTS', ADD_LIST: 'ADD_LIST', UPDATE_LIST: 'UPDATE_LIST', DELETE_LIST: 'DELETE_LIST', SET_ERROR: 'SET_ERROR' };

const listReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING: return { ...state, loading: true };
    case actionTypes.SET_LISTS: return { ...state, loading: false, lists: action.payload, error: null };
    // Prevents adding a duplicate list if it already exists in the state.
    case actionTypes.ADD_LIST: if (state.lists.some(l => l._id === action.payload._id)) return state; return { ...state, lists: [...state.lists, action.payload] };
    case actionTypes.UPDATE_LIST: return { ...state, lists: state.lists.map(list => list._id === action.payload._id ? action.payload : list) };
    case actionTypes.DELETE_LIST: return { ...state, lists: state.lists.filter(list => list._id !== action.payload.id) };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export const ListProvider = ({ children }) => {
  const initialState = { lists: [], loading: true, error: null };
  const [state, dispatch] = useReducer(listReducer, initialState);
  const { state: familyState } = useFamily();
  const { socket } = useContext(SocketContext); // Get socket from context.

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
  }, [socket]); // Add socket as a dependency.

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
    if (familyState.family) {
      fetchLists();
    }
  }, [familyState.family, fetchLists]);

  // Actions for list and list item management.
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
  const toggleItemCompletion = useCallback(async (listId, itemId) => {
      try {
          const updatedList = await ListService.toggleListItemCompletion(listId, itemId);
          dispatch({ type: actionTypes.UPDATE_LIST, payload: updatedList });
      } catch (err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, []);
  const deleteItem = useCallback(async (listId, itemId) => {
      try {
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