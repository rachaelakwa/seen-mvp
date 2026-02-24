import { apiClient } from './api.js';

export const savesService = {
  getSaves: () => apiClient.get('/saves'),

  createSave: (titleId, moodId) =>
    apiClient.post('/saves', { titleId, moodId }),

  deleteSave: (id) => apiClient.delete(`/saves/${id}`),
};
