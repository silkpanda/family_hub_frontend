import api from './api'; // Your centralized Axios instance

const API_URL = '/lists';

// --- List Management ---

const getLists = () => {
  return api.get(API_URL);
};

const createList = (listName) => {
  return api.post(API_URL, { name: listName });
};

const updateList = (id, listName) => {
  return api.put(`${API_URL}/${id}`, { name: listName });
};

const deleteList = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

// --- List Item Management ---

const addItemToList = (listId, itemContent) => {
  return api.post(`${API_URL}/${listId}/items`, { content: itemContent });
};

const updateListItem = (listId, itemId, itemContent) => {
  return api.put(`${API_URL}/${listId}/items/${itemId}`, { content: itemContent });
};

const deleteListItem = (listId, itemId) => {
  return api.delete(`${API_URL}/${listId}/items/${itemId}`);
};

const toggleListItemCompletion = (listId, itemId) => {
  return api.patch(`${API_URL}/${listId}/items/${itemId}/toggle`);
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
