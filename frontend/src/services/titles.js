import { apiClient } from './api.js';

export const titlesService = {
  getByMood: (moodId) => apiClient.get(`/titles?mood=${encodeURIComponent(moodId)}`),
};
