import React, { useState } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import debounce from 'lodash/debounce';

const LocationAutocomplete = ({ onLocationSelect }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const searchLocation = async (searchText) => {
    if (!searchText || searchText.length < 3) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      // Add Dhaka to the search query to prioritize local results
      const query = `${searchText}, Dhaka`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );

      if (!response.ok) {
        throw new Error('Location search failed');
      }

      const data = await response.json();
      const locations = data.map(item => ({
        name: item.display_name,
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      }));

      setOptions(locations);
    } catch (error) {
      console.error('Error searching locations:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the search to avoid too many API calls
  const debouncedSearch = React.useMemo(
    () => debounce(searchLocation, 300),
    []
  );

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    debouncedSearch(newInputValue);
  };

  const handleLocationSelect = (event, value) => {
    if (value) {
      onLocationSelect(value);
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleLocationSelect}
      options={options}
      getOptionLabel={(option) => option.name || ''}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search location"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default LocationAutocomplete;
