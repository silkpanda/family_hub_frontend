// ===================================================================================
// File: /src/services/auth.service.js
// Purpose: Provides a simple event-based system for handling global authentication
// events, specifically logout. This allows different parts of the app (like the API
// interceptor) to signal a logout event without being directly coupled to the
// AuthContext or UI components.
// ===================================================================================

// Use the browser's built-in EventTarget API for a simple pub/sub system.
const events = new EventTarget();

export const authService = {
  /**
   * Subscribes a callback function to the 'logout' event.
   * @param {function} callback - The function to call when a logout is triggered.
   */
  onLogout: (callback) => {
    events.addEventListener('logout', callback);
  },

  /**
   * Dispatches a 'logout' event to all listeners.
   */
  triggerLogout: () => {
    events.dispatchEvent(new Event('logout'));
  },

  /**
   * Unsubscribes a callback function from the 'logout' event.
   * @param {function} callback - The callback function to remove.
   */
  removeLogoutListener: (callback) => {
    events.removeEventListener('logout', callback);
  }
};