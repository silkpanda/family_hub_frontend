import api from './api';

const API_URL_LIST = '/lists';

const getLists = () => api.get(API_URL_LIST).then(res => res.data);

// Expects an object like { name: 'New List' }
const createList = (data) => api.post(API_URL_LIST, data).then(res => res.data);

const deleteList = (id) => api.delete(`${API_URL_LIST}/${id}`).then(res => res.data);

// Expects a simple string for content
const addItemToList = (listId, content) => api.post(`${API_URL_LIST}/${listId}/items`, { content }).then(res => res.data);

const toggleListItemCompletion = (listId, itemId) => api.patch(`${API_URL_LIST}/${listId}/items/${itemId}/toggle`).then(res => res.data);

const deleteListItem = (listId, itemId) => api.delete(`${API_URL_LIST}/${listId}/items/${itemId}`).then(res => res.data);

const ListService = { 
  getLists, 
  createList, 
  deleteList, 
  addItemToList, 
  toggleListItemCompletion, 
  deleteListItem 
};

export default ListService;