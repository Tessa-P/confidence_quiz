// Get API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Get the base path for the app (e.g., '/confidence_quiz' in production, '' in local)
const APP_BASE_PATH = import.meta.env.VITE_BASE_PATH || ''

// Helper function to build API URLs
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_BASE_URL}/${cleanEndpoint}`
}

// Export base path for use in router config
export { API_BASE_URL, APP_BASE_PATH }
