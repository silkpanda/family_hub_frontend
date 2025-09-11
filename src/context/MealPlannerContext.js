import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { api } from '../api/api';

export const MealPlannerContext = createContext();
export const useMealPlanner = () => useContext(MealPlannerContext);

export const MealPlannerProvider = ({ children }) => {
    const { session } = useAuth();
    const { socket } = useSocket();
    const [mealPlan, setMealPlan] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiBasePath = session?.activeHouseholdId
        ? `/households/${session.activeHouseholdId}/meal-planner`
        : null;

    const fetchAllData = useCallback(async () => {
        // --- THIS IS THE FIX ---
        // If there's no session or household ID, we can't fetch.
        // Stop here to prevent a crash.
        if (!apiBasePath) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [plan, rec, rests] = await Promise.all([
                api.get(apiBasePath),
                api.get(`${apiBasePath}/recipes`),
                api.get(`${apiBasePath}/restaurants`),
            ]);
            setMealPlan(plan);
            setRecipes(rec || []);
            setRestaurants(rests || []);
        } catch (error) {
            console.error('Failed to fetch meal planner data:', error);
        } finally {
            setLoading(false);
        }
    }, [apiBasePath]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        if (!socket) return;
        const handleUpdate = () => fetchAllData();
        socket.on('meal_plan_updated', handleUpdate);
        return () => socket.off('meal_plan_updated', handleUpdate);
    }, [socket, fetchAllData]);

    // --- Other functions (addRecipe, updateMealPlan, etc.) would go here ---
    // Make sure they also check `if (!apiBasePath) return;`

    const value = {
        mealPlan,
        recipes,
        restaurants,
        loading,
        refreshMealPlan: fetchAllData,
    };

    return (
        <MealPlannerContext.Provider value={value}>
            {children}
        </MealPlannerContext.Provider>
    );
};
