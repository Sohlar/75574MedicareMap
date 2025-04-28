import { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ProviderData {
  Rndrng_Prvdr_Zip5: string;
  Rndrng_Prvdr_State_FIPS: string;
  Rndrng_Prvdr_Type: string;
  HCPCS_Desc: string;
  Avg_Mdcr_Alowd_Amt: string;
  Tot_Benes: string;
  coordinates: [number, number];
}

interface MapProps {
  data: ProviderData[];
}

export const Map: React.FC<MapProps> = ({ data }) => {
  const [selectedProvider, setSelectedProvider] = useState<ProviderData | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Get unique provider types
  const providerTypes = useMemo(() => {
    const types = new Set(data.map(provider => provider.Rndrng_Prvdr_Type));
    return Array.from(types).sort();
  }, [data]);

  // Filter data based on selected type
  const filteredData = useMemo(() => {
    if (selectedType === 'all') return data;
    return data.filter(provider => provider.Rndrng_Prvdr_Type === selectedType);
  }, [data, selectedType]);

  // Memoize marker click handler
  const handleMarkerClick = useCallback((provider: ProviderData) => {
    setSelectedProvider(provider);
  }, []);

  // Memoize popup content
  const createPopupContent = useCallback((provider: ProviderData) => (
    <div>
      <h3>{provider.Rndrng_Prvdr_Type}</h3>
      <p>{provider.HCPCS_Desc}</p>
      <p>Average Allowed Amount: ${provider.Avg_Mdcr_Alowd_Amt}</p>
      <p>Total Beneficiaries: {provider.Tot_Benes}</p>
    </div>
  ), []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1000,
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 1,
          boxShadow: 1,
          minWidth: 200,
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Provider Type</InputLabel>
          <Select
            value={selectedType}
            label="Provider Type"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            {providerTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {filteredData.map((provider, index) => (
            <Marker
              key={`${provider.Rndrng_Prvdr_Zip5}-${index}`}
              position={provider.coordinates}
              eventHandlers={{
                click: () => handleMarkerClick(provider),
              }}
            >
              <Popup>
                {createPopupContent(provider)}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      {selectedProvider && (
        <Paper
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            padding: 2,
            maxWidth: 300,
            zIndex: 1000,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h6">{selectedProvider.Rndrng_Prvdr_Type}</Typography>
          <Typography>{selectedProvider.HCPCS_Desc}</Typography>
          <Typography>
            Average Allowed Amount: ${selectedProvider.Avg_Mdcr_Alowd_Amt}
          </Typography>
          <Typography>Total Beneficiaries: {selectedProvider.Tot_Benes}</Typography>
        </Paper>
      )}
    </Box>
  );
}; 