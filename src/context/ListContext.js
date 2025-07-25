import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import ListService from '../services/list.service.js';
import { SocketContext } from './SocketContext.js';

export const ListContext = createContext();

// --- Reducer Actions ---
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_LISTS: 'SET_LISTS',
  ADD_LIST: 'ADD_LIST',
  UPDATE_LIST: 'UPDATE_LIST',
  DELETE_LIST: 'DELETE_LIST',
  DELETE_ITEM: 'DELETE_ITEM',
  SET_ERROR: 'SET_ERROR',
};

// --- Reducer Function ---
const listReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: true };
    case actionTypes.SET_LISTS:
      return { ...state, loading: false, lists: action.payload, error: null };
    case actionTypes.ADD_LIST:
      return { ...state, lists: [...state.lists, action.payload] };
    case actionTypes.UPDATE_LIST:
      // This case now correctly handles adding/updating an item,
      // as the payload is the entire updated list.
      return {
        ...state,
        lists: state.lists.map(list => list._id === action.payload._id ? action.payload : list),
      };
    case actionTypes.DELETE_LIST:
      return {
        ...state,
        lists: state.lists.filter(list => list._id !== action.payload.id),
      };
    case actionTypes.DELETE_ITEM:
       return {
        ...state,
        lists: state.lists.map(list => {
            if (list._id === action.payload.listId) {
                return {
                    ...list,
                    items: list.items.filter(item => item._id !== action.payload.itemId)
                };
            }
            return list;
        })
       }
    case actionTypes.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- Context Provider ---
export const ListProvider = ({ children }) => {
  const initialState = {
    lists: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(listReducer, initialState);
  const socket = useContext(SocketContext);

  // Real-time listeners for updates from OTHER users
  useEffect(() => {
    if (socket) {
      socket.on('list:created', (newList) => dispatch({ type: actionTypes.ADD_LIST, payload: newList }));
      socket.on('list:updated', (updatedList) => dispatch({ type: actionTypes.UPDATE_LIST, payload: updatedList }));
      socket.on('list:deleted', (data) => dispatch({ type: actionTypes.DELETE_LIST, payload: data }));
      
      socket.on('item:added', (data) => dispatch({ type: actionTypes.UPDATE_LIST, payload: data.list }));
      socket.on('item:updated', (data) => dispatch({ type: actionTypes.UPDATE_LIST, payload: data.list }));
      socket.on('item:deleted', (data) => dispatch({ type: actionTypes.DELETE_ITEM, payload: data }));

      return () => {
        socket.off('list:created');
        socket.off('list:updated');
        socket.off('list:deleted');
        socket.off('item:added');
        socket.off('item:updated');
        socket.off('item:deleted');
      };
    }
  }, [socket]);

  // --- Actions ---
  const fetchLists = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await ListService.getLists();
      dispatch({ type: actionTypes.SET_LISTS, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const createList = useCallback(async (listName) => {
    try {
      const response = await ListService.createList(listName);
      dispatch({ type: actionTypes.ADD_LIST, payload: response.data });
    } catch (err)
      {
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
  
  // --- CORRECTED LOGIC ---
  // The addItem function now correctly takes the response from the server
  // (the entire updated list) and dispatches it to the reducer.
  const addItem = useCallback(async (listId, itemContent) => {
    try {
      const response = await ListService.addItemToList(listId, itemContent);
      dispatch({ type: actionTypes.UPDATE_LIST, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const toggleItemCompletion = useCallback(async (listId, itemId) => {
    try {
      const response = await ListService.toggleListItemCompletion(listId, itemId);
      dispatch({ type: actionTypes.UPDATE_LIST, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);
  
  const deleteItem = useCallback(async (listId, itemId) => {
    try {
      await ListService.deleteListItem(listId, itemId);
      dispatch({ type: actionTypes.DELETE_ITEM, payload: { listId, itemId } });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...state,
    fetchLists,
    createList,
    deleteList,
    addItem,
    toggleItemCompletion,
    deleteItem,
  }), [state, fetchLists, createList, deleteList, addItem, toggleItemCompletion, deleteItem]);

  return (
    <ListContext.Provider value={contextValue}>
      {children}
    </ListContext.Provider>
  );
};
