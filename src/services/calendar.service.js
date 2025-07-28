// Purpose: This file acts as the dedicated API layer for the calendar feature.
// It abstracts all `axios` calls, so components don't need to know about API endpoints.
// ===================================================================================
import api from './api'; // The centralized Axios instance

const API_URL = '/calendar/events';

// Fetch all events for the family
const getEvents = () => {
  return api.get(API_URL);
};

// Create a new event
const createEvent = (eventData) => {
  return api.post(API_URL, eventData);
};

// Update an existing event by its ID
const updateEvent = (id, eventData) => {
  return api.put(`${API_URL}/${id}`, eventData);
};

// Delete an event by its ID
const deleteEvent = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const CalendarService = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};

export default CalendarService;
