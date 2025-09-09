import React, { createContext, useContext, useMemo } from 'react';
import { HouseholdContext } from './HouseholdContext';
import { AuthContext } from './AuthContext';

// This is a simplified API utility. If you have a central api.js file,
// you should import it from there instead.
const api = {
    async post(endpoint, body, token) {
        const response = await fetch(`/api${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    },
    async put(endpoint, body, token) {
        const response = await fetch(`/api${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    },
    async delete(endpoint, token) {
        const response = await fetch(`/api${endpoint}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    }
};

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    // Consume the master data source: HouseholdContext
    const { householdData, refreshHouseholdData, loading: householdLoading, error: householdError } = useContext(HouseholdContext);
    const { session } = useContext(AuthContext);

    // Extract just the tasks from the main household data object
    const tasks = useMemo(() => householdData?.household?.tasks || [], [householdData]);

    const addTask = async (taskData) => {
        try {
            // The API endpoint for tasks is likely nested under the household
            if (!householdData?.household?._id) throw new Error("Household not loaded.");
            await api.post(`/households/${householdData.household._id}/tasks`, taskData, session.token);
            await refreshHouseholdData(); // Refresh the single source of truth
        } catch (err) {
            console.error("Failed to add task:", err);
            // Optionally, set an error state to show in the UI
        }
    };

    const updateTask = async (taskId, taskData) => {
        try {
            // The API endpoint for a specific task
            await api.put(`/tasks/${taskId}`, taskData, session.token);
            await refreshHouseholdData(); // Refresh the single source of truth
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`, session.token);
            await refreshHouseholdData(); // Refresh the single source of truth
        } catch (err) {
            console.error("Failed to delete task:", err);
        }
    };

    // The value provided by this context now derives its state from HouseholdContext
    const value = {
        tasks,
        loading: householdLoading,
        error: householdError,
        addTask,
        updateTask,
        deleteTask
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

