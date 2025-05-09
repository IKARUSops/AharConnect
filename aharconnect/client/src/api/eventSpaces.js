import axios from 'axios';

export const getEventSpace = async (eventSpaceId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`/api/event-reservations/${eventSpaceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch event space';
  }
};

export const getEventSpaces = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get('/api/event-reservations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch event spaces';
  }
}; 