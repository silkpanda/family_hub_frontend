// ===================================================================================
// File: /src/services/calendar.service.js
// Purpose: Encapsulates all API calls related to the calendar feature. Each function
// corresponds to a specific backend endpoint for calendar events. This keeps the
// API logic separate from the UI components and context.
// ===================================================================================
import api from './api';

const API_URL_CAL = '/calendar/events';

// Each function returns the `data` from the Axios response.
const getEvents = () => api.get(API_URL_CAL).then(res => res.data);
const createEvent = (data) => api.post(API_URL_CAL, data).then(res => res.data);
const updateEvent = (id, data) => api.put(`${API_URL_CAL}/${id}`, data).then(res => res.data);
const deleteEvent = (id) => api.delete(`${API_URL_CAL}/${id}`).then(res => res.data);

const CalendarService = { getEvents, createEvent, updateEvent, deleteEvent };
export default CalendarService;
