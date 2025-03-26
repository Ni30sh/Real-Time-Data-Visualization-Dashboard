import config from '../config';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options = {}, retryCount = 0) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (retryCount < config.retryAttempts) {
            console.log(`Retry attempt ${retryCount + 1} of ${config.retryAttempts}`);
            await delay(config.retryDelay);
            return fetchWithRetry(url, options, retryCount + 1);
        }
        throw error;
    }
};

export const fetchDashboardData = async () => {
    try {
        const response = await fetchWithRetry(`${config.apiUrl}/data`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('Failed to fetch dashboard data. Please try again later.');
    }
}; 