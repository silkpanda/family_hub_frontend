import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { api } from '../api/api';

export const RewardContext = createContext();

export const RewardProvider = ({ children }) => {
    const { session } = useContext(AuthContext);
    const [rewards, setRewards] = useState([]);
    const [redemptionRequests, setRedemptionRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiBasePath = useMemo(() => {
        if (!session.activeHouseholdId) return null;
        return `/households/${session.activeHouseholdId}/rewards`;
    }, [session.activeHouseholdId]);

    const fetchAllData = useCallback(async () => {
        if (!apiBasePath) {
            console.log('[RewardContext] No apiBasePath, skipping fetch.');
            setLoading(false);
            return;
        }
        console.log('[RewardContext] Starting to fetch all data...');
        setLoading(true);
        try {
            // Fetch both rewards and redemption requests in parallel
            const [rewardsResponse, requestsResponse] = await Promise.all([
                api.get(apiBasePath),
                api.get(`${apiBasePath}/requests`) // Assuming this is the endpoint for requests
            ]);

            console.log('[RewardContext] Fetched rewards data:', rewardsResponse);
            setRewards(rewardsResponse || []);

            console.log('[RewardContext] Fetched redemption requests:', requestsResponse);
            setRedemptionRequests(requestsResponse || []);

        } catch (error) {
            console.error("[RewardContext] Failed to fetch reward data:", error);
            setRewards([]);
            setRedemptionRequests([]);
        } finally {
            console.log('[RewardContext] Finished fetching all data.');
            setLoading(false);
        }
    }, [apiBasePath]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    useEffect(() => {
        if (session.socket && session.activeHouseholdId) {
            console.log('[RewardContext] Setting up WebSocket listeners.');
            const onRewardCreated = (newReward) => { console.log('[WS] reward_created:', newReward); setRewards(prev => [...prev, newReward]); };
            const onRewardUpdated = (updatedReward) => { console.log('[WS] reward_updated:', updatedReward); setRewards(prev => prev.map(r => r._id === updatedReward._id ? updatedReward : r)); };
            const onRewardDeleted = (rewardId) => { console.log('[WS] reward_deleted:', rewardId); setRewards(prev => prev.filter(r => r._id !== rewardId)); };
            const onRedemptionRequested = (newRequest) => { console.log('[WS] redemption_requested:', newRequest); setRedemptionRequests(prev => [...prev, newRequest]); };
            const onRedemptionApproved = (approvedRequest) => { console.log('[WS] redemption_approved:', approvedRequest); setRedemptionRequests(prev => prev.map(r => r._id === approvedRequest._id ? approvedRequest : r)); };
            const onRedemptionDenied = (deniedRequest) => { console.log('[WS] redemption_denied:', deniedRequest); setRedemptionRequests(prev => prev.map(r => r._id === deniedRequest._id ? deniedRequest : r)); };

            session.socket.on('reward_created', onRewardCreated);
            session.socket.on('reward_updated', onRewardUpdated);
            session.socket.on('reward_deleted', onRewardDeleted);
            session.socket.on('redemption_requested', onRedemptionRequested);
            session.socket.on('redemption_approved', onRedemptionApproved);
            session.socket.on('redemption_denied', onRedemptionDenied);

            return () => {
                console.log('[RewardContext] Cleaning up WebSocket listeners.');
                session.socket.off('reward_created', onRewardCreated);
                session.socket.off('reward_updated', onRewardUpdated);
                session.socket.off('reward_deleted', onRewardDeleted);
                session.socket.off('redemption_requested', onRedemptionRequested);
                session.socket.off('redemption_approved', onRedemptionApproved);
                session.socket.off('redemption_denied', onRedemptionDenied);
            };
        }
    }, [session.socket, session.activeHouseholdId]);
    
    const addReward = useCallback((rewardData) => api.post(apiBasePath, rewardData), [apiBasePath]);
    const updateReward = useCallback((rewardId, rewardData) => api.put(`${apiBasePath}/${rewardId}`, rewardData), [apiBasePath]);
    const deleteReward = useCallback((rewardId) => api.delete(`${apiBasePath}/${rewardId}`), [apiBasePath]);
    const requestRedemption = useCallback((rewardId, userId) => api.post(`${apiBasePath}/${rewardId}/redeem`, { userId }), [apiBasePath]);
    const approveRedemption = useCallback((requestId) => api.post(`${apiBasePath}/requests/${requestId}/approve`), [apiBasePath]);
    const denyRedemption = useCallback((requestId) => api.post(`${apiBasePath}/requests/${requestId}/deny`), [apiBasePath]);

    const value = useMemo(() => {
        const contextValue = {
            rewards,
            redemptionRequests,
            loading,
            addReward,
            updateReward,
            deleteReward,
            requestRedemption,
            approveRedemption,
            denyRedemption,
            refreshRewards: fetchAllData
        };
        console.log('[RewardContext] Providing new context value:', contextValue);
        return contextValue;
    }, [rewards, redemptionRequests, loading, addReward, updateReward, deleteReward, requestRedemption, approveRedemption, denyRedemption, fetchAllData]);

    return <RewardContext.Provider value={value}>{children}</RewardContext.Provider>;
};

