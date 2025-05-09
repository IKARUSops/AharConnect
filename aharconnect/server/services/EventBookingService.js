class EventBookingService {
  constructor(repository) {
    this.repository = repository;
  }

  async createBooking(bookingData) {
    // Check for overlapping bookings first
    const isAvailable = await this.checkAvailability(
      bookingData.eventSpaceId,
      bookingData.startDateTime,
      bookingData.endDateTime
    );

    if (!isAvailable) {
      throw new Error('The selected time slot is not available');
    }

    return await this.repository.create(bookingData);
  }

  async getBookingById(id) {
    const booking = await this.repository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async getUserBookings(userId) {
    return await this.repository.findByUserId(userId);
  }

  async getEventSpaceBookings(eventSpaceId) {
    return await this.repository.findByEventSpaceId(eventSpaceId);
  }

  async updateBooking(id, bookingData) {
    // If updating time, check for conflicts
    if (bookingData.startDateTime || bookingData.endDateTime) {
      const booking = await this.repository.findById(id);
      if (!booking) {
        throw new Error('Booking not found');
      }

      const isAvailable = await this.checkAvailability(
        booking.eventSpaceId,
        bookingData.startDateTime || booking.startDateTime,
        bookingData.endDateTime || booking.endDateTime,
        id // exclude current booking from availability check
      );

      if (!isAvailable) {
        throw new Error('The selected time slot is not available');
      }
    }

    const updatedBooking = await this.repository.update(id, bookingData);
    if (!updatedBooking) {
      throw new Error('Booking not found');
    }
    return updatedBooking;
  }

  async cancelBooking(id) {
    const booking = await this.repository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const updatedBooking = await this.repository.update(id, { status: 'cancelled' });
    return updatedBooking;
  }

  async checkAvailability(eventSpaceId, startDateTime, endDateTime, excludeBookingId = null) {
    try {
      const overlappingBookings = await this.repository.findOverlappingBookings(
        eventSpaceId,
        startDateTime,
        endDateTime
      );

      // If we're checking for an update, exclude the current booking
      if (excludeBookingId) {
        const filteredBookings = overlappingBookings.filter(booking => 
          booking._id.toString() !== excludeBookingId
        );
        return filteredBookings.length === 0;
      }

      return overlappingBookings.length === 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw new Error('Failed to check availability');
    }
  }
}

module.exports = EventBookingService;