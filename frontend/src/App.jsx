import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

// Get the appropriate API URL based on environment
const API_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_PRODUCTION_API_URL 
  : import.meta.env.VITE_API_URL;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/data`);
      setData(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Real-Time Dashboard
            </Typography>
            <IconButton onClick={fetchData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>

          {error && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.dark' }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Summary Cards */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Typography variant="h6" gutterBottom>
                    Total Records
                  </Typography>
                  <Typography variant="h4">
                    {data.length}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Typography variant="h6" gutterBottom>
                    Last Updated
                  </Typography>
                  <Typography variant="h4">
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Typography variant="h6" gutterBottom>
                    Data Status
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    Active
                  </Typography>
                </Paper>
              </Grid>

              {/* Data Table */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>
                    Data Table
                  </Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Latitude</th>
                          <th>Longitude</th>
                          <th>Altitude</th>
                          <th>PM2.5</th>
                          <th>PM10</th>
                          <th>Temperature</th>
                          <th>Pressure</th>
                          <th>Humidity</th>
                          <th>Wind Speed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, index) => (
                          <tr key={index}>
                            <td>{row.Date}</td>
                            <td>{row.Time}</td>
                            <td>{row.Latitude}</td>
                            <td>{row.Longitude}</td>
                            <td>{row.Altitude}</td>
                            <td>{row["PM2.5"]}</td>
                            <td>{row["PM10"]}</td>
                            <td>{row.Temperature}</td>
                            <td>{row.Pressure}</td>
                            <td>{row.Humidity}</td>
                            <td>{row["Wind Speed"]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Box>
                </Paper>
              </Grid>

              {/* Charts */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Data Visualization
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="PM2.5" stroke="#8884d8" name="PM2.5" />
                      <Line type="monotone" dataKey="PM10" stroke="#82ca9d" name="PM10" />
                      <Line type="monotone" dataKey="Temperature" stroke="#ffc658" name="Temperature" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
