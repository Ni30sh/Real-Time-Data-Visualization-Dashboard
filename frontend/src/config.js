const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'https://data-visualization-dashboard-9g3b.onrender.com',
    refreshInterval: 5000, // 5 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
};

export default config; 