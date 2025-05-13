const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    console.log('Signup attempt:', { name, email, type }); // Log signup attempt (without password)

    if (!['Restaurant', 'Foodie'].includes(type)) {
      console.log('Invalid user type during signup:', type);
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const exists = await User.findByEmail(email);
    if (exists) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');
    
    const newUser = await User.createUser({ 
      name, 
      email, 
      password: hashedPassword, 
      type 
    });
    console.log('User created successfully:', email);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, type } = req.body;
    console.log('Login attempt:', { email, type }); // Log login attempt (without password)

    if (!['Restaurant', 'Foodie'].includes(type)) {
      console.log('Invalid user type:', type);
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const user = await User.findByEmailAndType(email, type);
    console.log('User found:', user ? 'Yes' : 'No'); // Log if user was found

    if (!user) {
      console.log('No user found with email:', email, 'and type:', type);
      return res.status(400).json({ error: 'No user found. Please check your email, password, and user type.' });
    }

    const validPass = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPass ? 'Yes' : 'No'); // Log password validation result

    if (!validPass) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Login successful for user:', email);

    res.status(200).json({ message: 'Login successful', token });
    
  } catch (err) {
    console.error('Login error:', err);
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
