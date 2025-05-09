const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    if (!['Restaurant', 'Foodie'].includes(type)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, type });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!['Restaurant', 'Foodie'].includes(type)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const user = await User.findOne({ email, type });
    if (!user) return res.status(400).json({ error: 'No user found. Please check your email, password, and user type.' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'Login successful', token });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// exports.logout = async (req, res) => {
//   try {
//     // If using token invalidation, implement logic here (e.g., blacklist the token)
//     res.status(200).json({ message: 'Logout successful' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };
