class EventBookingService {
  constructor(repository) {
    this.repository = repository;
  }

  async createBooking(bookingData) {
    // Check for overlapping bookings
    const overlappingBookings = await this.repository.findOverlappingBookings(
      bookingData.eventSpaceId,
      bookingData.startDateTime,
      bookingData.endDateTime
    );

    if (overlappingBookings.length > 0) {
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
    if (bookingData.startDateTime || bookingData.endDateTime) {
      const booking = await this.repository.findById(id);
      const overlappingBookings = await this.repository.findOverlappingBookings(
        booking.eventSpaceId,
        bookingData.startDateTime || booking.startDateTime,
        bookingData.endDateTime || booking.endDateTime
      );

      // Filter out the current booking from overlapping results
      const otherOverlappingBookings = overlappingBookings.filter(b => b.id !== id);
      
      if (otherOverlappingBookings.length > 0) {
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
    const updatedBooking = await this.repository.update(id, { status: 'cancelled' });
    if (!updatedBooking) {
      throw new Error('Booking not found');
    }
    return updatedBooking;
  }

  async checkAvailability(eventSpaceId, startDateTime, endDateTime) {
    const overlappingBookings = await this.repository.findOverlappingBookings(
      eventSpaceId,
      startDateTime,
      endDateTime
    );
    return overlappingBookings.length === 0;
  }
}

module.exports = EventBookingService;
