// Auth utility functions for token and user management

import type { User } from "@/services/auth";

export const AuthUtils = {
  // Token management
  setToken: (token: string) => {
    localStorage.setItem('accessToken', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  removeToken: () => {
    localStorage.removeItem('accessToken');
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },
};
