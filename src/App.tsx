import { useState, useEffect } from 'react';
import { Map } from './components/Map';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProviderData {
  Rndrng_Prvdr_Zip5: string;
  Rndrng_Prvdr_State_FIPS: string;
  Rndrng_Prvdr_Type: string;
  HCPCS_Desc: string;
  Avg_Mdcr_Alowd_Amt: string;
  Tot_Benes: string;
  coordinates: [number, number];
}

function App() {
  const [data, setData] = useState<ProviderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading processed data...');
        const response = await fetch('/processed-data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log('Data loaded successfully:', jsonData.length, 'records');
        setData(jsonData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography color="error" variant="h6">
          Error loading data
        </Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography>No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh' }}>
      <Map data={data} />
    </Box>
  );
}

export default App;
