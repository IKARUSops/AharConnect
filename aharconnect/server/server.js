const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const Restaurant = require('./models/restaurantModel');
const authMiddleware = require('./middleware/authMiddleware');
const restaurantService = require('./services/mongoRestaurantService');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const eventReservationRoutes = require('./routes/eventReservationRoutes');
const eventBookingRoutes = require('./routes/eventBookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/event-reservations', eventReservationRoutes);
app.use('/api/event-bookings', eventBookingRoutes);

// Restaurant profile routes
app.get('/api/restaurants/profile', authMiddleware, async (req, res) => {
  try {

    const restaurant = await Restaurant.findOne({ user: req.user._id });
    
    if (!restaurant) {

      return res.json(null); // Return null instead of 404 to indicate no profile exists
    }
    

    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/restaurants/profile', authMiddleware, async (req, res) => {
  try {


    const {
      name,
      description,
      address,
      phone,
      email,
      openingHours,
      cuisine,
      capacity,
      image,
      reservationsEnabled
    } = req.body;

    let restaurant = await Restaurant.findOne({ user: req.user._id });

    if (restaurant) {
      // Update existing profile
      restaurant = await Restaurant.findOneAndUpdate(
        { user: req.user._id },
        {
          name,
          description,
          address,
          phone,
          email,
          openingHours,
          cuisine,
          capacity,
          image,
          reservationsEnabled: reservationsEnabled !== undefined ? reservationsEnabled : restaurant.reservationsEnabled
        },
        { new: true }
      );
    } else {
      // Create new profile
      restaurant = new Restaurant({
        user: req.user._id,
        name,
        description,
        address,
        phone,
        email,
        openingHours,
        cuisine,
        capacity,
        image,
        reservationsEnabled: reservationsEnabled !== undefined ? reservationsEnabled : true
      });
      await restaurant.save();
    }


    res.json(restaurant);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
  }
  }
});

app.post('/api/expenses', (req, res) => {
  // Handle the expense data sent in the request body here.
  // For example, you might want to save it to a database.

  res.status(201).send({ message: 'Expense created successfully' }); // Respond with a 201 status to confirm the expense was created.
});

// Route to handle menu item creation with image upload
app.post('/api/menu', (req, res) => {
    const { name, description, price, image } = req.body;
    // Save menu item details to the database (pseudo-code)
    // MenuItem.create({ name, description, price, image })
    //   .then(item => res.status(201).json(item))
    //   .catch(err => res.status(500).json({ error: err.message }));

    res.status(201).send({ message: 'Menu item created successfully', image });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
    console.log('MongoDB connected');
    // Seed initial restaurant data
    try {
      await restaurantService.seedInitialData();
    } catch (err) {
      console.error('Error seeding data:', err);
    }
    app.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
}).catch(err => console.error('MongoDB connection error:', err));








