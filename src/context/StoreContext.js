// --- File: /frontend/src/context/StoreContext.js ---
// Manages state for the rewards store, allowing parents to create and manage rewards.

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import StoreService from '../services/store.service.js';
import { useFamily } from './FamilyContext.js';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    return { state: { items: [], loading: true, error: null }, actions: {} };
  }
  return context;
};

const actionTypes = { SET_LOADING: 'SET_LOADING', SET_ITEMS: 'SET_ITEMS', ADD_ITEM: 'ADD_ITEM', UPDATE_ITEM: 'UPDATE_ITEM', DELETE_ITEM: 'DELETE_ITEM', SET_ERROR: 'SET_ERROR' };

const storeReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING: return { ...state, loading: true };
    case actionTypes.SET_ITEMS: return { ...state, loading: false, items: action.payload, error: null };
    case actionTypes.ADD_ITEM: return { ...state, items: [...state.items, action.payload] };
    case actionTypes.UPDATE_ITEM: return { ...state, items: state.items.map(item => item._id === action.payload._id ? action.payload : item) };
    case actionTypes.DELETE_ITEM: return { ...state, items: state.items.filter(item => item._id !== action.payload.id) };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export const StoreProvider = ({ children }) => {
  const initialState = { items: [], loading: true, error: null };
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const { state: familyState } = useFamily();

  const fetchItems = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await StoreService.getStoreItems();
      dispatch({ type: actionTypes.SET_ITEMS, payload: response || [] });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  useEffect(() => {
    if (familyState.family) {
      fetchItems();
    }
  }, [familyState.family, fetchItems]);

  const createItem = useCallback(async (itemData) => {
      try {
          const newItem = await StoreService.createStoreItem(itemData);
          dispatch({ type: actionTypes.ADD_ITEM, payload: newItem });
      } catch (err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, []);
  
  const actions = useMemo(() => ({ createItem }), [createItem]);
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};