import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import FamilyService from 'services/family.service.js'; 
import { AuthContext } from 'context/AuthContext.js';

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
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(familyReducer, initialState);
  const { isAuthenticated } = useContext(AuthContext);

  // --- CORRECTED DEPENDENCIES ---
  // All useCallback hooks now include `dispatch` and any other functions they depend on.
  // This ensures the functions are stable and prevents the infinite loop.

  const fetchFamilyDetails = useCallback(async () => {
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
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFamilyDetails();
    } else {
      dispatch({ type: actionTypes.CLEAR_FAMILY });
    }
  }, [isAuthenticated, fetchFamilyDetails, dispatch]);

  const createFamily = useCallback(async (familyName, userColor) => {
    try {
      await FamilyService.createFamily(familyName, userColor);
      await fetchFamilyDetails();
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [fetchFamilyDetails, dispatch]);
  
  const addFamilyMember = useCallback(async (memberData) => {
    try {
      await FamilyService.addFamilyMember(memberData);
      await fetchFamilyDetails();
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [fetchFamilyDetails, dispatch]);

  const updateFamily = useCallback(async (familyData) => {
    try {
        await FamilyService.updateFamily(familyData);
        await fetchFamilyDetails();
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
        throw err;
    }
  }, [fetchFamilyDetails, dispatch]);

  const updateFamilyMember = useCallback(async (memberId, memberData) => {
    try {
      const response = await FamilyService.updateFamilyMember(memberId, memberData);
      await fetchFamilyDetails();
      return response.data.warning; 
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [fetchFamilyDetails, dispatch]);

  const removeFamilyMember = useCallback(async (memberId) => {
    try {
      await FamilyService.removeFamilyMember(memberId);
      await fetchFamilyDetails();
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [fetchFamilyDetails, dispatch]);

  const joinFamily = useCallback(async (inviteCode, userColor) => {
    try {
      await FamilyService.joinFamily(inviteCode, userColor);
      await fetchFamilyDetails();
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [fetchFamilyDetails, dispatch]);

  const clearFamily = useCallback(() => {
      dispatch({ type: actionTypes.CLEAR_FAMILY });
  }, [dispatch]);

  const contextValue = useMemo(() => ({
    ...state,
    fetchFamilyDetails,
    createFamily,
    addFamilyMember,
    updateFamily,
    updateFamilyMember,
    removeFamilyMember,
    joinFamily,
    clearFamily,
  }), [state, fetchFamilyDetails, createFamily, addFamilyMember, updateFamily, updateFamilyMember, removeFamilyMember, joinFamily, clearFamily]);

  return (
    <FamilyContext.Provider value={contextValue}>
      {children}
    </FamilyContext.Provider>
  );
};