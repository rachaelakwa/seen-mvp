import { apiClient } from './api.js';

export const recsService = {
  sendRec: (receiverId, titleId, moodId, note) =>
    apiClient.post('/recs', { receiverId, titleId, moodId, note }),

  getInbox: () => apiClient.get('/recs/inbox'),

  getSent: () => apiClient.get('/recs/sent'),
};
