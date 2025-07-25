import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import FamilyService from '../services/family.service.js';
import { AuthContext } from './AuthContext.js';

export const FamilyContext = createContext();

// --- Reducer Actions ---
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_FAMILY: 'SET_FAMILY',
  SET_ERROR: 'SET_ERROR',
  CLEAR_FAMILY: 'CLEAR_FAMILY',
};

// --- Reducer Function ---
const familyReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: true };
    case actionTypes.SET_FAMILY:
      return { ...state, loading: false, family: action.payload, error: null };
    case actionTypes.CLEAR_FAMILY:
      return { ...state, family: null, loading: false };
    case actionTypes.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// --- Context Provider ---
export const FamilyProvider = ({ children }) => {
  const initialState = {
    family: null,
    loading: true, // Initial state is always loading
    error: null,
  };

  const [state, dispatch] = useReducer(familyReducer, initialState);
  const { isAuthenticated } = useContext(AuthContext);

  // --- FIX ---
  // The logic for fetching data is now directly inside this useEffect hook,
  // which correctly depends on the user's authentication status.
  useEffect(() => {
    const fetchFamilyData = async () => {
      dispatch({ type: actionTypes.SET_LOADING });
      try {
        const response = await FamilyService.getFamilyDetails();
        dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          dispatch({ type: actionTypes.SET_FAMILY, payload: null });
        } else {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
        }
      }
    };

    if (isAuthenticated) {
      fetchFamilyData();
    } else {
      // If the user is not authenticated, there's no family to fetch.
      // We must explicitly clear any existing family data and set loading to false.
      dispatch({ type: actionTypes.CLEAR_FAMILY });
    }
  }, [isAuthenticated]); // This effect now correctly re-runs when the auth state changes.

  const createFamily = useCallback(async (familyName, userColor) => {
    try {
      const response = await FamilyService.createFamily(familyName, userColor);
      // After creating, we update the state directly with the new family data.
      dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, []);
  
  const addFamilyMember = useCallback(async (memberData) => {
    try {
      const response = await FamilyService.addFamilyMember(memberData);
      dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  const joinFamily = useCallback(async (inviteCode, userColor) => {
    try {
      const response = await FamilyService.joinFamily(inviteCode, userColor);
      dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, []);

  const contextValue = useMemo(() => ({
    ...state,
    createFamily,
    addFamilyMember,
    joinFamily,
  }), [state, createFamily, addFamilyMember, joinFamily]);

  return (
    <FamilyContext.Provider value={contextValue}>
      {children}
    </FamilyContext.Provider>
  );
};
