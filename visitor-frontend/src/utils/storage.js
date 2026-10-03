const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const setRole = (role) => localStorage.setItem(ROLE_KEY, role);
export const getRole = () => localStorage.getItem(ROLE_KEY);
export const removeRole = () => localStorage.removeItem(ROLE_KEY);

export const clearStorage = () => {
  removeToken();
  removeRole();
};