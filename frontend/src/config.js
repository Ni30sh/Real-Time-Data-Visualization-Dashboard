const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'https://data-visualization-dashboard-9g3b.onrender.com',
    refreshInterval: parseInt(process.env.REACT_APP_REFRESH_INTERVAL) || 5000, // 5 seconds
    retryAttempts: parseInt(process.env.REACT_APP_RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(process.env.REACT_APP_RETRY_DELAY) || 1000, // 1 second
};

export default config; 