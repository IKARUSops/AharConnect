const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id }; // Attach the user ID to the request
    console.log('Decoded Token:', decoded);
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
