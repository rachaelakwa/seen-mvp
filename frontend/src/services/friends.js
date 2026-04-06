import { apiClient } from './api.js';

export const friendsService = {
  getFriends: () => apiClient.get('/friends'),
  getIncomingRequests: () => apiClient.get('/friends/requests/incoming'),
  getSentRequests: () => apiClient.get('/friends/requests/sent'),
  acceptRequest: (requestId) => apiClient.post(`/friends/requests/${requestId}/accept`, {}),
  declineRequest: (requestId) => apiClient.post(`/friends/requests/${requestId}/decline`, {}),
};
