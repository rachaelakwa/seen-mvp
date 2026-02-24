import { apiClient } from './api.js';

export const moodsService = {
  createMoodEvent: (moodId, pickCount) =>
    apiClient.post('/moods/events', { moodId, pickCount }),

  getMoodEvents: () => apiClient.get('/moods/events'),
};
