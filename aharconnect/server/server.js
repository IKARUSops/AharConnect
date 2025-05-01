
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
// Include your routes
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes); // <--- This is the important part


// app.post('/api/expenses', (req, res) => {
//   // Handle the expense data sent in the request body here.
//   // For example, you might want to save it to a database.
//   console.log('Received expense data:', req.body); // Debug output
//   res.status(201).send({ message: 'Expense created successfully' }); // Respond with a 201 status to confirm the expense was created.
// });


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
}).catch(err => console.error('MongoDB connection error:', err));








