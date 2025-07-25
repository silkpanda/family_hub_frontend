const events = new EventTarget();

export const authService = {
  onLogout: (callback) => {
    events.addEventListener('logout', callback);
  },
  triggerLogout: () => {
    events.dispatchEvent(new Event('logout'));
  },
  removeLogoutListener: (callback) => {
    events.removeEventListener('logout', callback);
  }
};