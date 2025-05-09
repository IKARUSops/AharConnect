import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const createEventBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const response = await axios.post('/api/event-bookings', {
      ...bookingData,
      userId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create booking';
  }
};

export const getRestaurantEventBookings = async (restaurantId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`/api/event-bookings/restaurant/${restaurantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch bookings';
  }
};

export const approveEventBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.patch(`/api/event-bookings/${bookingId}/approve`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to approve booking';
  }
};

export const deleteEventBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.delete(`/api/event-bookings/${bookingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete booking';
  }
};
