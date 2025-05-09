const EventBooking = require('../models/EventBooking');
const EventPackage = require('../models/EventPackage');
const EventBookingService = require('../services/EventBookingService');
const MongoEventBookingRepository = require('../repositories/MongoEventBookingRepository');
const { sendBookingApprovalEmail, sendBookingDeletionEmail } = require('../services/emailService');

// Initialize service with repository
const repository = new MongoEventBookingRepository();
const bookingService = new EventBookingService(repository);

exports.createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventSpaceBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getEventSpaceBookings(req.params.eventSpaceId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { eventSpaceId, startDateTime, endDateTime } = req.query;
    
    if (!eventSpaceId || !startDateTime || !endDateTime) {
      return res.status(400).json({ 
        error: 'Missing required parameters: eventSpaceId, startDateTime, or endDateTime' 
      });
    }

    const isAvailable = await EventBooking.isTimeSlotAvailable(
      eventSpaceId,
      new Date(startDateTime),
      new Date(endDateTime)
    );

    res.json({ 
      available: isAvailable,
      eventSpaceId,
      startDateTime,
      endDateTime
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getEventPackages = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is required' });
    }

    const packages = await EventPackage.find({
      restaurantId,
      isActive: true
    }).sort({ price: 1 });

    // If no packages are found, create default packages
    if (packages.length === 0) {
      const defaultPackages = [
        {
          name: 'Basic Package',
          description: 'Perfect for small gatherings and meetings',
          price: 500,
          maxCapacity: 50,
          restaurantId,
          amenities: ['Basic AV Equipment', 'Water Service', 'Basic Setup'],
          isActive: true
        },
        {
          name: 'Premium Package',
          description: 'Ideal for medium-sized events and conferences',
          price: 1000,
          maxCapacity: 100,
          restaurantId,
          amenities: ['Premium AV Equipment', 'Full Catering', 'Custom Setup', 'Event Staff'],
          isActive: true
        },
        {
          name: 'Deluxe Package',
          description: 'Perfect for large events and special occasions',
          price: 2000,
          maxCapacity: 200,
          restaurantId,
          amenities: ['Professional AV System', 'Premium Catering', 'Custom Decor', 'Full Staff', 'Valet Parking'],
          isActive: true
        }
      ];

      // Save default packages to database
      const savedPackages = await EventPackage.insertMany(defaultPackages);
      return res.json(savedPackages);
    }

    res.json(packages);
  } catch (error) {
    console.error('Error fetching event packages:', error);
    res.status(500).json({ error: 'Failed to fetch event packages' });
  }
};

exports.getRestaurantBookings = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const bookings = await EventBooking.find({ restaurantId })
      .populate('eventPackageId')
      .sort({ startDateTime: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching restaurant bookings:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant bookings' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the booking first to check if it exists and get customer details
    const booking = await EventBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Send deletion email before deleting the booking
    await sendBookingDeletionEmail(booking);

    // Delete the booking
    await EventBooking.findByIdAndDelete(id);
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the booking first to check if it exists
    const booking = await EventBooking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update the booking status to confirmed
    const updatedBooking = await EventBooking.findByIdAndUpdate(
      id,
      { status: 'confirmed' },
      { new: true }
    ).populate('eventPackageId');

    // Send approval email
    await sendBookingApprovalEmail(updatedBooking);
    
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ error: 'Failed to approve booking' });
  }
};
