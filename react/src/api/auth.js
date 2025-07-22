import { instance } from './axios';

// Register a new user
export const register = async (data) => {
  const response = await instance.post('/api/register', data);
  return response.data;
};

// Login user
export const login = async (data) => {
  const response = await instance.post('/api/login', data);
  return response.data;
};

// Request password reset
export const requestPasswordReset = async (data) => {
  const response = await instance.post('/api/reset-password-request', data);
  return response.data;
};

// Reset password
export const resetPassword = async (data) => {
  const response = await instance.post('/api/reset-password', data);
  return response.data;
};
