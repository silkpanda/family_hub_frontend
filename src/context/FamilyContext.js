// ===================================================================================
// File: /frontend/src/context/FamilyContext.js
// Purpose: Manages state related to the user's family, including members and
// invite codes. It also handles joining the correct WebSocket room for real-time updates.
// ===================================================================================
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import FamilyService from '../services/family.service.js';
import { AuthContext } from './AuthContext.js';
import { socket } from './SocketContext.js';

export const FamilyContext = createContext();

// Custom hook to conveniently consume the FamilyContext
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

// Define action types OUTSIDE the component to ensure they are stable and do not
// cause useCallback or useEffect dependencies to unnecessarily change.
const actionTypes = {
    SET_LOADING: 'SET_LOADING',
    SET_FAMILY: 'SET_FAMILY',
    SET_ERROR: 'SET_ERROR',
    ADD_MEMBER: 'ADD_MEMBER',
    REMOVE_MEMBER: 'REMOVE_MEMBER',
    UPDATE_MEMBER_COLOR: 'UPDATE_MEMBER_COLOR',
    UPDATE_FAMILY_NAME: 'UPDATE_FAMILY_NAME',
};

// Reducer function to manage state updates based on dispatched actions
const familyReducer = (state, action) => {
  console.log(`[FamilyContext] Reducer received action: ${action.type}, payload:`, action.payload);
  switch (action.type) {
    case actionTypes.SET_LOADING: return { ...state, loading: true, error: null };
    case actionTypes.SET_FAMILY:
        console.log('[FamilyContext] Setting family state to:', action.payload ? action.payload.name : 'null (no family)');
        return { ...state, loading: false, family: action.payload, error: null };
    case actionTypes.SET_ERROR: return { ...state, loading: false, error: action.payload };
    case actionTypes.ADD_MEMBER:
        if (state.family) {
            return { ...state, family: action.payload };
        }
        return state;
    case actionTypes.REMOVE_MEMBER:
        if (state.family) {
            return { ...state, family: action.payload };
        }
        return state;
    case actionTypes.UPDATE_MEMBER_COLOR:
        if (state.family) {
             return { ...state, family: action.payload };
        }
        return state;
    case actionTypes.UPDATE_FAMILY_NAME:
        if (state.family) {
            return { ...state, family: action.payload };
        }
        return state;
    default: return state;
  }
};


export const FamilyProvider = ({ children }) => {
  const initialState = { family: null, loading: true, error: null };
  const [state, dispatch] = useReducer(familyReducer, initialState);
  const { isAuthenticated, isReady } = useContext(AuthContext);
  const familyId = state.family?._id;

  // This effect is responsible for joining the family's private WebSocket room.
  useEffect(() => {
    if (socket && familyId) {
      socket.emit('joinFamily', familyId);
      console.log(`[FamilyContext] Attempting to join family room: ${familyId}`);
    } else if (socket && !familyId) {
      console.log('[FamilyContext] Socket is connected but no familyId available to join a room. (This is expected for new users / before family is loaded)');
    }
  }, [familyId]);

  const fetchFamilyDetails = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await FamilyService.getFamilyDetails();
      console.log('[FamilyContext] getFamilyDetails API raw response:', response);
      const familyData = response.data;
      console.log('[FamilyContext] getFamilyDetails extracted data:', familyData);

      dispatch({ type: actionTypes.SET_FAMILY, payload: familyData || null });
    } catch (err) {
      console.error('[FamilyContext] Error fetching family details:', err);
      if (err.response && err.response.status === 404) {
        console.log('[FamilyContext] Received 404, user is not part of a family. Setting family to null.');
        dispatch({ type: actionTypes.SET_FAMILY, payload: null });
      } else {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
    }
  }, [dispatch]);

  // REVISED useEffect for fetching family details
  useEffect(() => {
    console.log(`[FamilyContext] useEffect - isAuthenticated: ${isAuthenticated}, isReady: ${isReady}, current family state: ${state.family ? state.family.name : 'null'}, current loading state: ${state.loading}, current error state: ${state.error ? state.error : 'null'}`);
    
    if (isReady && isAuthenticated && !state.family && !state.error) {
        console.log('[FamilyContext] Triggering fetchFamilyDetails due to auth state, readiness, and no existing family/error.');
        fetchFamilyDetails();
    }
    if (!isAuthenticated && isReady && state.family) {
        console.log('[FamilyContext] User unauthenticated and family data exists. Clearing family state.');
        dispatch({ type: actionTypes.SET_FAMILY, payload: null });
    }
  }, [isReady, isAuthenticated, fetchFamilyDetails, state.family, state.loading, state.error, dispatch]);

  const createFamily = useCallback(async (familyData) => {
    try {
        const response = await FamilyService.createFamily(familyData.familyName, familyData.userColor);
        const family = response.data;
        console.log('[FamilyContext] createFamily successful, new family:', family);
        dispatch({ type: actionTypes.SET_FAMILY, payload: family });
        return family;
    } catch (err) {
        console.error('[FamilyContext] createFamily API call failed:', err);
        console.error('[FamilyContext] createFamily error message:', err.message);
        if (err.response && err.response.data && err.response.data.errors) {
          console.error('[FamilyContext] createFamily validation errors:', err.response.data.errors);
        } else if (err.response && err.response.data && err.response.data.message) {
          console.error('[FamilyContext] createFamily backend error:', err.response.data.message);
        }
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
        throw err;
    }
  }, [dispatch]);
  
  const addFamilyMember = useCallback(async (memberData) => { 
    try {
      const response = await FamilyService.addFamilyMember(memberData);
      const updatedFamily = response.data;
      console.log('[FamilyContext] addFamilyMember successful, updated family:', updatedFamily);
      dispatch({ type: actionTypes.SET_FAMILY, payload: updatedFamily }); 
      return updatedFamily;
    } catch (err) {
      console.error('[FamilyContext] addFamilyMember API call failed:', err);
      console.error('[FamilyContext] addFamilyMember error message:', err.message);
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('[FamilyContext] addFamilyMember validation errors:', err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.message) {
        console.error('[FamilyContext] addFamilyMember backend error:', err.response.data.message);
      }
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [dispatch]);

  const joinFamily = useCallback(async (inviteCode, userColor) => { 
    try {
      const response = await FamilyService.joinFamily(inviteCode, userColor);
      const family = response.data;
      console.log('[FamilyContext] joinFamily successful, joined family:', family);
      dispatch({ type: actionTypes.SET_FAMILY, payload: family }); 
      return family;
    } catch (err) {
      console.error('[FamilyContext] joinFamily API call failed:', err);
      console.error('[FamilyContext] joinFamily error message:', err.message);
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('[FamilyContext] joinFamily validation errors:', err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.message) {
        console.error('[FamilyContext] joinFamily backend error:', err.response.data.message);
      }
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [dispatch]);

  const removeFamilyMember = useCallback(async (memberId) => {
    try {
      const response = await FamilyService.removeFamilyMember(memberId);
      const updatedFamily = response.data;
      console.log('[FamilyContext] removeFamilyMember successful, updated family:', updatedFamily);
      dispatch({ type: actionTypes.SET_FAMILY, payload: updatedFamily });
      return updatedFamily;
    } catch (err) {
      console.error('[FamilyContext] removeFamilyMember API call failed:', err);
      console.error('[FamilyContext] removeFamilyMember error message:', err.message);
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('[FamilyContext] removeFamilyMember validation errors:', err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.message) {
        console.error('[FamilyContext] removeFamilyMember backend error:', err.response.data.message);
      }
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [dispatch]);

  // FIX FOR EDIT MEMBER: Extract data.data from backend response
  const updateFamilyMember = useCallback(async (memberId, updateData) => {
    try {
      const response = await FamilyService.updateFamilyMember(memberId, updateData);
      // CRITICAL FIX: Backend updateFamilyMember returns { data: familyObject }, so we need response.data.data
      const updatedFamily = response.data.data; // <--- This is the key fix
      console.log('[FamilyContext] updateFamilyMember successful, updated family:', updatedFamily);
      dispatch({ type: actionTypes.SET_FAMILY, payload: updatedFamily });
      return updatedFamily; // Return the actual family object
    } catch (err) {
      console.error('[FamilyContext] updateFamilyMember API call failed:', err);
      console.error('[FamilyContext] updateFamilyMember error message:', err.message);
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('[FamilyContext] updateFamilyMember validation errors:', err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.message) {
        console.error('[FamilyContext] updateFamilyMember backend error:', err.response.data.message);
      }
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [dispatch]);

  const updateFamilyName = useCallback(async (newName) => {
    try {
      const response = await FamilyService.updateFamily({ name: newName });
      const updatedFamily = response.data;
      console.log('[FamilyContext] updateFamilyName successful, updated family:', updatedFamily);
      dispatch({ type: actionTypes.SET_FAMILY, payload: updatedFamily });
      return updatedFamily;
    } catch (err) {
      console.error('[FamilyContext] updateFamilyName API call failed:', err);
      console.error('[FamilyContext] updateFamilyName error message:', err.message);
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('[FamilyContext] updateFamilyName validation errors:', err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.message) {
        console.error('[FamilyContext] updateFamilyName backend error:', err.response.data.message);
      }
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      throw err;
    }
  }, [dispatch]);


  // Ensure all action creators are included in the actions useMemo dependency array.
  const actions = useMemo(() => ({
    fetchFamilyDetails,
    createFamily,
    addFamilyMember,
    joinFamily,
    removeFamilyMember,
    updateFamilyMember,
    updateFamilyName
  }), [
    fetchFamilyDetails, createFamily, addFamilyMember, joinFamily,
    removeFamilyMember, updateFamilyMember, updateFamilyName // All actions must be here!
  ]);

  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <FamilyContext.Provider value={contextValue}>
      {children}
    </FamilyContext.Provider>
  );
};