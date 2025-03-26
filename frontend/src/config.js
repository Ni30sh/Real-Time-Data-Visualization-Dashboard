const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    refreshInterval: 5000, // 5 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
};

export default config; 