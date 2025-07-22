import { instance } from './axios';

// Get user statistics
export const getStatistics = async () => {
  const response = await instance.get('/api/statistics');
  return response.data;
};
