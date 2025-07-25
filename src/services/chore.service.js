import api from './api'; // Your centralized Axios instance

const API_URL = '/chores';

// Fetch all chores for the family
const getChores = () => {
  return api.get(API_URL);
};

// Create a new chore
const createChore = (choreData) => {
  return api.post(API_URL, choreData);
};

// Update an existing chore by its ID
const updateChore = (id, choreData) => {
  return api.put(`${API_URL}/${id}`, choreData);
};

// Delete a chore by its ID
const deleteChore = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

// Toggle a chore's completion status
const toggleChoreCompletion = (id) => {
  return api.patch(`${API_URL}/${id}/toggle`);
};


const ChoreService = {
  getChores,
  createChore,
  updateChore,
  deleteChore,
  toggleChoreCompletion,
};

export default ChoreService;
