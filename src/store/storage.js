export const storage = {
  // Get data by key
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error);
      return null;
    }
  },

  // Set data by key
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing storage key "${key}":`, error);
    }
  },

  // Optional: Remove key
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage key "${key}":`, error);
    }
  },

  // Optional: Clear all storage
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }
};