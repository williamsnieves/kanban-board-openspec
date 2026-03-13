export const localStorageAdapter = {
  save(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn('[Persistence] Storage quota exceeded. Changes not saved.');
      } else {
        console.warn('[Persistence] Failed to save state:', e);
      }
    }
  },

  load<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn('[Persistence] Failed to load state:', e);
      return null;
    }
  },

  clear(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('[Persistence] Failed to clear state:', e);
    }
  },
};
