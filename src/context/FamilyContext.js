// --- File: /frontend/src/context/FamilyContext.js ---
// Manages state related to the family, including members, invite codes, and family details.

import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import FamilyService from '../services/family.service.js';
import { AuthContext } from './AuthContext.js';
import { SocketContext } from './SocketContext.js';

export const FamilyContext = createContext();

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    return {
      state: { family: null, loading: true, error: 'useFamily must be used within a FamilyProvider' },
      actions: {}
    };
  }
  return context;
};

const actionTypes = { SET_LOADING: 'SET_LOADING', SET_FAMILY: 'SET_FAMILY', SET_ERROR: 'SET_ERROR' };

const familyReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING: return { ...state, loading: true, error: null };
    case actionTypes.SET_FAMILY: return { ...state, loading: false, family: action.payload, error: null };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

export const FamilyProvider = ({ children }) => {
  const initialState = { family: null, loading: true, error: null };
  const [state, dispatch] = useReducer(familyReducer, initialState);
  const { isAuthenticated, isReady } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const familyId = state.family?._id;

  useEffect(() => {
    if (socket && familyId) {
      socket.emit('joinFamily', familyId);
    }
  }, [familyId, socket]);

  const fetchFamilyDetails = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await FamilyService.getFamilyDetails();
      dispatch({ type: actionTypes.SET_FAMILY, payload: response.data || null });
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
        dispatch({ type: actionTypes.SET_FAMILY, payload: null });
      } else {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
    }
  }, []);

  useEffect(() => {
    // **BUG FIX:** The `else if` block that cleared family data for unauthenticated users has been removed.
    // This ensures that when a parent logs out to Kiosk Mode, the family data is preserved,
    // allowing the dashboard and PIN login modal to function correctly.
    // The initial check in AuthContext handles the case for new, truly unauthenticated sessions.
    if (isReady && isAuthenticated) {
      fetchFamilyDetails();
    }
  }, [isReady, isAuthenticated, fetchFamilyDetails]);

  // Actions for managing the family and its members.
  const createFamily = useCallback(async (familyData) => {
    try {
        const response = await FamilyService.createFamily(familyData.familyName, familyData.userColor);
        dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
        return response.data;
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
        throw err;
    }
  }, []);
  
  const addFamilyMember = useCallback(async (memberData) => { 
    try {
      const response = await FamilyService.addFamilyMember(memberData);
      dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
      return response.data;
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, []);

  const joinFamily = useCallback(async (inviteCode, userColor) => { 
    try {
      const response = await FamilyService.joinFamily(inviteCode, userColor);
      dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
      return response.data;
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, []);

  const removeFamilyMember = useCallback(async (memberId) => {
    try {
      const response = await FamilyService.removeFamilyMember(memberId);
      dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
      return response.data;
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, []);

  const updateFamilyMember = useCallback(async (memberId, updateData) => {
    try {
      const response = await FamilyService.updateFamilyMember(memberId, updateData);
      dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
      return response.data;
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, []);

  const updateFamilyName = useCallback(async (newName) => {
    try {
      const response = await FamilyService.updateFamily({ name: newName });
      dispatch({ type: actionTypes.SET_FAMILY, payload: response.data });
      return response.data;
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, []);

  const setPin = useCallback(async (memberId, pin) => {
    try {
        await FamilyService.setMemberPin(memberId, pin);
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
        throw err;
    }
  }, []);

  const actions = useMemo(() => ({
    fetchFamilyDetails, createFamily, addFamilyMember, joinFamily,
    removeFamilyMember, updateFamilyMember, updateFamilyName, setPin
  }), [
    fetchFamilyDetails, createFamily, addFamilyMember, joinFamily,
    removeFamilyMember, updateFamilyMember, updateFamilyName, setPin
  ]);
  
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <FamilyContext.Provider value={contextValue}>
      {children}
    </FamilyContext.Provider>
  );
};
