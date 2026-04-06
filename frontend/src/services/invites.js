import { apiClient, buildUrl } from './api.js';

export const invitesService = {
  getMyLink: () => apiClient.get('/invites/link'),
  rotateMyLink: () => apiClient.post('/invites/link', {}),
  useLink: (token) => apiClient.post(`/invites/link/${encodeURIComponent(token)}/use`, {}),
  getLinkPreview: async (token) => {
    const response = await fetch(buildUrl(`/invites/link/${encodeURIComponent(token)}`));
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }
    return response.json();
  },
};
