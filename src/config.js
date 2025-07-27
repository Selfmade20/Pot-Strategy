// Configuration for the ShortLink application
export const config = {
  // Base URL for short links - change this for production
  baseUrl: import.meta.env.VITE_BASE_URL || window.location.origin,
  
  // App name
  appName: 'ShortLink',
  
  // Default settings
  defaultSettings: {
    maxLinksPerUser: 100,
    maxUrlLength: 2048,
  }
};

// Helper function to generate short URLs
export const generateShortUrl = (shortCode) => {
  return `${config.baseUrl}/${shortCode}`;
}; 