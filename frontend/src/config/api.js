// API Configuration
// Automatically detects if running on Vercel or locally
const getApiBaseUrl = () => {
  // In production (Vercel), use relative URLs
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  // In development, use localhost
  return process.env.REACT_APP_API_URL || 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to create full API URLs
export const apiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export default {
  API_BASE_URL,
  apiUrl
};

