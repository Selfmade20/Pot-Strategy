// Configuration for the ShortLink application
export const config = {
  // Base URL for short links - always use current domain in production
  baseUrl: window.location.origin,
  
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