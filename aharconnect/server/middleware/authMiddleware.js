const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authenticate user from JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required', error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Decoded Token:', decoded);
    
    // Find user by ID - support both userId and id in token
    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach full user object to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid token', error: 'Invalid token.' });
  }
};

/**
 * Authorize based on user roles
 * @param {Array} roles - Array of authorized roles
 */
const authorizeRole = (roles) => async (req, res, next) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Authentication required" });

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    next();
  } catch (error) { 
    console.error('Authorization error:', error);
    return res.status(500).json({ message: "Server error" }); 
  }
};

// Create a simplified middleware function for backward compatibility
const simpleAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Decoded Token:', decoded);
    
    // Match the exact format from git version
    req.user = { _id: decoded.id || decoded.userId };
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = {
  authenticateToken: authenticate,
  authorizeRoles: authorizeRole,
  authMiddleware: simpleAuthMiddleware // For backward compatibility with exact same behavior
};
