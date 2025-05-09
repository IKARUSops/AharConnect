const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

// Import all routes
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? false : "http://localhost:5173", // Replace with your frontend URL in development
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

const PORT = process.env.PORT || 8000;

// CORS configuration - more restrictive in production
if (process.env.NODE_ENV === "production") {
  app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
  }));
} else {
  app.use(cors()); // More permissive in development
}

app.use(express.json());

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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// MongoDB Connection
const dbUrl = process.env.MONGODB_URL || process.env.MONGO_URI;
if (!dbUrl) {
    console.error('MongoDB connection URI is not defined in environment variables.');
    process.exit(1); 
}

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  });

// Direct expense route handler from GitHub file
// This needs to be defined BEFORE the router to prevent conflicts
app.post('/api/expenses/create', (req, res) => {
  // Handle the expense data sent in the request body here
  console.log('Received expense data:', req.body); // Debug output
  res.status(201).send({ message: 'Expense created successfully' });
});

// Routes - define API routes before static file serving
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/expenses', expenseRoutes);

// Route to handle menu item creation with image upload (from GitHub file)
app.post('/api/menu/upload', upload.single('image'), (req, res) => {
  const { name, description, price } = req.body;
  const imagePath = req.file ? req.file.path : null;

  console.log('Menu item created:', { name, description, price, imagePath });
  res.status(201).send({ message: 'Menu item created successfully', imagePath });
});

// Maintain backward compatibility with the GitHub file's direct route
app.post('/api/menu', upload.single('image'), (req, res) => {
  const { name, description, price } = req.body;
  const imagePath = req.file ? req.file.path : null;

  console.log('Menu item created:', { name, description, price, imagePath });
  res.status(201).send({ message: 'Menu item created successfully', imagePath });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create middleware to parse URL-encoded form data (needed for some form submissions)
app.use(express.urlencoded({ extended: true }));

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Example of emitting an event to the client
    socket.emit('message', 'Welcome to AharConnect!');

    // Example of listening to an event from the client
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        // Example of broadcasting a message to all clients
        io.emit('chat message', msg);
    });
    
    // Example: Broadcasting order updates
    socket.on('orderUpdate', (order) => {
        io.emit('orderUpdated', order);
    });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
