import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { api } from '../api/api';

export const HouseholdContext = createContext();

export const HouseholdProvider = ({ children }) => {
    const { session } = useContext(AuthContext);
    const [householdData, setHouseholdData] = useState({ household: null, loading: true });

    const fetchHouseholdData = useCallback(async () => {
        if (session.mode !== 'loading' && session.activeHouseholdId) {
            setHouseholdData({ household: null, loading: true });
            try {
                const data = await api.get(`/households/${session.activeHouseholdId}`);
                
                // Log the raw data from the API to help with debugging
                console.log('Raw household data from API:', JSON.stringify(data, null, 2));

                // Add a filter to ensure all members have valid user data before setting state.
                // This prevents crashes from incomplete data from the backend.
                if (data && data.members) {
                    data.members = data.members.filter(member => 
                        member && member.user && member.user._id && member.user.displayName
                    );
                }

                setHouseholdData({ household: data, loading: false });
            } catch (error) {
                console.error("Failed to fetch household data:", error);
                setHouseholdData({ household: null, loading: false });
            }
        } else if (session.mode !== 'loading') {
            setHouseholdData({ household: null, loading: false });
        }
    }, [session.activeHouseholdId, session.mode]);

    useEffect(() => {
        fetchHouseholdData();
    }, [fetchHouseholdData]);

    useEffect(() => {
        if (session.socket) {
            const handlePointsUpdated = ({ userId, newPoints }) => {
                setHouseholdData(prevData => {
                    if (!prevData.household) return prevData;

                    const updatedMembers = prevData.household.members.map(member => {
                        // Add a safer check to ensure member and user objects exist
                        if (member && member.user && member.user._id === userId) {
                            return { ...member, user: { ...member.user, points: newPoints } };
                        }
                        return member;
                    });

                    return { ...prevData, household: { ...prevData.household, members: updatedMembers } };
                });
            };

            session.socket.on('points_updated', handlePointsUpdated);

            return () => {
                session.socket.off('points_updated', handlePointsUpdated);
            };
        }
    }, [session.socket]);

    const addMember = useCallback(async (memberData) => {
        if (!householdData.household?._id) return;
        await api.post(`/households/${householdData.household._id}/members`, memberData);
        await fetchHouseholdData();
    }, [householdData.household, fetchHouseholdData]);

    const updateMember = useCallback(async (memberId, updateData) => {
        if (!householdData.household?._id) return;
        await api.put(`/households/${householdData.household._id}/members/${memberId}`, updateData);
        await fetchHouseholdData();
    }, [householdData.household, fetchHouseholdData]);

    const deleteMember = useCallback(async (memberId) => {
        if (!householdData.household?._id) return;
        try {
            await api.delete(`/households/${householdData.household._id}/members/${memberId}`);
            await fetchHouseholdData();
        } catch (error) {
            console.error("Failed to delete member:", error);
        }
    }, [householdData.household, fetchHouseholdData]);

    const linkCalendar = useCallback(async (memberId) => {
        if (!householdData.household?._id) return;
        try {
            await api.post(`/households/${householdData.household._id}/members/${memberId}/link-calendar`);
            await fetchHouseholdData();
        } catch (error) {
            console.error("Failed to link calendar:", error);
        }
    }, [householdData.household, fetchHouseholdData]);

    const updateMemberColor = useCallback(async (memberId, color) => {
        if (!householdData.household?._id) return;
        try {
            await api.put(`/households/${householdData.household._id}/members/${memberId}/color`, { color });
            await fetchHouseholdData();
        } catch (error) {
            console.error("Failed to update member color:", error);
        }
    }, [householdData.household, fetchHouseholdData]);

    const value = useMemo(() => ({
        householdData,
        addMember,
        updateMember,
        deleteMember,
        linkCalendar,
        updateMemberColor,
        refreshHouseholdData: fetchHouseholdData
    }), [householdData, addMember, updateMember, deleteMember, linkCalendar, updateMemberColor, fetchHouseholdData]);

    return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>;
};

