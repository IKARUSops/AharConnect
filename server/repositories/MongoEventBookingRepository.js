const EventBooking = require('../models/EventBooking');

class MongoEventBookingRepository {
  async create(booking) {
    const newBooking = new EventBooking(booking);
    return await newBooking.save();
  }

  async findById(id) {
    return await EventBooking.findById(id);
  }

  async findByUserId(userId) {
    return await EventBooking.find({ userId });
  }

  async findByEventSpaceId(eventSpaceId) {
    return await EventBooking.find({ eventSpaceId });
  }

  async update(id, booking) {
    return await EventBooking.findByIdAndUpdate(id, booking, { new: true });
  }

  async delete(id) {
    const result = await EventBooking.findByIdAndDelete(id);
    return !!result;
  }

  async findOverlappingBookings(eventSpaceId, startDateTime, endDateTime) {
    return await EventBooking.find({
      eventSpaceId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          startDateTime: { $lt: endDateTime },
          endDateTime: { $gt: startDateTime }
        }
      ]
    });
  }
}

module.exports = MongoEventBookingRepository;
