import { instance } from './axios';

// Upload a photo
export const uploadPhoto = async (formData) => {
  const response = await instance.post('/api/photos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Toggle photo active status
export const togglePhotoActive = async (photoId) => {
  const response = await instance.put(`/api/photos/${photoId}/toggle-active`);
  return response.data;
};

// Get photos for rating with filters
export const getPhotosForRating = async (filters = {}) => {
  const { gender, minAge, maxAge } = filters;
  const params = {};
  if (gender) params.gender = gender;
  if (minAge) params.minAge = minAge;
  if (maxAge) params.maxAge = maxAge;
  const response = await instance.get('/api/photos/rate', { params });
  return response.data;
};

// Rate a photo
export const ratePhoto = async (photoId, rating) => {
  const response = await instance.post(`/api/photos/${photoId}/rate`, { rating });
  return response.data;
};
