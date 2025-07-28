import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import ListService from '../services/list.service.js'; // Your API service
import { SocketContext } from './SocketContext.js'; // Your Socket.IO context

/**
 * The context object that components will use to access shared list state and actions.
 */
export const ListContext = createContext();

/**
 * Centralized action type constants to prevent typos and improve maintainability.
 */
const actionTypes = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  CREATE_LIST_SUCCESS: 'CREATE_LIST_SUCCESS',
  UPDATE_LIST_SUCCESS: 'UPDATE_LIST_SUCCESS',
  DELETE_LIST_SUCCESS: 'DELETE_LIST_SUCCESS',
};

/**
 * The reducer function manages all state transitions for the lists.
 * It's a pure function that takes the current state and an action, and returns the new state.
 * @param {object} state - The current state.
 * @param {object} action - The action to be performed, containing a type and an optional payload.
 * @returns {object} The new state.
 */
const listReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.FETCH_START:
      return { ...state, loading: true, error: null };

    case actionTypes.FETCH_SUCCESS:
      return { ...state, loading: false, lists: action.payload };

    case actionTypes.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    
    case actionTypes.CREATE_LIST_SUCCESS:
      // This case handles adding the newly created list to our state.
      // It includes a guard to prevent adding a list with no data.
      if (!action.payload || !action.payload._id) {
        console.error("CREATE_LIST_SUCCESS dispatched with an invalid payload:", action.payload);
        return state; // Do not update state if the payload is invalid.
      }
      // Also prevent adding a duplicate if a socket event arrives for a list we already added.
      if (state.lists.some(list => list._id === action.payload._id)) {
        return state;
      }
      return {
        ...state,
        lists: [...state.lists, action.payload],
      };

    case actionTypes.DELETE_LIST_SUCCESS:
      return {
        ...state,
        lists: state.lists.filter(list => list._id !== action.payload.listId),
      };

    case actionTypes.UPDATE_LIST_SUCCESS:
      return {
        ...state,
        lists: state.lists.map(list =>
          list._id === action.payload._id ? action.payload : list
        ),
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

/**
 * The Provider component that wraps the application and provides the list context
 * to all child components. It contains the state logic and action definitions.
 */
export const ListProvider = ({ children }) => {
  const initialState = {
    lists: [],
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(listReducer, initialState);
  const socket = useContext(SocketContext);

  // This effect handles real-time events from the server to sync OTHER clients.
  useEffect(() => {
    if (socket) {
      const handleListUpdate = (updatedList) => {
        dispatch({ type: actionTypes.UPDATE_LIST_SUCCESS, payload: updatedList });
      };
      const handleListCreate = (newList) => {
        dispatch({ type: actionTypes.CREATE_LIST_SUCCESS, payload: newList });
      };
      socket.on('list-updated', handleListUpdate);
      socket.on('list:created', handleListCreate);
      return () => {
        socket.off('list-updated', handleListUpdate);
        socket.off('list:created', handleListCreate);
      };
    }
  }, [socket]);

  // --- Action Functions ---

  const fetchLists = useCallback(async () => {
    dispatch({ type: actionTypes.FETCH_START });
    try {
      const data = await ListService.getLists();
      dispatch({ type: actionTypes.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
    }
  }, []);

  // This function uses the direct API response for an immediate UI update.
  const createList = useCallback(async (listName) => {
    try {
      // 1. Call the API service. It now correctly returns the new list object.
      const newList = await ListService.createList({ name: listName });
      
      // 2. Dispatch the new list to the reducer for an immediate UI update.
      dispatch({ type: actionTypes.CREATE_LIST_SUCCESS, payload: newList });

    } catch (error) {
      console.error("Failed to create list:", error);
      dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
    }
  }, []); // This function is self-contained.

  const deleteList = useCallback(async (listId) => {
    try {
      await ListService.deleteList(listId);
      dispatch({ type: actionTypes.DELETE_LIST_SUCCESS, payload: { listId } });
    } catch (error) {
      console.error("Failed to delete list:", error);
      dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
    }
  }, []);

  const addItem = useCallback(async (listId, itemContent) => {
    try {
      const updatedList = await ListService.addItemToList(listId, itemContent);
      dispatch({ type: actionTypes.UPDATE_LIST_SUCCESS, payload: updatedList });
    } catch (error)      {
      console.error("Failed to add item:", error);
      dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
    }
  }, []);

  const toggleItemCompletion = useCallback(async (listId, itemId) => {
    try {
      const updatedList = await ListService.toggleListItemCompletion(listId, itemId);
      dispatch({ type: actionTypes.UPDATE_LIST_SUCCESS, payload: updatedList });
    } catch (error) {
      console.error("Failed to toggle item:", error);
      dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
    }
  }, []);

  const deleteItem = useCallback(async (listId, itemId) => {
    try {
      await ListService.deleteListItem(listId, itemId);
      // The API for delete might not return the full list, so re-fetching is safest.
      fetchLists();
    } catch (error) {
      console.error("Failed to delete item:", error);
      dispatch({ type: actionTypes.FETCH_ERROR, payload: error.message });
    }
  }, [fetchLists]);

  // Memoize the context value to prevent unnecessary re-renders.
  const contextValue = useMemo(() => ({
    ...state,
    actions: {
      fetchLists,
      createList,
      deleteList,
      addItem,
      toggleItemCompletion,
      deleteItem,
    },
  }), [state, fetchLists, createList, deleteList, addItem, toggleItemCompletion, deleteItem]);

  return (
    <ListContext.Provider value={contextValue}>
      {children}
    </ListContext.Provider>
  );
};
