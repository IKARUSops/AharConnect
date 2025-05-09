const EventBooking = require('../models/EventBooking');

class MongoEventBookingRepository {
  async create(bookingData) {
    const booking = new EventBooking(bookingData);
    return await booking.save();
  }

  async findById(id) {
    return await EventBooking.findById(id)
      .populate('eventSpaceId')
      .populate('restaurantId')
      .populate('eventPackageId');
  }

  async findByUserId(userId) {
    return await EventBooking.find({ userId })
      .populate('eventSpaceId')
      .populate('restaurantId')
      .populate('eventPackageId')
      .sort({ startDateTime: -1 });
  }

  async findByEventSpaceId(eventSpaceId) {
    return await EventBooking.find({ eventSpaceId, status: { $ne: 'cancelled' } })
      .populate('userId', 'name email')
      .sort({ startDateTime: 1 });
  }

  async update(id, bookingData) {
    return await EventBooking.findByIdAndUpdate(
      id,
      { $set: bookingData },
      { new: true, runValidators: true }
    ).populate('eventSpaceId')
     .populate('restaurantId')
     .populate('eventPackageId');
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

  // Additional helper methods
  async findByDateRange(startDate, endDate) {
    return await EventBooking.find({
      startDateTime: { $gte: startDate },
      endDateTime: { $lte: endDate },
      status: { $ne: 'cancelled' }
    }).populate('eventSpaceId')
      .populate('restaurantId')
      .sort({ startDateTime: 1 });
  }

  async findByRestaurantId(restaurantId) {
    return await EventBooking.find({ 
      restaurantId,
      status: { $ne: 'cancelled' }
    }).populate('eventSpaceId')
      .populate('userId', 'name email')
      .sort({ startDateTime: -1 });
  }

  async countActiveBookings(eventSpaceId) {
    return await EventBooking.countDocuments({
      eventSpaceId,
      status: { $ne: 'cancelled' },
      endDateTime: { $gte: new Date() }
    });
  }

  async findPendingBookings() {
    return await EventBooking.find({
      status: 'pending',
      startDateTime: { $gte: new Date() }
    }).populate('eventSpaceId')
      .populate('restaurantId')
      .populate('userId', 'name email')
      .sort({ startDateTime: 1 });
  }
}

module.exports = MongoEventBookingRepository;
