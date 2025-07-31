// ===================================================================================
// File: /frontend/src/services/list.service.js
// Purpose: Provides functions for making API calls to the list endpoints.
//
// --- Dev Notes (UPDATE) ---
// - `assignListItem` has been REMOVED.
// - `assignList` is a new function that sends a PATCH request with an array of user IDs
//   to assign them to an entire list.
// ===================================================================================
import api from './api';

const API_URL_LIST = '/lists';

const getLists = () => api.get(API_URL_LIST).then(res => res.data);
const createList = (data) => api.post(API_URL_LIST, data).then(res => res.data);
const deleteList = (id) => api.delete(`${API_URL_LIST}/${id}`).then(res => res.data);
const addItemToList = (listId, itemData) => api.post(`${API_URL_LIST}/${listId}/items`, itemData).then(res => res.data);
const toggleListItemCompletion = (listId, itemId) => api.patch(`${API_URL_LIST}/${listId}/items/${itemId}/toggle`).then(res => res.data);
const deleteListItem = (listId, itemId) => api.delete(`${API_URL_LIST}/${listId}/items/${itemId}`).then(res => res.data);
const assignList = (listId, userIds) => api.patch(`${API_URL_LIST}/${listId}/assign`, { userIds }).then(res => res.data); // --- NEW ---

const ListService = { getLists, createList, deleteList, addItemToList, toggleListItemCompletion, deleteListItem, assignList };
export default ListService;
