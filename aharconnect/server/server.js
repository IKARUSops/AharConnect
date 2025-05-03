const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes); // Register expense routes
app.use('/api/inventory', inventoryRoutes);

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
  console.log('Received expense data:', req.body); // Debug output
  res.status(201).send({ message: 'Expense created successfully' }); // Respond with a 201 status to confirm the expense was created.
});

// Route to handle menu item creation with image upload
app.post('/api/menu', upload.single('image'), (req, res) => {
  const { name, description, price } = req.body;
  const imagePath = req.file ? req.file.path : null;

  // Save menu item details to the database (pseudo-code)
  // MenuItem.create({ name, description, price, image: imagePath })
  //   .then(item => res.status(201).json(item))
  //   .catch(err => res.status(500).json({ error: err.message }));

  console.log('Menu item created:', { name, description, price, imagePath });
  res.status(201).send({ message: 'Menu item created successfully', imagePath });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
}).catch(err => console.error('MongoDB connection error:', err));








