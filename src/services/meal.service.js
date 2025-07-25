import api from './api'; // Your centralized Axios instance

const API_URL = '/meals';

// --- Recipe Box Functions ---

const getAllRecipes = () => {
  return api.get(`${API_URL}/recipes`);
};

const createRecipe = (recipeData) => {
  return api.post(`${API_URL}/recipes`, recipeData);
};

const updateRecipe = (id, recipeData) => {
  return api.put(`${API_URL}/recipes/${id}`, recipeData);
};

const deleteRecipe = (id) => {
  return api.delete(`${API_URL}/recipes/${id}`);
};

const addIngredientsToList = (recipeId, listId) => {
  return api.post(`${API_URL}/recipes/${recipeId}/add-to-list`, { listId });
};


// --- Meal Plan Functions ---

const getMealPlan = () => {
  return api.get(`${API_URL}/plan`);
};

const addRecipeToPlan = (planData) => {
  // planData = { recipeId, date, mealType }
  // CORRECTED: The variable is now API_URL with a single underscore.
  return api.post(`${API_URL}/plan`, planData);
};

const removeRecipeFromPlan = (planData) => {
  // planData = { recipeId, date, mealType }
  return api.delete(`${API_URL}/plan`, { data: planData });
};


const MealService = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addIngredientsToList,
  getMealPlan,
  addRecipeToPlan,
  removeRecipeFromPlan,
};

export default MealService;
