// --- File: /frontend/src/services/chore.service.js ---
// Provides API functions for interacting with chores and the approval system.

import api from './api';

const API_URL_CHORE = '/chores';

// --- Authenticated Functions ---
const getChores = () => api.get(API_URL_CHORE).then(res => res.data);
const createChore = (data) => api.post(API_URL_CHORE, data).then(res => res.data);
const deleteChore = (id) => api.delete(`${API_URL_CHORE}/${id}`).then(res => res.data);
const submitChoreForApproval = (id) => api.patch(`${API_URL_CHORE}/${id}/submit`).then(res => res.data);
const approveChore = (id) => api.patch(`${API_URL_CHORE}/${id}/approve`).then(res => res.data);
const rejectChore = (id) => api.patch(`${API_URL_CHORE}/${id}/reject`).then(res => res.data);

// --- Public/Unauthenticated Function ---
const completeChoreForChild = (choreId, childId) => {
    return api.patch(`${API_URL_CHORE}/public/${choreId}/complete/${childId}`).then(res => res.data);
};


const ChoreService = { 
    getChores, 
    createChore, 
    deleteChore, 
    submitChoreForApproval, 
    approveChore, 
    rejectChore,
    completeChoreForChild
};

export default ChoreService;