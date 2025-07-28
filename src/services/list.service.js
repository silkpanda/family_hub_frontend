import api from './api'; // Your centralized Axios instance

const API_URL = '/lists';

// --- List Management ---

/**
 * Fetches all lists.
 * ✨ FIX: It now awaits the response and returns `response.data` directly.
 */
const getLists = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

/**
 * Creates a new list.
 * ✨ FIX: It now awaits the response and returns the new list object from `response.data`.
 */
const createList = async (listData) => {
  // The backend expects an object with a 'name' property.
  const response = await api.post(API_URL, listData);
  return response.data;
};

/**
 * Updates an existing list's name.
 * ✨ FIX: It now awaits the response and returns the updated list from `response.data`.
 */
const updateList = async (id, listName) => {
  const response = await api.put(`${API_URL}/${id}`, { name: listName });
  return response.data;
};

/**
 * Deletes a list.
 * ✨ FIX: It now awaits the response and returns the confirmation message from `response.data`.
 */
const deleteList = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

// --- List Item Management ---

/**
 * Adds an item to a specific list.
 * ✨ FIX: It now awaits the response and returns the entire updated list from `response.data`.
 */
const addItemToList = async (listId, itemContent) => {
  const response = await api.post(`${API_URL}/${listId}/items`, { content: itemContent });
  return response.data;
};

/**
 * Updates an item within a list.
 * ✨ FIX: It now awaits the response and returns the entire updated list from `response.data`.
 */
const updateListItem = async (listId, itemId, itemContent) => {
  const response = await api.put(`${API_URL}/${listId}/items/${itemId}`, { content: itemContent });
  return response.data;
};

/**
 * Deletes an item from a list.
 * ✨ FIX: It now awaits the response and returns the confirmation message from `response.data`.
 */
const deleteListItem = async (listId, itemId) => {
  const response = await api.delete(`${API_URL}/${listId}/items/${itemId}`);
  return response.data;
};

/**
 * Toggles an item's completion status.
 * ✨ FIX: It now awaits the response and returns the entire updated list from `response.data`.
 */
const toggleListItemCompletion = async (listId, itemId) => {
  const response = await api.patch(`${API_URL}/${listId}/items/${itemId}/toggle`);
  return response.data;
};


const ListService = {
  getLists,
  createList,
  updateList,
  deleteList,
  addItemToList,
  updateListItem,
  deleteListItem,
  toggleListItemCompletion,
};

export default ListService;
