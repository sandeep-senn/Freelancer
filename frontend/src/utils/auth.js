const STORAGE_KEY = 'sbworks.auth';

export const loadStoredAuth = () => {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
};

export const saveStoredAuth = (authState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEY);
};
