// ===================================================================================
// File: /frontend/src/context/MealContext.js
// Purpose: Manages all state and actions for the Meal Planner feature.
//
// --- Dev Notes (UPDATE) ---
// - BUG FIX: The dashboard was not updating in real-time after the meal plan was changed.
//   The previous "fire-and-forget" approach was not reliable.
// - SOLUTION:
//   - The `addRecipeToPlan` and `removeRecipeFromPlan` functions have been updated to
//     await the API response from the service.
//   - They now use this response to dispatch a `SET_MEAL_PLAN` action immediately,
//     ensuring the UI updates instantly for the user performing the action.
//   - The WebSocket listener remains in place to handle updates for other clients.
// ===================================================================================
import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import MealService from '../services/meal.service.js';
import { useLists } from './ListContext.js';
import { AuthContext } from './AuthContext.js';
import { socket } from './SocketContext.js';

export const MealContext = createContext();

export const useMeals = () => {
    const context = useContext(MealContext);
    if (context === undefined) {
        return {
            state: { recipes: [], mealPlan: null, recipesLoading: true, mealPlanLoading: true, error: null },
            actions: {}
        };
    }
    return context;
};

const actionTypes = { SET_RECIPES_LOADING: 'SET_RECIPES_LOADING', SET_MEAL_PLAN_LOADING: 'SET_MEAL_PLAN_LOADING', SET_RECIPES: 'SET_RECIPES', ADD_RECIPE: 'ADD_RECIPE', UPDATE_RECIPE: 'UPDATE_RECIPE', DELETE_RECIPE: 'DELETE_RECIPE', SET_MEAL_PLAN: 'SET_MEAL_PLAN', SET_ERROR: 'SET_ERROR' };

const mealReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_RECIPES_LOADING: return { ...state, recipesLoading: true, error: null };
    case actionTypes.SET_MEAL_PLAN_LOADING: return { ...state, mealPlanLoading: true, error: null };
    case actionTypes.SET_RECIPES: return { ...state, recipes: action.payload, recipesLoading: false };
    case actionTypes.ADD_RECIPE: return { ...state, recipes: [...state.recipes, action.payload] };
    case actionTypes.UPDATE_RECIPE: return { ...state, recipes: state.recipes.map(r => r._id === action.payload._id ? action.payload : r) };
    case actionTypes.DELETE_RECIPE: return { ...state, recipes: state.recipes.filter(r => r._id !== action.payload.id) };
    case actionTypes.SET_MEAL_PLAN: return { ...state, mealPlan: action.payload, mealPlanLoading: false };
    case actionTypes.SET_ERROR: return { ...state, error: action.payload, recipesLoading: false, mealPlanLoading: false };
    default: return state;
  }
};

export const MealProvider = ({ children }) => {
  const initialState = { recipes: [], mealPlan: null, recipesLoading: true, mealPlanLoading: true, error: null };
  const [state, dispatch] = useReducer(mealReducer, initialState);
  const { actions: listActions } = useLists();
  const { isAuthenticated, isReady } = useContext(AuthContext);

  useEffect(() => {
    if (socket) {
        const handlePlanUpdate = (updatedPlan) => {
            console.log('[Socket] Received mealplan:updated', updatedPlan);
            dispatch({ type: actionTypes.SET_MEAL_PLAN, payload: updatedPlan });
        };
        socket.on('mealplan:updated', handlePlanUpdate);
        return () => {
            socket.off('mealplan:updated', handlePlanUpdate);
        };
    }
  }, []);

  const fetchRecipes = useCallback(async () => {
      dispatch({ type: actionTypes.SET_RECIPES_LOADING });
      try {
          const response = await MealService.getAllRecipes();
          dispatch({ type: actionTypes.SET_RECIPES, payload: response || [] });
      } catch (err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, []);

  const fetchMealPlan = useCallback(async () => {
      dispatch({ type: actionTypes.SET_MEAL_PLAN_LOADING });
      try {
          const response = await MealService.getMealPlan();
          dispatch({ type: actionTypes.SET_MEAL_PLAN, payload: response });
      } catch (err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, []);

  useEffect(() => {
    if (isReady && isAuthenticated) {
        fetchRecipes();
        fetchMealPlan();
    }
  }, [isReady, isAuthenticated, fetchRecipes, fetchMealPlan]);

  const createRecipe = useCallback(async (recipeData) => {
      try {
          const response = await MealService.createRecipe(recipeData);
          dispatch({ type: actionTypes.ADD_RECIPE, payload: response });
      } catch (err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, []);
  
  const updateRecipe = useCallback(async (id, recipeData) => {
    try {
        const response = await MealService.updateRecipe(id, recipeData);
        dispatch({ type: actionTypes.UPDATE_RECIPE, payload: response });
    } catch (err) {
        dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, []);

  // --- UPDATED --- Now provides instant UI feedback from the API response.
  const addRecipeToPlan = useCallback(async (planData) => {
      try {
          const updatedPlan = await MealService.addRecipeToPlan(planData);
          dispatch({ type: actionTypes.SET_MEAL_PLAN, payload: updatedPlan });
      } catch (err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, []);

  // --- UPDATED --- Now provides instant UI feedback from the API response.
  const removeRecipeFromPlan = useCallback(async (planData) => {
      try {
          const updatedPlan = await MealService.removeRecipeFromPlan(planData);
          dispatch({ type: actionTypes.SET_MEAL_PLAN, payload: updatedPlan });
      } catch (err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, []);

  const addIngredientsToList = useCallback(async (recipeId, listId) => {
      try {
          await MealService.addIngredientsToList(recipeId, listId);
          if (listActions && listActions.fetchLists) {
              listActions.fetchLists();
          }
      } catch (err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, [listActions]);

  const actions = useMemo(() => ({ fetchRecipes, createRecipe, updateRecipe, addRecipeToPlan, removeRecipeFromPlan, addIngredientsToList }), [fetchRecipes, createRecipe, updateRecipe, addRecipeToPlan, removeRecipeFromPlan, addIngredientsToList]);
  const contextValue = useMemo(() => ({ state, actions }), [state, actions]);

  return <MealContext.Provider value={contextValue}>{children}</MealContext.Provider>;
};
