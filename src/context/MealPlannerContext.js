import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { api } from '../api/api';

// Create the context
export const MealPlannerContext = createContext();

// Create the provider component
export const MealPlannerProvider = ({ children }) => {
    const { session } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [mealPlan, setMealPlan] = useState({});
    const [loading, setLoading] = useState(true);

    // Memoize the API base path to prevent re-renders
    const apiBasePath = useMemo(() => {
        if (!session.activeHouseholdId) return null;
        return `/households/${session.activeHouseholdId}/meal-planner`;
    }, [session.activeHouseholdId]);

    // --- DATA FETCHING ---
    const fetchAllData = useCallback(async () => {
        if (!apiBasePath) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [recipesData, restaurantsData, mealPlanData] = await Promise.all([
                api.get(`${apiBasePath}/recipes`),
                api.get(`${apiBasePath}/restaurants`),
                api.get(`${apiBasePath}/plan`)
            ]);
            setRecipes(recipesData || []);
            setRestaurants(restaurantsData || []);
            setMealPlan(mealPlanData || {});
        } catch (error) {
            console.error("Failed to fetch meal planner data:", error);
            setRecipes([]);
            setRestaurants([]);
            setMealPlan({});
        } finally {
            setLoading(false);
        }
    }, [apiBasePath]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // --- RECIPE MANAGEMENT ---
    const addRecipe = useCallback(async (recipeData) => {
        if (!apiBasePath) return;
        const newRecipe = await api.post(`${apiBasePath}/recipes`, recipeData);
        setRecipes(prev => [...prev, newRecipe]);
    }, [apiBasePath]);

    const updateRecipe = useCallback(async (recipeId, recipeData) => {
        if (!apiBasePath) return;
        const updatedRecipe = await api.put(`${apiBasePath}/recipes/${recipeId}`, recipeData);
        setRecipes(prev => prev.map(r => r._id === recipeId ? updatedRecipe : r));
    }, [apiBasePath]);

    const deleteRecipe = useCallback(async (recipeId) => {
        if (!apiBasePath) return;

        // Create a deep copy of the current meal plan to avoid direct state mutation
        const newMealPlan = JSON.parse(JSON.stringify(mealPlan.plan || {}));
        let isUpdated = false;

        // Iterate through each day and meal slot
        for (const date in newMealPlan) {
            for (const mealType in newMealPlan[date]) {
                const meal = newMealPlan[date][mealType];
                // If the meal is a recipe and its itemId matches the one being deleted, remove it.
                if (meal.type === 'recipe' && meal.itemId === recipeId) {
                    delete newMealPlan[date][mealType];
                    isUpdated = true;
                }
            }
        }
        
        // Only update the meal plan if changes were made
        if (isUpdated) {
            await api.put(`${apiBasePath}/plan`, { plan: newMealPlan });
            setMealPlan(prev => ({ ...prev, plan: newMealPlan }));
        }
        
        // Now delete the recipe from the main list
        await api.delete(`${apiBasePath}/recipes/${recipeId}`);
        setRecipes(prev => prev.filter(r => r._id !== recipeId));
    }, [apiBasePath, mealPlan]);

    // --- RESTAURANT MANAGEMENT ---
    const addRestaurant = useCallback(async (restaurantData) => {
        if (!apiBasePath) return;
        const newRestaurant = await api.post(`${apiBasePath}/restaurants`, restaurantData);
        setRestaurants(prev => [...prev, newRestaurant]);
    }, [apiBasePath]);

    const updateRestaurant = useCallback(async (restaurantId, restaurantData) => {
        if (!apiBasePath) return;
        const updatedRestaurant = await api.put(`${apiBasePath}/restaurants/${restaurantId}`, restaurantData);
        setRestaurants(prev => prev.map(r => r._id === restaurantId ? updatedRestaurant : r));
    }, [apiBasePath]);

    const deleteRestaurant = useCallback(async (restaurantId) => {
        if (!apiBasePath) return;

        // Create a deep copy of the current meal plan to avoid direct state mutation
        const newMealPlan = JSON.parse(JSON.stringify(mealPlan.plan || {}));
        let isUpdated = false;

        // Iterate through each day and meal slot
        for (const date in newMealPlan) {
            for (const mealType in newMealPlan[date]) {
                const meal = newMealPlan[date][mealType];
                // If the meal is a restaurant and its itemId matches the one being deleted, remove it.
                if (meal.type === 'restaurant' && meal.itemId === restaurantId) {
                    delete newMealPlan[date][mealType];
                    isUpdated = true;
                }
            }
        }

        // Only update the meal plan if changes were made
        if (isUpdated) {
            await api.put(`${apiBasePath}/plan`, { plan: newMealPlan });
            setMealPlan(prev => ({ ...prev, plan: newMealPlan }));
        }

        // Now delete the restaurant from the main list
        await api.delete(`${apiBasePath}/restaurants/${restaurantId}`);
        setRestaurants(prev => prev.filter(r => r._id !== restaurantId));

    }, [apiBasePath, mealPlan]);

    // --- MEAL PLAN MANAGEMENT (FIXED) ---
    const updateMealPlan = useCallback(async (newPlanObject) => {
        if (!apiBasePath) return;

        // Pessimistic Update: Wait for the server to confirm the change before updating the UI.
        try {
            // Perform the API call and wait for it to complete.
            await api.put(`${apiBasePath}/plan`, { plan: newPlanObject });

            // On success, update the local state. This will happen after the drop animation has finished.
            setMealPlan(prevState => ({ ...prevState, plan: newPlanObject }));

        } catch (error) {
            console.error("Failed to update meal plan:", error);
            // If the API call fails, the UI is not changed, so no rollback is needed.
        }
    }, [apiBasePath]);

    const value = useMemo(() => ({
        recipes,
        restaurants,
        mealPlan,
        loading,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        updateMealPlan,
        refreshMealPlanner: fetchAllData,
    }), [
        recipes, restaurants, mealPlan, loading,
        addRecipe, updateRecipe, deleteRecipe,
        addRestaurant, updateRestaurant, deleteRestaurant,
        updateMealPlan, fetchAllData
    ]);

    return (
        <MealPlannerContext.Provider value={value}>
            {children}
        </MealPlannerContext.Provider>
    );
};
