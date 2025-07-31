import api from './api';
const API_URL_CHORE = '/chores';

const getChores = () => {
  console.log('[Chore Service] Fetching chores from API...');
  return api.get(API_URL_CHORE).then(res => {
    console.log('[Chore Service] API Response Data:', res.data);
    return res.data;
  });
};

const createChore = (data) => api.post(API_URL_CHORE, data).then(res => res.data);
const updateChore = (id, data) => api.put(`${API_URL_CHORE}/${id}`, data).then(res => res.data);
const deleteChore = (id) => api.delete(`${API_URL_CHORE}/${id}`).then(res => res.data);
const toggleChoreCompletion = (id) => api.patch(`${API_URL_CHORE}/${id}/toggle`).then(res => res.data);

const ChoreService = { getChores, createChore, updateChore, deleteChore, toggleChoreCompletion };
export default ChoreService;