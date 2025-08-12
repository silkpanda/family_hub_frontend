// --- File: /frontend/src/services/auth.service.js ---
// Provides authentication-related API functions.

import api from './api';

// Use EventTarget to create a simple event system for logout events.
const events = new EventTarget();

// loginWithPin: Sends a request to log in a parent user with their PIN.
const loginWithPin = (memberId, pin) => {
    return api.post('/auth/pin-login', { memberId, pin }).then(res => res.data);
};

export const authService = {
  onLogout: (callback) => { events.addEventListener('logout', callback); },
  triggerLogout: () => { events.dispatchEvent(new Event('logout')); },
  removeLogoutListener: (callback) => { events.removeEventListener('logout', callback); },
  loginWithPin,
};