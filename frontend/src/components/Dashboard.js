import React, { useState, useEffect } from 'react';
import { fetchDashboardData, checkHealth } from '../services/api';
import config from '../config';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHealthy, setIsHealthy] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Check API health first
                const healthStatus = await checkHealth();
                setIsHealthy(healthStatus);
                
                if (!healthStatus) {
                    throw new Error('API is not responding. Please try again later.');
                }

                const result = await fetchDashboardData();
                setData(result);
            } catch (err) {
                setError(err.message);
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchData();

        // Set up polling
        const interval = setInterval(fetchData, config.refreshInterval);

        // Cleanup
        return () => clearInterval(interval);
    }, []);

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <h2>Error Loading Dashboard</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Real-Time Dashboard</h1>
                <div className={`health-status ${isHealthy ? 'healthy' : 'unhealthy'}`}>
                    {isHealthy ? 'API Status: Healthy' : 'API Status: Unhealthy'}
                </div>
            </div>
            <div className="dashboard-grid">
                <div className="data-display">
                    <h2>Latest Data</h2>
                    <div className="data-content">
                        {data.length > 0 ? (
                            <div className="data-list">
                                {data.slice(0, 5).map((item, index) => (
                                    <div key={index} className="data-item">
                                        <div className="data-timestamp">
                                            {formatTimestamp(item.timestamp)}
                                        </div>
                                        <div className="data-values">
                                            {Object.entries(item)
                                                .filter(([key]) => key !== 'timestamp')
                                                .map(([key, value]) => (
                                                    <div key={key} className="data-field">
                                                        <span className="field-label">{key}:</span>
                                                        <span className="field-value">{value}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 