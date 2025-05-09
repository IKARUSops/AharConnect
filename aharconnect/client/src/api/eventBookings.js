import API from './auth';

const API_URL = '/event-bookings';

// Create a new booking
export const createEventBooking = async (bookingData) => {
  const response = await API.post(API_URL, bookingData);
  return response.data;
};

// Get all bookings for current user
export const getUserBookings = async () => {
  const response = await API.get(`${API_URL}/user`);
  return response.data;
};

// Get all bookings for an event space
export const getEventSpaceBookings = async (eventSpaceId) => {
  const response = await API.get(`${API_URL}/event-space/${eventSpaceId}`);
  return response.data;
};

// Get a specific booking
export const getBooking = async (bookingId) => {
  const response = await API.get(`${API_URL}/${bookingId}`);
  return response.data;
};

// Update a booking
export const updateBooking = async (bookingId, bookingData) => {
  const response = await API.put(`${API_URL}/${bookingId}`, bookingData);
  return response.data;
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  const response = await API.patch(`${API_URL}/${bookingId}/cancel`);
  return response.data;
};

// Check availability for an event space
export const checkEventSpaceAvailability = async (eventSpaceId, startDateTime, endDateTime) => {
  const response = await API.get(`${API_URL}/check-availability`, {
    params: { eventSpaceId, startDateTime, endDateTime }
  });
  return response.data;
};