import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
} from 'react';
import { useAuth } from './AuthContext'; // It's better to use the custom hook
import { api } from '../api/api';

export const HouseholdContext = createContext();

export const useHousehold = () => useContext(HouseholdContext);

export const HouseholdProvider = ({ children }) => {
    const { session } = useAuth();
    const [householdData, setHouseholdData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHouseholdData = useCallback(async () => {
        // --- THIS IS THE FIX ---
        // If there's no session, we can't fetch anything.
        // Set loading to false and stop here.
        if (!session || !session.activeHouseholdId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await api.get(
                `/households/${session.activeHouseholdId}`
            );
            setHouseholdData(data);
        } catch (err) {
            console.error('Failed to fetch household data:', err);
            setError(
                'Could not load household information. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    }, [session]); // The dependency on `session` is key

    useEffect(() => {
        fetchHouseholdData();
    }, [fetchHouseholdData]);

    const value = {
        householdData,
        loading,
        error,
        refreshHouseholdData: fetchHouseholdData, // Expose a refresh function
    };

    return (
        <HouseholdContext.Provider value={value}>
            {children}
        </HouseholdContext.Provider>
    );
};
