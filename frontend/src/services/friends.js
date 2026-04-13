import { apiClient } from './api.js';

export const friendsService = {
  getFriends: () => apiClient.get('/friends'),
  discoverUsers: (search = '') => apiClient.get(`/friends/discover?search=${encodeURIComponent(search)}`),
  getIncomingRequests: () => apiClient.get('/friends/requests/incoming'),
  getSentRequests: () => apiClient.get('/friends/requests/sent'),
  sendRequest: (userId) => apiClient.post('/friends/requests', { userId }),
  acceptRequest: (requestId) => apiClient.post(`/friends/requests/${requestId}/accept`, {}),
  declineRequest: (requestId) => apiClient.post(`/friends/requests/${requestId}/decline`, {}),
};
