// --- File: /frontend/src/services/meal.service.js ---
// Provides API functions for managing recipes and the meal plan.

import api from './api';

const API_URL_MEAL = '/meals';

const getAllRecipes = () => api.get(`${API_URL_MEAL}/recipes`).then(res => res.data);
const createRecipe = (data) => api.post(`${API_URL_MEAL}/recipes`, data).then(res => res.data);
const updateRecipe = (id, data) => api.put(`${API_URL_MEAL}/recipes/${id}`, data).then(res => res.data);
const deleteRecipe = (id) => api.delete(`${API_URL_MEAL}/recipes/${id}`).then(res => res.data);
const addIngredientsToList = (recipeId, listId) => api.post(`${API_URL_MEAL}/recipes/${recipeId}/add-to-list`, { listId }).then(res => res.data);
const getMealPlan = () => api.get(`${API_URL_MEAL}/plan`).then(res => res.data);
const addRecipeToPlan = (data) => api.post(`${API_URL_MEAL}/plan`, data).then(res => res.data);
const removeRecipeFromPlan = (data) => api.delete(`${API_URL_MEAL}/plan`, { data }).then(res => res.data);

const MealService = { getAllRecipes, createRecipe, updateRecipe, deleteRecipe, addIngredientsToList, getMealPlan, addRecipeToPlan, removeRecipeFromPlan };
export default MealService;