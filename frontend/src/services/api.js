const configuredApiBase = import.meta.env.VITE_API_BASE_URL;

if (import.meta.env.PROD && !configuredApiBase) {
  throw new Error('VITE_API_BASE_URL must be set for production builds');
}

const API_BASE = (configuredApiBase || 'http://localhost:5001/api').replace(/\/$/, '');

function buildUrl(endpoint) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${normalizedEndpoint}`;
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText || `API Error: ${response.status}`;
    try {
      const error = JSON.parse(errorText);
      message = error.message || message;
    } catch {
      // Keep the raw text when the server returns non-JSON, such as an HTML 404 page.
    }
    throw new Error(message);
  }

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : null;
}

export const apiClient = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export { API_BASE, buildUrl };
