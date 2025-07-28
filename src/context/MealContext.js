import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import MealService from '../services/meal.service.js';
import { SocketContext } from './SocketContext.js';
import { ListContext } from './ListContext.js';

export const MealContext = createContext();

// --- Reducer Actions ---
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_RECIPES: 'SET_RECIPES',
  ADD_RECIPE: 'ADD_RECIPE',
  UPDATE_RECIPE: 'UPDATE_RECIPE',
  DELETE_RECIPE: 'DELETE_RECIPE',
  SET_MEAL_PLAN: 'SET_MEAL_PLAN',
  SET_ERROR: 'SET_ERROR',
};

// --- Reducer Implementation ---
const mealReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: true, error: null };
    case actionTypes.SET_RECIPES:
      return { ...state, recipes: action.payload, loading: false };
    case actionTypes.ADD_RECIPE:
      return { ...state, recipes: [...state.recipes, action.payload] };
    case actionTypes.UPDATE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map(r => r._id === action.payload._id ? action.payload : r),
      };
    case actionTypes.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(r => r._id !== action.payload.id),
      };
    case actionTypes.SET_MEAL_PLAN:
      return { ...state, mealPlan: action.payload, loading: false };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// --- Provider ---
export const MealProvider = ({ children }) => {
  const initialState = {
    recipes: [],
    mealPlan: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(mealReducer, initialState);
  const socket = useContext(SocketContext);
  const { fetchLists } = useContext(ListContext);

  useEffect(() => {
    if (socket) {
      socket.on('mealplan:updated', (updatedPlan) => {
        dispatch({ type: actionTypes.SET_MEAL_PLAN, payload: updatedPlan });
      });
      return () => socket.off('mealplan:updated');
    }
  }, [socket]);

  const fetchRecipes = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await MealService.getAllRecipes();
      dispatch({ type: actionTypes.SET_RECIPES, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);

  const createRecipe = useCallback(async (recipeData) => {
    try {
      const response = await MealService.createRecipe(recipeData);
      dispatch({ type: actionTypes.ADD_RECIPE, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);
  
  const deleteRecipe = useCallback(async (id) => {
    try {
      await MealService.deleteRecipe(id);
      dispatch({ type: actionTypes.DELETE_RECIPE, payload: { id } });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);

  const fetchMealPlan = useCallback(async () => {
    dispatch({ type: actionTypes.SET_LOADING });
    try {
      const response = await MealService.getMealPlan();
      dispatch({ type: actionTypes.SET_MEAL_PLAN, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);

  const addRecipeToPlan = useCallback(async (planData) => {
    try {
      const response = await MealService.addRecipeToPlan(planData);
      dispatch({ type: actionTypes.SET_MEAL_PLAN, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);
  
  const removeRecipeFromPlan = useCallback(async (planData) => {
    try {
      const response = await MealService.removeRecipeFromPlan(planData);
      dispatch({ type: actionTypes.SET_MEAL_PLAN, payload: response.data });
    } catch (err) {
      dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
    }
  }, [dispatch]);

  const addIngredientsToList = useCallback(async (recipeId, listId) => {
      try {
          await MealService.addIngredientsToList(recipeId, listId);
          fetchLists();
      } catch (err) {
          dispatch({ type: actionTypes.SET_ERROR, payload: err.message });
      }
  }, [fetchLists, dispatch]);

  const actions = useMemo(() => ({
    fetchRecipes,
    createRecipe,
    deleteRecipe,
    fetchMealPlan,
    addRecipeToPlan,
    removeRecipeFromPlan,
    addIngredientsToList,
  }), [fetchRecipes, createRecipe, deleteRecipe, fetchMealPlan, addRecipeToPlan, removeRecipeFromPlan, addIngredientsToList]);

  const contextValue = useMemo(() => ({
    ...state,
    ...actions,
  }), [state, actions]);

  return (
    <MealContext.Provider value={contextValue}>
      {children}
    </MealContext.Provider>
  );
};
