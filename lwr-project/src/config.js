// Configuration for different environments
// This file is checked into git and provides defaults
// For Vercel deployment, we'll use a build-time replacement

const config = {
    // Default to localhost for development
    BACKEND_API_URL: 'http://localhost:3001',

    // Override for production (updated during build)
    ...(typeof window !== 'undefined' && window.APP_CONFIG ? window.APP_CONFIG : {})
};

export default config;
