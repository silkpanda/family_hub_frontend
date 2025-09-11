import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
} from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { api } from '../api/api';

export const RewardContext = createContext();
export const useRewards = () => useContext(RewardContext);

export const RewardProvider = ({ children }) => {
    const { session } = useAuth();
    const { socket } = useSocket();
    const [rewards, setRewards] = useState([]);
    const [redemptionRequests, setRedemptionRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiBasePath = session?.activeHouseholdId
        ? `/households/${session.activeHouseholdId}`
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
            const [rewardsRes, requestsRes] = await Promise.all([
                api.get(`${apiBasePath}/rewards`),
                api.get(`${apiBasePath}/redemption-requests`),
            ]);
            setRewards(rewardsRes || []);
            setRedemptionRequests(requestsRes || []);
        } catch (error) {
            console.error('Failed to fetch reward data:', error);
        } finally {
            setLoading(false);
        }
    }, [apiBasePath]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        if (!socket) return;

        const handleRewardUpdate = () => fetchAllData();

        socket.on('reward_updated', handleRewardUpdate);
        socket.on('redemption_updated', handleRewardUpdate);

        return () => {
            socket.off('reward_updated', handleRewardUpdate);
            socket.off('redemption_updated', handleRewardUpdate);
        };
    }, [socket, fetchAllData]);

    const addReward = async (rewardData) => {
        if (!apiBasePath) return;
        await api.post(`${apiBasePath}/rewards`, rewardData);
        fetchAllData(); // Refresh
    };

    const updateReward = async (rewardId, rewardData) => {
        if (!apiBasePath) return;
        await api.put(`${apiBasePath}/rewards/${rewardId}`, rewardData);
        fetchAllData(); // Refresh
    };

    const deleteReward = async (rewardId) => {
        if (!apiBasePath) return;
        await api.delete(`${apiBasePath}/rewards/${rewardId}`);
        fetchAllData(); // Refresh
    };

    const requestRedemption = async (rewardId, userId) => {
        if (!apiBasePath) return;
        await api.post(`${apiBasePath}/redemption-requests`, { rewardId, userId });
        fetchAllData(); // Refresh
    };

    const approveRedemption = async (requestId) => {
        if (!apiBasePath) return;
        await api.put(`${apiBasePath}/redemption-requests/${requestId}/approve`);
        fetchAllData(); // Refresh
    };

    const denyRedemption = async (requestId) => {
        if (!apiBasePath) return;
        await api.put(`${apiBasePath}/redemption-requests/${requestId}/deny`);
        fetchAllData(); // Refresh
    };

    const value = {
        rewards,
        redemptionRequests,
        loading,
        addReward,
        updateReward,
        deleteReward,
        requestRedemption,
        approveRedemption,
        denyRedemption,
        refreshRewards: fetchAllData,
    };

    return (
        <RewardContext.Provider value={value}>{children}</RewardContext.Provider>
    );
};

