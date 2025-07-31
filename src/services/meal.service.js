// ===================================================================================
// File: /src/services/meal.service.js
// Purpose: Encapsulates all API calls for the meal planning feature, including
// recipe management and meal plan updates.
// ===================================================================================
import api from './api';

const API_URL_MEAL = '/meals';

// --- Recipe Endpoints ---
const getAllRecipes = () => api.get(`${API_URL_MEAL}/recipes`).then(res => res.data);
const createRecipe = (data) => api.post(`${API_URL_MEAL}/recipes`, data).then(res => res.data);
const updateRecipe = (id, data) => api.put(`${API_URL_MEAL}/recipes/${id}`, data).then(res => res.data);
const deleteRecipe = (id) => api.delete(`${API_URL_MEAL}/recipes/${id}`).then(res => res.data);
const addIngredientsToList = (recipeId, listId) => api.post(`${API_URL_MEAL}/recipes/${recipeId}/add-to-list`, { listId }).then(res => res.data);

// --- Meal Plan Endpoints ---
const getMealPlan = () => api.get(`${API_URL_MEAL}/plan`).then(res => res.data);
const addRecipeToPlan = (data) => api.post(`${API_URL_MEAL}/plan`, data).then(res => res.data);
// Note: This DELETE request sends a body, which is non-standard. It should be
// refactored to use URL params or query strings.
const removeRecipeFromPlan = (data) => api.delete(`${API_URL_MEAL}/plan`, { data }).then(res => res.data);

const MealService = { getAllRecipes, createRecipe, updateRecipe, deleteRecipe, addIngredientsToList, getMealPlan, addRecipeToPlan, removeRecipeFromPlan };
export default MealService;