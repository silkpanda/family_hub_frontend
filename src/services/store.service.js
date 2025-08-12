// --- File: /frontend/src/services/store.service.js ---
// Provides API functions for managing items in the rewards store.

import api from './api';

const API_URL_STORE = '/store/items';

const getStoreItems = () => api.get(API_URL_STORE).then(res => res.data);
const createStoreItem = (data) => api.post(API_URL_STORE, data).then(res => res.data);

const StoreService = { getStoreItems, createStoreItem };
export default StoreService;