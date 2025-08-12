// --- File: /frontend/src/services/calendar.service.js ---
// Provides API functions for interacting with calendar events.

import api from './api';

const API_URL_CAL = '/calendar/events';

const getEvents = () => api.get(API_URL_CAL).then(res => res.data);
const createEvent = (data) => api.post(API_URL_CAL, data).then(res => res.data);
const updateEvent = (id, data) => api.put(`${API_URL_CAL}/${id}`, data).then(res => res.data);
const deleteEvent = (id) => api.delete(`${API_URL_CAL}/${id}`).then(res => res.data);

const CalendarService = { getEvents, createEvent, updateEvent, deleteEvent };
export default CalendarService;